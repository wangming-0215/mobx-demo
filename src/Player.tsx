import React, { useState, useEffect } from 'react';

import Control from './components/Control/Control';
import Title from './components/Title/Title';
import Picture from './components/Picture/Picture';
import useAudio from './common/useAudio';
import { ISong, STATUS } from './common/types';
import './Player.scss';

interface IPlayerProps {
	playList: ISong[];
}

function Player({ playList = [] }: IPlayerProps) {
	const [index, setIndex] = useState(0);
	const [paused, setPasued] = useState(true);
	const song = playList[index];

	const { play } = useAudio(song);

	const handlePlay = () => {
		console.log('PLAY');
		setPasued(!paused);
		play();
	};

	return (
		<div className="player-container">
			<div className="player-panel">
				<Title name={song.name} singer={song.singer.join('/')} />
				<Picture isPlay={!paused} url={song.pic} />
			</div>
			<div className="player-control">
				<Control type="previous" size="small" />
				<Control type={!paused ? 'pause' : 'play'} onClick={handlePlay} />
				<Control type="next" size="small" />
			</div>
		</div>
	);
}

export default Player;
