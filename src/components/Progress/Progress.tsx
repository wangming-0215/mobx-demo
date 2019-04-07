import React from 'react';

import './Progress.scss';

type ProgressProps = {
  percent?: number;
  duration?: number;
};

function padded(input: number): string {
  return input >= 10 ? '' + input : '0' + input;
}

function formatDuration(duration: number): string {
  const minute = ~~(duration / 60);
  const second = ~~(duration % 60);
  return `${padded(minute)}:${padded(second)}`;
}

function Progress({ percent = 0.0, duration = 0 }: ProgressProps) {
  const played = percent * duration;
  return (
    <div className="player-progress-wrap">
      <div className="time">{formatDuration(played)}</div>
      <div className="player-progress">
        <div
          className="player-progress-bar"
          style={{ width: `${percent * 100}%` }}
        />
      </div>
      <div className="time">{formatDuration(duration)}</div>
    </div>
  );
}

export default Progress;
