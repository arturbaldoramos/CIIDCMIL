import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-black text-white w-40 py-2 px-4 rounded transition-colors hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;