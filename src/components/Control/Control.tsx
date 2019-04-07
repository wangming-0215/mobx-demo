import React from 'react';

import Icon from '../Icon/Icon';
import { iconPaths } from '../../common/iconPaths';
import './Control.scss';

interface IControlProps {
  type?: keyof iconPaths;
  size?: 'large' | 'small';
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const SIZE_LARGE = 60;
const SIZE_SMALL = 40;

function Control({
  type = 'play',
  size = 'large',
  onClick = () => {}
}: IControlProps) {
  const btnSize = size === 'large' ? SIZE_LARGE : SIZE_SMALL;

  return (
    <button className="player-control-btn" onClick={onClick}>
      <Icon icon={type} iconSize={btnSize} color="#fff" />
    </button>
  );
}

export default React.memo(Control);
