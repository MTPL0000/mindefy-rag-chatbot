import { EyeOff, Eye, AlertCircle } from "lucide-react";

const InputField = ({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  error,
  name,
  showPasswordToggle = false,
  onTogglePassword,
  showPassword = false,
  max,
}) => {
  const hasValue = value && value.length > 0;
  
  return (
    <div className="space-y-1">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={showPasswordToggle && showPassword ? "text" : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          max={max}
          className={`
              w-full pl-10 py-3 border-2 rounded-lg transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-2 placeholder:text-gray-400
              ${showPasswordToggle ? "pr-12" : "pr-4"}
              ${hasValue ? "text-gray-900" : "text-gray-400"}
              ${
                error
                  ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }
            `}
          style={{
            '--tw-ring-color': error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(51, 39, 113, 0.2)',
            colorScheme: 'light'
          }}
          onFocus={(e) => {
            if (!error) {
              e.target.style.borderColor = '#332771';
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.target.style.borderColor = '#d1d5db';
            }
          }}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center w-12"
            onClick={onTogglePassword}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center space-x-1 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default InputField;
