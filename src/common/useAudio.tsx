import { useState, useEffect, useRef } from 'react';

import { ISong } from './types';
interface IBufferCache {
	[key: string]: AudioBuffer;
}

interface IAudioGlobal {
	context: AudioContext;
	sourceBuffer: IBufferCache;
	sourceNode?: AudioBufferSourceNode;
}

/**
 * use audio
 *
 * 处理一首歌的状态，包括播放， 暂停， 停止等。切换歌曲交给播放器组件处理。
 *
 * 坑：
 *  1. sourceNode.start() 对于每个sourceNode 只能执行一次，所以每次播放要创建一个新的sourceNode
 *  2. AudioContext.currentTime 是相对于当前时间一直在增加的
 *  3. sourceNode 和 buffer 应该挂载到 ref 还是 state 上
 *
 * @param url 歌曲链接
 *
 */
function useAudio(song: ISong) {
	// context 贯穿整个渲染过程，且保持不变。故而存储在ref中。
	const audioGlobal = useRef<IAudioGlobal>({
		context: new AudioContext(),
		sourceBuffer: {}
	});

	const [paused, setPaused] = useState(true);
	const [ended, setEnded] = useState(false);
	const [loaded, setLoaded] = useState(false);

	const [startOffset, setStartOffset] = useState(0);
	const [startTime, setStartTime] = useState(0);

	const [progress, setProgress] = useState(0);

	const [duration, setDuration] = useState(0);

	// 歌曲切换时，加载歌曲
	useEffect(() => {
		setLoaded(false);
		const xhr = new XMLHttpRequest();
		xhr.open('GET', song.url);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function loaded() {
			const { context, sourceBuffer } = audioGlobal.current;
			context.decodeAudioData(xhr.response, buffer => {
				sourceBuffer[song.url] = buffer;
				setDuration(buffer.duration);
				setLoaded(true);
			});
		};
		xhr.send();
	}, [song.url]);

	// 播放歌曲
	useEffect(() => {
		if (loaded && !paused) {
			const { context, sourceBuffer } = audioGlobal.current;
			const sourceNode = context.createBufferSource();
			const buffer = sourceBuffer[song.url];
			sourceNode.buffer = buffer;
			sourceNode.connect(context.destination);
			sourceNode.start(0, startOffset % buffer.duration);
			audioGlobal.current.sourceNode = sourceNode;

			// 播放进度
			const id = setInterval(() => {
				const offset = startOffset + context.currentTime - startTime;
				setProgress(offset / buffer.duration);
			}, 500);
			return () => clearInterval(id);
		}
	}, [paused, loaded, song]);

	// 播放结束, 重置状态
	useEffect(() => {
		if (progress >= 1) {
			// 修正结束时定时器可能会导致的一秒误差
			setProgress(1);
			setPaused(true);
			setEnded(true);
			setStartOffset(0);
			setStartTime(0);
		}
	}, [progress]);

	const play = () => {
		setPaused(false);
		const { context } = audioGlobal.current;
		setStartTime(context.currentTime);
	};

	const pause = () => {
		const { sourceNode, context } = audioGlobal.current;
		if (sourceNode) {
			sourceNode.stop(0);
			setPaused(true);
			setStartOffset(startOffset + context.currentTime - startTime);
		}
	};

	console.log('progress: ', progress);

	return {
		paused,
		ended,
		loaded,
		play,
		pause,
		duration,
		progress
	};
}

export default useAudio;
