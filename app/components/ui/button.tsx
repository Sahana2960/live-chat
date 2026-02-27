import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline:
      "border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 focus:ring-blue-500",
    ghost:
      "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 focus:ring-blue-500",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
