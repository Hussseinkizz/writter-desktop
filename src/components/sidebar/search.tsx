import { Input } from '@/components/ui/input';
import { HiSearch } from 'react-icons/hi';

interface Props {
  onChange: (value: string) => void;
}

export const SidebarSearch = ({ onChange }: Props) => {
  return (
    <div className="w-full px-4 py-2">
      <div className="relative">
        <HiSearch className="absolute left-2 top-2.5 text-zinc-400 text-sm" />
        <Input
          type="text"
          placeholder="Search..."
          onChange={(e) => onChange(e.target.value)}
          className="pl-8 bg-zinc-800 text-white border border-zinc-700 placeholder:text-zinc-500"
        />
      </div>
    </div>
  );
};
