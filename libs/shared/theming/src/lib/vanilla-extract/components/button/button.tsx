'use client';

import React from 'react';
import {
  buttonBase,
  buttonVariants,
  buttonSizes,
  buttonColors,
} from './button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  children,
  className,
  ...props
}) => {
  const classes = [
    buttonBase,
    buttonVariants[variant],
    buttonSizes[size],
    color !== 'primary' ? buttonColors[color] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
