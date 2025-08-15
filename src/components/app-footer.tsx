import {
  HiClock,
  HiPencil,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';

type FooterProps = {
  wordCount: number;
};
export const AppFooter = ({ wordCount }: FooterProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isWindowFocused, setIsWindowFocused] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsWindowFocused(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isWindowFocused) {
      intervalId = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isWindowFocused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours} Hour ${minutes} mins` : `${minutes} mins`;
  };

  return (
    <header className=" flex h-[5vh] w-full items-center justify-between gap-4 border-t border-zinc-800 bg-neutral-900 px-4 py-1 text-neutral-500 shadow">
      <div
        className="flex items-center gap-2 cursor-pointer"
        title="Time Spent Writing">
        <HiClock className="text-sm" />
        <h1 className="text-sm font-semibold">{formatTime(elapsedTime)}</h1>
      </div>
      {/* The Buttons */}
      <div
        className="flex items-center justify-end gap-4"
        title="Footer Stats">
        {/* TODO: Uncomment when grammar functionality is ready
        <div className="flex items-center gap-1 cursor-pointer">
          <HiCheckCircle className="text-base" />
          <span className="flex">Grammar</span>
        </div>
        */}
        {/* TODO: Uncomment when file size functionality is ready
        <div
          className="flex items-center gap-1 cursor-pointer"
          title="Current File Size">
          <HiLightningBolt className="text-base" />
          <span className="flex">0 bytes</span>
        </div>
        */}
        {/* TODO: Uncomment when smart mode functionality is ready
        <div
          className="flex items-center gap-1 cursor-pointer"
          title="AI Suggestions">
          <HiLightBulb className="text-base" />
          <span className="flex">smart mode</span>
        </div>
        */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          title="Word Count">
          <HiPencil className="text-base" />
          <span className="flex">{wordCount}</span>
          <span className="flex">Words</span>
        </div>
      </div>
    </header>
  );
};
