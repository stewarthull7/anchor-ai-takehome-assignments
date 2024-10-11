import  { useState, useEffect, useCallback, useMemo } from 'react';
import ItemList from './components/ItemList';
import SearchBar from './components/SearchBar';
import { fetchList, ItemData } from './api/fetch-list';
import './App.css';
function App() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [query, setQuery] = useState('');
  const [, setSelectedItemIds] = useState<number[]>([]);
  const [lastSelectedItemId, setLastSelectedItemId] = useState<number | null>(null);
  const [totalSelectedCount, setTotalSelectedCount] = useState<number>(0);

  async function fetchData(){
    const data = await fetchList({query});
    setItems(data);
  }

  const handleSelectItem = useCallback((id: number, isSelected: boolean) => {
    setSelectedItemIds((prevSelectedItemIds) => {
      const newSelectedItemIds = !isSelected
        ? prevSelectedItemIds.filter((itemId) => itemId !== id)
        : [...prevSelectedItemIds, id];
      setLastSelectedItemId(newSelectedItemIds.length ? newSelectedItemIds[newSelectedItemIds.length - 1] : null);
      return newSelectedItemIds;
    });
    setTotalSelectedCount((prev) => prev + (isSelected ? 1 : -1));
  }, []);

  const memoizedItems = useMemo(() => items, [items]);

  useEffect(() => {
    fetchData();
  }, [query]);

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
        items={memoizedItems}
        onSelectItem={handleSelectItem}
      />
    </div>
  );
}

export default App;
