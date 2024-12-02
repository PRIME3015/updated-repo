import React from "react";

const Badge = ({ children, className }) => {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
