import React from 'react';
import SleekTable from './sleek-table'; // Adjust the path to your SleekTable component

interface UserData {
  id: number;
  name: string;
  age: number;
  occupation: string;
}

const columns = [
  { dataKey: 'id', headerContent: 'ID' },
  { dataKey: 'name', headerContent: 'Name' },
  {
    dataKey: 'age',
    headerContent: 'Age',
    columnCellsShape: (item: UserData) => (
      <span>
        {item.age}
        {item.age > 30 && (
          <span className="ml-2 bg-yellow-500 text-white px-2 rounded">
            Senior
          </span>
        )}
      </span>
    ),
  },
  {
    dataKey: 'occupation',
    headerContent: 'Occupation',
    columnCellsShape: (item: UserData) => (
      <span>
        {item.occupation}
        {item.occupation === 'Engineer' && (
          <span className="ml-2 bg-blue-500 text-white px-2 rounded">
            Engineer
          </span>
        )}
      </span>
    ),
  },
];

const data: UserData[] = [
  { id: 1, name: 'Alice', age: 25, occupation: 'Designer' },
  { id: 2, name: 'Bob', age: 30, occupation: 'Engineer' },
  { id: 3, name: 'Charlie', age: 28, occupation: 'Manager' },
];

function App() {
  return (
    <div className="App">
      <SleekTable columns={columns} data={data} />
    </div>
  );
}

export default App;
