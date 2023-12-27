import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { useSearch } from '@/hooks/useSearch';

interface Props {
  searchableData: any;
  searchSchema: any;
  onResults: (data: any) => any;
  onSearch: (value: boolean) => void;
}

const SearchBox = (props: Props) => {
  const [filterValue, setFilterValue] = useState('');

  const { isSearching, results } = useSearch({
    dataSchema: props.searchSchema,
    data: props.searchableData,
    searchTerm: filterValue,
  });

  useEffect(() => {
    if (isSearching) {
      props.onSearch(true);
    } else {
      props.onResults(results);
    }
  }, [isSearching, results, props]);

  //Todo: search only if we have 3 characters or so for optimization of searching!

  return (
    <Input
      placeholder="Search Here..."
      // value={filterValue}
      onChange={(event) => setFilterValue(event.target.value)}
      className="max-w-sm"
    />
  );
};

export default SearchBox;
