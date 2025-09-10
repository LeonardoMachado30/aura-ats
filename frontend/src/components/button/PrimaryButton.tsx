import React, { ButtonHTMLAttributes, useEffect, useState } from 'react';

export type SimpleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const PrimaryButton: React.FC<SimpleButtonProps> = ({
  loading: loadingProp = false,
  disabled,
  children,
  className = '',
  onClick,
  type = 'button',
  ...rest
}) => {
  const [loading, setLoading] = useState<boolean>(loadingProp);

  // Sincroniza loading externo com interno
  useEffect(() => {
    setLoading(loadingProp);
  }, [loadingProp]);

  return (
    <button
      type={type}
      className={`bg-primary text-white py-2 px-3 rounded-[12px] text-sm flex gap-2 border-none cursor-pointer transition-all duration-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] items-center justify-center hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={loading || disabled}
      onClick={onClick}
      {...rest}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export { PrimaryButton };
