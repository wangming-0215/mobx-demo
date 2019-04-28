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
  LOADED = 'loaded', // 加载完成
  PAUSED = 'paused', // 暂停
  PLAYING = 'playing', // 播放
  END = 'end' // 结束
}

type MaybeAudioBufferSourceNode = AudioBufferSourceNode | null;

interface IAudioGlobal {
  context: AudioContext;
  sourceBuffer: IBufferCache;
  sourceNode: MaybeAudioBufferSourceNode;
  duration: number;
}

function useAudio(playList: ISong[]) {
  const audioGlobal = useRef<IAudioGlobal>({
    context: new AudioContext(),
    sourceBuffer: {},
    sourceNode: null,
    duration: 0
  });

  // 播放器状态
  const [status, setStatus] = useState<STATUS>(STATUS.PENDING);

  // 当前播放的音频
  const [sound, setSound] = useState<ISong>(playList[0]);

  // 开始播放时间
  const [startTime, setStartTime] = useState<number>(0);

  // 播放偏移量
  const [startOffset, setStartOffset] = useState<number>(0);

  // 播放进度
  const [progress, setProgress] = useState<number>(0);

  function _loadAudio() {
    const { context } = audioGlobal.current;
    utils
      .loadSound(sound.url)
      .then(data => context.decodeAudioData(data as ArrayBuffer))
      .then(buffer => {
        let { sourceBuffer } = audioGlobal.current;
        sourceBuffer[sound.url] = buffer;
        audioGlobal.current.duration = buffer.duration;
        setStatus(STATUS.LOADED);
      });
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
    setStatus(STATUS.PLAYING);
  }

  function _pause() {
    const { sourceNode } = audioGlobal.current;
    sourceNode!.stop(0);
  }

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
    if (status === STATUS.LOADING) {
      _loadAudio(); // 加载
    } else if (status === STATUS.LOADED) {
      _playback(); // 播放
    } else if (status === STATUS.PAUSED) {
      _pause(); // 暂停
    } else if (status === STATUS.END) {
      console.log('end');
    }
  }, [status]);

  function play() {
    if (status === STATUS.PAUSED) {
      setStatus(STATUS.LOADED);
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

  return {
    status,
    sound,
    play,
    pause,
    duration: audioGlobal.current.duration,
    progress
  };
}

export default useAudio;
