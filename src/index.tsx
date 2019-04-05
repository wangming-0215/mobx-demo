import React from 'react';
import ReactDOM from 'react-dom';

import Player from './Player';
import { songs } from './common/songs';
import './index.scss';

ReactDOM.render(<Player playList={songs} />, document.getElementById('root'));
