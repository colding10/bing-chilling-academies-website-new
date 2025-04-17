interface CyberButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: "button" | "submit" | "reset"
}

export default function CyberButton({
  children,
  onClick,
  className = "",
  type = "button",
}: CyberButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cyber-button ${className}`}
    >
      {children}
    </button>
  )
}
