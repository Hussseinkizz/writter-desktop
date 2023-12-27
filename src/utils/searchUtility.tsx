import { create, insertMultiple, search } from "@orama/orama";

interface config {
  data: any[];
  dataSchema: any;
  dataLimit?: number;
  searchTerm: string;
}

export async function SearchEngine(props: config) {
  let isSearching = true;
  let results;

  const dataLimit = props.dataLimit ?? 500;

  const searchDB = await create({
    schema: props.dataSchema,
  });

  await insertMultiple(searchDB, props.data, dataLimit);

  const searchResults = await search(searchDB, {
    term: props.searchTerm,
    properties: "*",
  });

  const resultsData = searchResults.hits.map((hit) => hit.document);

  if (resultsData) {
    isSearching = false;
    results = resultsData;
  }
  return { isSearching, results };
}
