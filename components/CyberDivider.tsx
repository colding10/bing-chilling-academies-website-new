export default function CyberDivider() {
  return (
    <div className="flex items-center my-8">
      <div className="h-px bg-custom-blue flex-grow animate-pulse" />
      <div className="mx-4 text-custom-blue">
        <svg
          className="w-6 h-6 transform rotate-45"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </div>
      <div className="h-px bg-custom-blue flex-grow animate-pulse" />
    </div>
  )
}
