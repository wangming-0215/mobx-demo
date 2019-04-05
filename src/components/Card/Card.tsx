import React from 'react';
import classNames from 'classnames';

import './Card.scss';

interface ICardProps {
	className?: string;
	children?: JSX.Element;
}

function Card({ className, children, ...htmlProps }: ICardProps) {
	const cardClasses = classNames('player-card', className);

	return (
		<div className={cardClasses} {...htmlProps}>
			{children}
		</div>
	);
}

export default Card;
