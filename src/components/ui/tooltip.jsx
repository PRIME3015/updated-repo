import React from "react";

const Tooltip = ({ content, children }) => (
  <div className="relative flex items-center group">
    {children}
    <div className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
      {content}
    </div>
  </div>
);

export default Tooltip;
