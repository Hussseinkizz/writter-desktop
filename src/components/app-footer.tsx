import {
  HiBell,
  HiCheckCircle,
  HiClock,
  HiLightBulb,
  HiLightningBolt,
  HiRefresh,
} from "react-icons/hi";

export const AppFooter = () => {
  return (
    <header className=" flex h-[5vh] w-full items-center justify-between gap-4 border-t border-zinc-800 bg-neutral-900 px-4 py-1 text-neutral-500 shadow">
      <div className="flex items-center gap-2">
        <HiClock className="text-sm" />
        <h1 className="text-sm font-semibold">1 Hour 20 mins</h1>
      </div>
      {/* The Buttons */}
      <div className="flex items-center justify-end gap-4">
        <div className="flex items-center gap-1">
          <HiCheckCircle className="text-base" />
          <span className="flex">Grammar</span>
        </div>
        <div className="flex items-center gap-1">
          <HiLightningBolt className="text-base" />
          <span className="flex">772 bytes</span>
        </div>
        <div className="flex items-center gap-1">
          <HiLightBulb className="text-base" />
          <span className="flex">smart mode</span>
        </div>
        <div className="flex items-center gap-1">
          <HiRefresh className="text-base" />
          <span className="flex">saved</span>
        </div>
      </div>
    </header>
  );
};
