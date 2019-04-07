import React from 'react';
import classNames from 'classnames';

import { iconPaths } from '../../common/iconPaths';
import './Icon.scss';

type MaybeElement = JSX.Element | false | null | undefined;
type IconName = 'play' | 'pause' | 'next' | 'previous';

interface IIconProps {
  children?: never;
  tagName?: keyof JSX.IntrinsicElements;
  color?: string;
  htmlTitle?: string;
  icon: IconName | MaybeElement;
  iconSize?: number;
  style?: React.CSSProperties;
  title?: string | null | false;
  className?: string;
}

const SIZE_STANDARD = 16;

function renderSvgPaths(iconName: IconName) {
  const pathStrings = iconPaths[iconName];

  if (pathStrings == null) {
    return null;
  }

  return pathStrings.map((d: string, i: number) => (
    <path key={i} d={d} fillRule="evenodd" />
  ));
}

function Icon({
  tagName: TagName = 'span',
  color,
  htmlTitle,
  icon,
  iconSize = SIZE_STANDARD,
  title = icon as string,
  className,
  ...htmlProps
}: IIconProps) {
  if (icon == null || typeof icon === 'boolean') {
    return null;
  } else if (typeof icon !== 'string') {
    return icon;
  }

  const paths = renderSvgPaths(icon);

  const iconClasses = classNames('player-icon', className);

  return (
    <TagName {...htmlProps} className={iconClasses} title={htmlTitle}>
      <svg
        fill={color}
        data-icon={icon}
        width={iconSize}
        height={iconSize}
        viewBox="0 0 1024 1024"
      >
        {title && <desc>{title}</desc>}
        {paths}
      </svg>
    </TagName>
  );
}

export default Icon;
