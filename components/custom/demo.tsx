import React from "react";

const Demo = ({
  label = "DEMO",
  position = "top-right", // top-right, top-left, bottom-right, bottom-left
  variant = "orange", // orange, blue, green, red, purple
  size = "sm", // xs, sm, md
  className = "",
  style = {},
  ...props
}) => {
  const positions = {
    "top-right": "absolute -top-1 -right-1 z-10",
    "top-left": "absolute -top-1 -left-1 z-10",
    "bottom-right": "absolute -bottom-1 -right-1 z-10",
    "bottom-left": "absolute -bottom-1 -left-1 z-10",
  };

  const variants = {
    orange: "bg-orange-500 text-white border-orange-600",
    blue: "bg-blue-500 text-white border-blue-600",
    green: "bg-green-500 text-white border-green-600",
    red: "bg-red-500 text-white border-red-600",
    purple: "bg-purple-500 text-white border-purple-600",
  };

  const sizes = {
    xs: "text-xs px-1.5 py-0.5",
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
  };

  return (
    <span
      className={`
        ${positions[position]}
        ${variants[variant]}
        ${sizes[size]}
        inline-flex items-center
        rounded-full
        font-bold
        uppercase
        tracking-wide
        border-2
        shadow-sm
        ${className}
      `}
      style={style}
      data-demo-badge="true"
      {...props}
    >
      {label}
    </span>
  );
};

export default Demo;
