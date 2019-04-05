export interface ISong {
	url: string;
	singer: string[];
	pic: string;
	name: string;
	buffer?: AudioBuffer;
}

export enum STATUS {
	PLAY = 'play',
	PAUSE = 'pause'
}
