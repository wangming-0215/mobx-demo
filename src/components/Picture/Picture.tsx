import React from 'react';
import classNames from 'classnames';

import './Picture.scss';

interface IPictureProps {
  isPlay?: boolean;
  url?: string;
}

function Picture({ isPlay = false, url = '' }: IPictureProps) {
  const pictureClasses = classNames('picture', { play: isPlay });
  return (
    <div className="player-song-picture">
      <div className={pictureClasses}>
        <img src={url} alt="" />
      </div>
    </div>
  );
}

export default Picture;
