export default function IconBtn({
  text,
  onClick,
  children,
  disabled,
  outline = false,
  customClasses,
  type = "button",
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
        outline 
          ? "border-2 border-academic-gold-500 bg-transparent text-academic-gold-600 hover:bg-academic-gold-50 hover:text-academic-gold-700" 
          : "bg-academic-gold-500 text-white hover:bg-academic-gold-600 shadow-elegant hover:shadow-lg transform hover:scale-[1.02]"
      } ${
        disabled 
          ? "cursor-not-allowed opacity-50 hover:transform-none hover:shadow-none" 
          : "cursor-pointer"
      } ${customClasses}`}
    >
      {children}
      {text}
    </button>
  )
}
