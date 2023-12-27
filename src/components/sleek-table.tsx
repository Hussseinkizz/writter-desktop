// Todo 1: implement sortByColumn
// Todo 2: implement filtering
// Todo 3: implement pagination
// Todo 4: Fix Checkbox selections
// Todo 5: Fine tune search experience
import React, { useEffect, useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { DropdownMenuCheckboxes } from './DropdownMenuCheckboxes';
import DateSelector from './DateSelector';
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons';
import SearchBox from './SearchBox';
import { Button } from './ui/button';
import SleekModal from './sleek-modal';
import AddVistorForm from './add-vistor-form';

type Column<T> = {
  dataKey: string;
  headerContent?: React.ReactNode;
  columnCellsShape?: (item: T) => string | number | React.ReactNode;
};

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchSchema?: any;
  hasSearch?: boolean;
  hasCheckboxes?: boolean;
  sortByColumn?: string;
}

const SleekTable = <T extends Record<string, any>>(props: TableProps<T>) => {
  const [allChecked, setAllChecked] = useState(false);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);

  let selectedItems: Record<string, any>[] = [];

  const checkAll = () => {
    setAllChecked((prev) => !prev);
    selectedItems = selectedItems ? [] : filteredData;
  };

  //Todo: enable proper selecting of a specific row item -- this assumes items should have an id property always
  const toggleSelectItem = (item: Record<string, any>) => {
    setAllChecked(false);
    let itemExists = selectedItems.find((i) => i.id === item.id);
    if (itemExists) {
      selectedItems = selectedItems.filter((i) => i.id !== item.id);
    } else {
      selectedItems.push(item);
    }
    // console.log(selectedItems, 'selected items');
  };

  // Todo: make checking work
  const isItemSelected = (itemId: number | string) => {
    let isSelected = false;

    if (allChecked) {
      isSelected = true;
    } else {
      isSelected = selectedItems.some((item) => item.id === itemId);
      // console.log('check value', isSelected);
    }
    return isSelected;
  };

  // add a new entry to table
  const addItemToTable = (data: any) => {
    setAddItemDialogOpen(false);
    console.log('form submitted:', data);
  };

  const setTableData = (data: any) => {
    setFilteredData(data);
    setIsSearching(false);
  };

  // todo make table aware of loading states and empty states
  useEffect(() => {
    setFilteredData(props.data);
  }, [props.data]);

  return (
    <section className="w-full scrollable overflow-x-auto rounded-lg border --shadow-2xl shadow-lg">
      {/* The Table Controls */}
      <nav className="flex justify-between items-center w-full py-2 px-4 bg-neutral-300">
        {/* Todo: have better search defaults and types, this assumes we always have an id in searchable data */}
        {props.hasSearch ? (
          <SearchBox
            searchableData={props.data}
            searchSchema={props.searchSchema ?? { id: 'string' }}
            onResults={(data) => setTableData(data)}
            onSearch={(booleanValue) => setIsSearching(booleanValue)}
          />
        ) : null}
        <div className="flex justify-center items-center gap-2">
          <DropdownMenuCheckboxes />
          <DateSelector />
        </div>
        <div className="flex justify-center items-center gap-2">
          <Button onClick={() => setAddItemDialogOpen(true)}>Add Vistor</Button>
          <SleekModal
            size="md"
            isOpen={addItemDialogOpen}
            onClose={() => setAddItemDialogOpen(false)}
            title="Add A New Vistor"
            disableClickOutside={true}>
            {/* Add Entry Popup Modal Content */}
            <AddVistorForm
              onCancel={() => setAddItemDialogOpen(false)}
              onSave={(data) => addItemToTable(data)}
            />
          </SleekModal>
        </div>
      </nav>
      {/* The Table itself */}
      <table className="w-full table-auto bg-neutral-50 text-left text-sm text-neutral-700 --shadow-2xl">
        <thead className="border-b bg-neutral-300 text-base font-bold text-neutral-800">
          <tr>
            {props.hasCheckboxes ? (
              <th className="py-3 px-6">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={() => checkAll()}
                  aria-label="Select all"
                />
              </th>
            ) : null}
            {props.columns.map((column: Column<T>, index: number) =>
              props.sortByColumn === column.dataKey ? (
                <th
                  key={index}
                  className="py-3 px-6 flex gap-1 justify-center items-center cursor-pointer hover:bg-neutral-200 m-2 rounded-lg"
                  onClick={() => console.log('sort items')}>
                  {column.headerContent}
                  <CaretSortIcon className="ml-2 h-4 w-4" />
                </th>
              ) : (
                <th key={index} className="py-3 px-6">
                  {column.headerContent ? column.headerContent : column.dataKey}
                </th>
              )
            )}
          </tr>
        </thead>
        {/* The Table Body */}
        {isSearching ? (
          <tbody className="h-[50vh] w-full">
            <tr className="flex w-full justify-center items-center">
              <td className="flex w-full justify-center items-center font-semibold text-sm text-neutral-500 dark:text-neutral-700 py-16 px-16">
                Searching...
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody className="w-full">
            {filteredData.length > 0 ? (
              filteredData.map((item: T, rowIndex: number) => (
                <tr
                  key={rowIndex}
                  className="border-b border-neutral-100 font-semibold">
                  {props.hasCheckboxes ? (
                    <th className="py-3 px-6">
                      <Checkbox
                        checked={isItemSelected(item.id)}
                        onCheckedChange={() => toggleSelectItem(item)}
                        aria-label="Select row"
                      />
                    </th>
                  ) : null}
                  {props.columns.map((column: Column<T>, colIndex: number) => (
                    <td
                      key={colIndex}
                      className="whitespace-nowrap px-6 py-4 font-bold">
                      {column.columnCellsShape
                        ? column.columnCellsShape(item)
                        : item[column.dataKey]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="h-[50vh] w-full">
                <td className="flex w-full justify-center items-center">
                  <span className="flex w-full justify-center items-center font-semibold text-sm text-neutral-500 dark:text-neutral-700 py-16 px-16">
                    No Items!
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        )}
        {/* table footer? */}
      </table>
    </section>
  );
};

export default SleekTable;
