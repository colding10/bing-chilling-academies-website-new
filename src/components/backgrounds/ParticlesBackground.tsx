import Particles from "react-tsparticles"

// ...existing code...

export default function ParticlesBackground({ enabled }: { enabled: boolean }) {
  if (!enabled) return null

  return (
    <div className="fixed inset-0 z-30 pointer-events-none">
      <Particles
        id="tsparticles"
        options={{
          // ...existing code...
          particles: {
            // ...existing code...
            opacity: {
              value: 0.3, // Reduced from higher value to be less distracting
            },
            // ...existing code...
          },
          // ...existing code...
        }}
      />
    </div>
  )
}
