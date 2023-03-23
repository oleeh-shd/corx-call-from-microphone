import React, { FC } from 'react';
import cn from 'classnames';

import styles from './button.module.scss';

type ButtonProps = {
  titleBtn: JSX.Element | string;
  onClick: () => void;
  isDisabled?: boolean;
  styled?: string;
};
const Button: FC<ButtonProps> = ({ titleBtn, onClick, isDisabled, styled }) => {
  return (
    <div
      onClick={onClick}
      className={cn(styles.button,isDisabled && styles.isDisabled, styled)}
    >
      {titleBtn}
    </div>
  );
};

export default Button;
