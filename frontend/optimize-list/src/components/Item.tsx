import { useState } from "react";
import { ItemData } from "../api/fetch-list";

type ItemProps = {
  item: ItemData;
  onSelect: (isSelected: boolean) => void;
};

function Item({ item, onSelect }: ItemProps) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <li
      style={{ backgroundColor: isSelected ? 'yellow' : 'white', cursor: 'pointer'}}
      onClick={() => {
        setIsSelected(!isSelected);
        onSelect(!isSelected);
      }}
    >
      ID {item.id} - {item.name}
    </li>
  );
}

export default Item;
