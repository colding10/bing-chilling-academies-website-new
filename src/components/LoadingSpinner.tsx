import { memo } from 'react'

interface LoadingSpinnerProps {
  size?: number
}

const LoadingSpinner = memo(({ size = 32 }: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full border-t-2 border-b-2 border-custom-blue"
        style={{ width: `${size}px`, height: `${size}px` }}
      ></div>
    </div>
  )
})

LoadingSpinner.displayName = "LoadingSpinner"

export default LoadingSpinner
