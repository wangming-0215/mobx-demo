import React from 'react';

export interface IPlayerContext {
	isPlaying?: boolean;
	onPlay: (event: React.MouseEvent<HTMLElement>) => void;
}

export const PlayerContext = React.createContext<IPlayerContext>({
	isPlaying: false,
	onPlay: () => {}
});
