import { open } from '@tauri-apps/plugin-dialog';

export function WelcomeScreen({
  onProjectChosen,
}: {
  onProjectChosen: (path: string) => void;
}) {
  const handleGetStarted = async () => {
    const dir = await open({ directory: true });
    if (typeof dir === 'string') {
      onProjectChosen(dir);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-white bg-zinc-900 relative overflow-hidden">
      {/* Subtle Bukowski quote in the background */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 0 }}>
        <span className="text-[8vw] lg:text-[5vw] font-bold italic opacity-5 text-violet-300 whitespace-pre-line text-center leading-tight drop-shadow-[0_0_18px_rgba(139,92,246,0.12)]">
          {`"if it doesn't come bursting out of you\nin spite of everything,\ndon't do it."\n\n— Charles Bukowski, so you want to be a writer? (1992)`}
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        <h1
          className="text-4xl lg:text-5xl font-bold mb-8 relative
          text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-600 to-violet-400
          drop-shadow-[0_0_18px_rgba(139,92,246,0.85)]"
          style={{
            WebkitTextStroke: '2px #a78bfa',
            filter:
              'drop-shadow(0 0 12px #a78bfa) drop-shadow(0 0 28px #a78bfa)',
          }}>
          ⌘ Writter
        </h1>
        <div className="max-w-md w-full flex flex-col items-center">
          <p className="mb-4 text-zinc-400 text-center">
            The minimalistic markdown editor for your notes and thoughts!
          </p>
          <p className="mb-4 text-zinc-400 text-center">
            You can start by selecting the folder where you want to store your
            notes. Or where your notes are to get started.
          </p>
        </div>
        <button
          onClick={handleGetStarted}
          className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-xl mt-2">
          Get Started
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 left-0 w-full flex justify-center z-10">
        <p className="text-xs text-zinc-500 text-center">
          <a
            href="https://github.com/Hussseinkizz/writter-desktop"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-violet-300">
            open source
          </a>{' '}
          editor made with <span className="text-amber-500">🧡</span> by{' '}
          <a
            href="https://github.com/Hussseinkizz"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-violet-300">
            Hussein Kizz
          </a>
        </p>
      </footer>
    </div>
  );
}
