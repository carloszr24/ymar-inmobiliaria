export function ScrollHint() {
  return (
    <div
      className="absolute inset-x-0 bottom-4 z-10 flex flex-col items-center justify-center gap-2 text-white/85 animate-fade-up pointer-events-none md:bottom-2"
      style={{ animationDelay: '0.45s', opacity: 0, animationFillMode: 'forwards' }}
      aria-hidden="true"
    >
      <span className="text-[10px] uppercase tracking-[0.22em] text-center">Descubre más</span>
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 animate-bounce"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
