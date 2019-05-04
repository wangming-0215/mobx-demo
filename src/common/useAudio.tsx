import { useRef, useState, useEffect } from 'react';

import { ISong } from './types';
import * as utils from './utils';
import useInterval from './useInterval';

interface IBufferCache {
  [key: string]: AudioBuffer;
}

export enum STATUS {
  PENDING = 'pending', // 初始状态
  LOADING = 'loading', // 加载数据
  PAUSED = 'paused', // 暂停
  PLAYING = 'playing', // 播放
  END = 'end' // 结束
}

export enum PLAYTYPE {
  LISTCYCLE = 'list cycle', // 列表循环
  LIST = 'list', // 列表播放
  SINGLE = 'single' // 单曲循环
}

type MaybeAudioBufferSourceNode = AudioBufferSourceNode | null;

interface IAudioGlobal {
  context: AudioContext;
  sourceBuffer: IBufferCache;
  sourceNode: MaybeAudioBufferSourceNode;
  duration: number;
}

interface IOptions {
  playType?: PLAYTYPE;
}

function useAudio(playList: ISong[], options: IOptions = {}) {
  const audioGlobal = useRef<IAudioGlobal>({
    context: new AudioContext(),
    sourceBuffer: {},
    sourceNode: null,
    duration: 0
  });

  // 音频索引
  const [index, setIndex] = useState<number>(0);

  // 播放器状态
  const [status, setStatus] = useState<STATUS>(STATUS.PENDING);

  // 当前播放的音频
  const [sound, setSound] = useState<ISong>(playList[index]);

  // 开始播放时间
  const [startTime, setStartTime] = useState<number>(0);

  // 播放偏移量
  const [startOffset, setStartOffset] = useState<number>(0);

  // 播放进度
  const [progress, setProgress] = useState<number>(0);

  useInterval(
    () => {
      const { context, sourceBuffer } = audioGlobal.current;
      const offset = startOffset + context.currentTime - startTime;
      const buffer = sourceBuffer[sound.url];
      const progress = offset / buffer.duration;
      setProgress(progress);
      if (progress >= 1) {
        setStatus(STATUS.END);
      }
    },
    status === STATUS.PLAYING ? 500 : null
  );

  useEffect(() => {
    function _loadAudio() {
      // 重置状态
      setStartOffset(0);
      setStartTime(0);
      setProgress(0);
      const { context, sourceBuffer } = audioGlobal.current;
      if (sourceBuffer[sound.url]) {
        audioGlobal.current.duration = sourceBuffer[sound.url].duration;
        setStatus(STATUS.PLAYING);
      } else {
        utils
          .loadSound(sound.url)
          .then(data => context.decodeAudioData(data as ArrayBuffer))
          .then(buffer => {
            let { sourceBuffer } = audioGlobal.current;
            sourceBuffer[sound.url] = buffer;
            audioGlobal.current.duration = buffer.duration;
            setStatus(STATUS.PLAYING);
          });
      }
    }

    function _playback() {
      const buffer = audioGlobal.current.sourceBuffer[sound.url];
      const { context } = audioGlobal.current;
      const sourceNode = context.createBufferSource();
      sourceNode.buffer = buffer;
      sourceNode.connect(context.destination);
      sourceNode.start(0, startOffset % buffer.duration);
      audioGlobal.current.sourceNode = sourceNode;
      setStartTime(context.currentTime);
    }

    function _pause() {
      const { sourceNode } = audioGlobal.current;
      sourceNode!.stop(0);
    }

    function _end() {
      const { playType = PLAYTYPE.LISTCYCLE } = options;
      if (playType === PLAYTYPE.LISTCYCLE) {
        const nextIndex = (index + 1) % playList.length;
        setSound(playList[nextIndex]);
        setIndex(nextIndex);
        setStatus(STATUS.LOADING);
      }
    }

    if (status === STATUS.LOADING) {
      _loadAudio(); // 加载
    } else if (status === STATUS.PLAYING) {
      _playback(); // 播放
    } else if (status === STATUS.PAUSED) {
      _pause(); // 暂停
    } else if (status === STATUS.END) {
      _end();
    }
  }, [status]);

  function play() {
    if (status === STATUS.PAUSED) {
      setStatus(STATUS.PLAYING);
    } else {
      setStatus(STATUS.LOADING);
    }
  }

  function pause() {
    const { context } = audioGlobal.current;
    const offset = startOffset + context.currentTime - startTime;
    setStartOffset(offset);
    setStatus(STATUS.PAUSED);
  }

  function skipTo(index: number) {
    const { sourceNode } = audioGlobal.current;
    if (sourceNode) {
      sourceNode.stop(0);
    }
    setSound(playList[index]);
    setIndex(index);
    setStatus(STATUS.LOADING);
  }

  function next() {
    const nextIndex = (index + 1) % playList.length;
    skipTo(nextIndex);
  }

  function prev() {
    const prevIndex = (index - 1 + playList.length) % playList.length;
    skipTo(prevIndex);
  }

  return {
    status,
    sound,
    play,
    pause,
    next,
    prev,
    duration: audioGlobal.current.duration,
    progress
  };
}

export default useAudio;
