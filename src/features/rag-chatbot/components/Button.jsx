import { Loader2 } from "lucide-react";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  icon: Icon,
  onClick,
  className = "",
  fullWidth = false,
}) => {
  // Base styles
  const baseStyles =
    "cursor-pointer inline-flex items-center justify-center text-sm rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Variant styles
  const variantStyles = {
    primary:
      "text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm border border-white/20",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105",
    danger: "text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm border border-red-200/50",
    outline:
      "bg-transparent border-1 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 transition-all duration-300 hover:shadow-md transform hover:scale-105",
  };

  // Size styles
  const sizeStyles = {
    sm: "text-xs px-3 py-2 rounded-lg",
    md: "text-sm px-4 py-2.5 rounded-xl",
    lg: "text-base px-6 py-3 rounded-xl",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      style={
        variant === 'primary' ? {
          backgroundColor: '#332771',
          borderColor: '#332771',
          '--tw-ring-color': '#332771',
          boxShadow: '0 2px 8px rgba(51, 39, 113, 0.2)'
        } : variant === 'danger' ? {
          backgroundColor: '#dc2626',
          borderColor: '#dc2626',
          '--tw-ring-color': '#dc2626',
          boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
        } : {}
      }
      onMouseEnter={(e) => {
        if (!disabled && !isLoading) {
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = '#d93311';
            e.currentTarget.style.borderColor = '#d93311';
            e.currentTarget.style.boxShadow = '0 3px 12px rgba(217, 51, 17, 0.25)';
          } else if (variant === 'danger') {
            e.currentTarget.style.backgroundColor = '#b91c1c';
            e.currentTarget.style.borderColor = '#b91c1c';
            e.currentTarget.style.boxShadow = '0 3px 12px rgba(185, 28, 28, 0.25)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isLoading) {
          if (variant === 'primary') {
            e.currentTarget.style.backgroundColor = '#332771';
            e.currentTarget.style.borderColor = '#332771';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(51, 39, 113, 0.2)';
          } else if (variant === 'danger') {
            e.currentTarget.style.backgroundColor = '#dc2626';
            e.currentTarget.style.borderColor = '#dc2626';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.2)';
          }
        }
      }}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" style={{color: variant === 'primary' ? 'white' : '#332771'}} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="h-4 w-4 mr-1" />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
