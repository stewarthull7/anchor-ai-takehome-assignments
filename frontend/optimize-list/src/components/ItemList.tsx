import React from 'react';
import { ItemData } from '../api/fetch-list';
import Item from './Item';

type ItemListProps = {
  items: ItemData[];
  onSelectItem: (id: number, isSelected: boolean) => void;
};

const ItemList = React.memo(({ items, onSelectItem }: ItemListProps) => {
  return (
    <ul style={{width: '100%'}}>
      {items.map((item) => (
        <Item
          key={item.id}
          item={item}
          onSelect={(isSelected) => onSelectItem(item.id, isSelected)}
        />
      ))}
    </ul>
  );
});

export default ItemList;
