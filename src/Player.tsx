import React, { useState, useEffect } from 'react';

import Control from './components/Control/Control';
import Title from './components/Title/Title';
import Picture from './components/Picture/Picture';
import Progress from './components/Progress/Progress';
import useAudio from './common/useAudio';
import { ISong } from './common/types';
import './Player.scss';

interface IPlayerProps {
	playList: ISong[];
}

function Player({ playList = [] }: IPlayerProps) {
	const [index, setIndex] = useState(1);
	const song = playList[index];

	const { play, paused, pause, duration, progress } = useAudio(song);

	const handlePlay = () => {
		if (paused) {
			play();
		} else {
			pause();
		}
	};

	return (
		<div className="player-container">
			<div className="player-panel">
				<Title name={song.name} singer={song.singer.join('/')} />
				<Picture isPlay={!paused} url={song.pic} />
			</div>
			<Progress percent={progress} duration={duration} />
			<div className="player-control">
				<Control type="previous" size="small" />
				<Control type={!paused ? 'pause' : 'play'} onClick={handlePlay} />
				<Control type="next" size="small" />
			</div>
		</div>
	);
}

export default Player;
