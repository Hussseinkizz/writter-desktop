export function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-900 text-white relative overflow-hidden">
      {/* Logo and heading */}
      <div className="relative z-10 flex flex-col items-center animate-fade-in">
        <h1
          className="text-4xl lg:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-600 to-violet-400
            drop-shadow-[0_0_18px_rgba(139,92,246,0.85)]"
          style={{
            WebkitTextStroke: '2px #a78bfa',
            filter:
              'drop-shadow(0 0 12px #a78bfa) drop-shadow(0 0 28px #a78bfa)',
          }}>
          ⌘ Writter
        </h1>
        <p className="text-zinc-400 text-sm tracking-wide">
          Loading your workspace...
        </p>
      </div>

      {/* Dot loader animation */}
      <div className="mt-8 flex gap-2">
        <span className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-violet-600 animate-bounce" />
      </div>

      {/* Subtle shimmer or backdrop layer */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-900/20 to-zinc-900/80 pointer-events-none" />
    </div>
  );
}
