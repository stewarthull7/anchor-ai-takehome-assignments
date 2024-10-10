import { ItemData } from '../api/fetch-list';
import Item from './Item';

type ItemListProps = {
    items: ItemData[];
    selectedItemIds: number[];
    onSelectItem: (id: number) => void;
    };
function ItemList({ items, selectedItemIds, onSelectItem }: ItemListProps) {

  return (
    <ul style={{width: '100%'}}>
      {items.map((item) => (
        <Item
          key={item.id}
          item={item}
          isSelected={selectedItemIds.includes(item.id)}
          onClick={() => onSelectItem(item.id)}
        />
      ))}
    </ul>
  );
}

export default ItemList;
