import  { useState, useEffect } from 'react';
import ItemList from './components/ItemList';
import SearchBar from './components/SearchBar';
import { fetchList, ItemData } from './api/fetch-list';
import './App.css';
function App() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [query, setQuery] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [lastSelectedItemId, setLastSelectedItemId] = useState<number | null>(null);
  const [totalSelectedCount, setTotalSelectedCount] = useState<number>(0);

  async function fetchData(){
    const data = await fetchList({query});
    setItems(data);
  }

  useEffect(() => {
    fetchData();
  }, [query]);


  useEffect(() => {
    setTotalSelectedCount(selectedItemIds.length);
  }, [selectedItemIds]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 500,
    }}>
      <h1>Item List</h1>
      <p>Total Items Selected: {totalSelectedCount}</p>
      <p>Last selected item ID is: {lastSelectedItemId}</p>
      <SearchBar query={query} setQuery={setQuery} />
      <ItemList
        items={items}
        selectedItemIds={selectedItemIds}
        onSelectItem={(id: number) => {
          if (selectedItemIds.includes(id)) {
            setSelectedItemIds(selectedItemIds.filter((itemId) => itemId !== id));
          } else {
          setSelectedItemIds((ids) => [...ids, id]);
          setLastSelectedItemId(selectedItemIds.length ? selectedItemIds[selectedItemIds.length - 1] : null);
          }
        }}
      />
    </div>
  );
}

export default App;
