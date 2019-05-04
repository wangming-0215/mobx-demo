import React from 'react';

import Control from './components/Control/Control';
import Title from './components/Title/Title';
import Picture from './components/Picture/Picture';
import Progress from './components/Progress/Progress';
import useAudio, { STATUS } from './common/useAudio';
import { ISong } from './common/types';
import './Player.scss';

interface IPlayerProps {
  playList: ISong[];
}

function Player({ playList = [] }: IPlayerProps) {
  const {
    status,
    play,
    pause,
    next,
    prev,
    sound,
    duration,
    progress
  } = useAudio(playList);

  console.log(progress);

  return (
    <div className="player-container">
      <div className="player-panel">
        <Title name={sound.name} singer={sound.singer.join('/')} />
        <Picture isPlay={status === STATUS.PLAYING} url={sound.pic} />
      </div>
      <Progress percent={progress} duration={duration} />
      <div className="player-control">
        <Control type="previous" size="small" onClick={prev} />
        {status === STATUS.PLAYING ? (
          <Control type="pause" onClick={pause} />
        ) : (
          <Control type="play" onClick={play} />
        )}
        <Control type="next" size="small" onClick={next} />
      </div>
    </div>
  );
}

export default Player;
