import React from 'react';
import { HiDotsVertical, HiEye } from 'react-icons/hi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './src/components/ui/dropdown-menu';

export function TestDropdown() {
  return (
    <div className="p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 border rounded">
            <HiDotsVertical />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => console.log('Clicked!')}>
            <HiEye className="mr-2" />
            Test Item
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}