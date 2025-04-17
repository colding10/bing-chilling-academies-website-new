export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div
          className="absolute inset-0 border-4 border-primary rounded-full 
          animate-spin border-t-transparent"
        ></div>
      </div>
    </div>
  )
}
