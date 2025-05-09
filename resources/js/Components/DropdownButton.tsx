import { ButtonHTMLAttributes } from 'react';

const DropdownButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...rest }) => {
  return (
    <button
      className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800 "text-base" font-medium transition duration-150 ease-in-out focus:outline-none`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default DropdownButton;
