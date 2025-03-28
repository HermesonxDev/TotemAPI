import React from "react";

interface IListOrderBoxProps {
    children: React.ReactNode
}

const ListOrderBox: React.FC<IListOrderBoxProps> = ({ children }) => {
  return (
    <div className="w-full h-full p-2 flex flex-col gap-2 overflow-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-white">
      {children}
    </div>
  );
};

export default ListOrderBox;
