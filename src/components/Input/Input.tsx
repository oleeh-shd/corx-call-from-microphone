import React, { ChangeEvent, FC } from 'react';

import cn from 'classnames';
import styles from './input.module.scss'

type InputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: 'text' | 'password';
  onIconClick?: () => void;
  showPassword?: boolean;
  error?: boolean | string;
  access?: boolean;
}
const Input: FC<InputProps> = ({
           value,
           onChange,
           type = 'text',
           placeholder,
           error,
           access,
           showPassword,
           onIconClick
       }) => {

  return (
    <div className={styles.inputWrapper}>
      <input
        className={cn(styles.input, error && styles.error, !error && access && styles.access)}
        type={type}
        value={value}
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
