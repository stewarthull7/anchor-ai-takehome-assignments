import { ItemData } from "../api/fetch-list";


type ItemProps = {
    item: ItemData;
    isSelected: boolean;
    onClick: () => void;
    };

function Item({ item, isSelected, onClick }: ItemProps) {

  return (
    <li
      style={{ backgroundColor: isSelected ? 'yellow' : 'white', cursor: 'pointer'}}
      onClick={onClick}
    >
        ID {item.id} - {item.name}
    </li>
  );
}

export default Item;
