import { create, insertMultiple, search } from '@orama/orama';
import { useEffect, useState } from 'react';

interface config {
  data: any[];
  dataSchema: any;
  dataLimit?: number;
  searchTerm: string;
}

export function useSearch(props: config) {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);

  const searchData = async () => {
    const dataLimit = props.dataLimit ?? 500;

    const searchDB = await create({
      schema: props.dataSchema,
    });

    await insertMultiple(searchDB, props.data, dataLimit);

    const searchResults = await search(searchDB, {
      term: props.searchTerm,
      properties: '*',
    });

    const resultsData = searchResults.hits.map((hit) => hit.document);

    if (resultsData) {
      setResults(resultsData);
      setIsSearching(false);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    setIsSearching(true);
    searchData();
  }, [props.searchTerm]);

  return { isSearching, results };
}
