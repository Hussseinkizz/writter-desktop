import { HiDocument, HiDotsVertical } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { Button } from "./ui/button";

interface Props {}

export const SideBarComponent = (props: Props) => {
  return (
    <div className="flex h-full min-h-full w-[20%] flex-auto">
      <section className="flex h-full w-full flex-col items-start justify-start gap-2 bg-zinc-900 text-white">
        {/* The Controls */}
        <div className="flex w-full items-center justify-between gap-1 border-b border-zinc-800 px-4 py-4">
          <Button size="sm" variant="secondary">
            <HiPlus className="text-base" />
            <span className="flex">New</span>
          </Button>
          <HiDotsVertical className="text-base text-zinc-300" />
        </div>
        {/* The Files */}
        <section className="flex w-full flex-col items-center justify-start gap-2 px-4 py-2">
          <div className="flex w-full items-center justify-between gap-1 text-zinc-500">
            <div className="flex items-center gap-2">
              <HiDocument className="text-base" />
              <span className="flex">readme.md</span>
            </div>
            <span className="flex rounded-full bg-zinc-400 p-1"></span>
          </div>
          <div className="flex w-full items-center justify-between gap-1 text-zinc-400">
            <div className="flex items-center gap-2">
              <HiDocument className="text-base" />
              <span className="flex">notes.md</span>
            </div>
            {/* <span className="flex rounded-full bg-zinc-400 p-1"></span> */}
          </div>
          <div className="flex w-full items-center justify-between gap-1 text-zinc-400">
            <div className="flex items-center gap-2">
              <HiDocument className="text-base" />
              <span className="flex">other.md</span>
            </div>
            {/* <span className="flex rounded-full bg-zinc-400 p-1"></span> */}
          </div>
        </section>
      </section>
    </div>
  );
};
