import {
  HiBell,
  HiCode,
  HiFolder,
  HiMenuAlt3,
  HiMenuAlt4,
  HiMoon,
  HiRefresh,
  HiSearch,
  HiSearchCircle,
} from "react-icons/hi";
import { Input } from "./ui/input";

export const AppHeader = () => {
  return (
    <header className=" flex h-[5vh] w-full items-center justify-between gap-4 border-b border-zinc-800 bg-neutral-900 px-4 py-2 text-neutral-200 shadow">
      <div className="flex items-center gap-2">
        <HiFolder />
        <span className="flex capitalize">my project</span>
        <div className="flex items-center gap-2 text-zinc-600">
          <span className="flex">/</span>
          <span className="flex">readme.md</span>
        </div>
      </div>
      {/* The Middle */}
      {/* <div className="relative flex w-4/12 items-center gap-2">
        <Input placeholder="Search Files..." className="bg-zinc-800" />
        <HiSearch className="absolute right-2 top-[0.70rem] border-none text-zinc-600 outline-none ring-0" />
      </div> */}
      {/* The Buttons */}
      <div className="flex items-center justify-end gap-2">
        <HiSearchCircle className="foo" />
        <HiMoon className="foo" />
        <HiBell className="foo" />
        <HiMenuAlt3 className="foo" />
      </div>
    </header>
  );
};
