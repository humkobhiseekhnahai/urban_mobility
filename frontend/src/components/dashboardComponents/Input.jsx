export const Input = ({
  icon: Icon,
  size = "md",
  placeholder = "Enter text",
}) => {
  const sizeClasses = {
    sm: "h-8 text-sm",
    md: "h-10 text-base",
    lg: "h-12 text-lg",
  };

  return (
    <div
      className={`w-full flex items-center border border-white rounded-md px-4 ${sizeClasses[size]}`}
    >
      {Icon && <Icon className="text-white mr-2" />}
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-transparent text-white outline-none"
      />
    </div>
  );
};
