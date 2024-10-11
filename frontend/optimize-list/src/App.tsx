import  { useState, useEffect, useCallback } from 'react';
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

  const handleSelectItem = (id: number) => {
    setSelectedItemIds((prevSelectedItemIds) => {
      const newSelectedItemIds = prevSelectedItemIds.includes(id)
        ? prevSelectedItemIds.filter((itemId) => itemId !== id)
        : [...prevSelectedItemIds, id];
      setLastSelectedItemId(newSelectedItemIds.length ? newSelectedItemIds[newSelectedItemIds.length - 1] : null);
      return newSelectedItemIds;
    });
  };

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
        onSelectItem={handleSelectItem}
      />
    </div>
  );
}

export default App;
