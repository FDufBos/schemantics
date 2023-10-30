import React, { useCallback } from "react";

import { Input } from "@/components/ui/input";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type FieldTypeColors = {
  [key: string]: {
    bg: string;
    text: string;
  };
};

// Extracted Item component
interface ItemProps {
  item: string | { type: string; value: string };
  index: number;
  onItemChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  onItemBlur: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  fieldTypeColors: FieldTypeColors;
  output: any;
  id: string;
}

interface ItemListProps {
  items: (string | { type: string; value: string })[];
  setItems: React.Dispatch<
    React.SetStateAction<(string | { type: string; value: string })[]>
  >;
  onItemChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  onItemBlur: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  fieldTypeColors: FieldTypeColors;
  output: any;
  setOutput: React.Dispatch<React.SetStateAction<any>>;
}

const ItemComponent: React.FC<ItemProps> = ({
  id,
  item,
  index,
  onItemChange,
  onItemBlur,
  fieldTypeColors,
  output,
}) => {
  const initialInputValue = typeof item === "string" ? item : item.value;
  const [inputValue, setInputValue] = React.useState(initialInputValue);

  const fieldType = output.config.fields.get(inputValue)?.type;
  const colors = fieldTypeColors[fieldType as keyof typeof fieldTypeColors];
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    onItemBlur(event, index);
    onItemChange(event, index);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div key={index} className="relative cursor-auto select-select">
        <span
          className={`absolute px-[10px] py-[2px] font-medium text-xs -translate-y-1/2 rounded-full right-2 top-1/2 ${colors?.bg} ${colors?.text}`}
        >
          {fieldType}
        </span>
        <div className="flex items-center gap-1 cursor-grab active:cursor-grabbing">
          <span {...listeners} className="text-gray-300 ">
            <GripVertical />
          </span>
          <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </div>
      </div>
    </div>
  );
};

const Item = React.memo(ItemComponent);

// Refactored ItemList component
export const ItemList: React.FC<ItemListProps> = ({
  items,
  setItems,
  onItemChange,
  onItemBlur,
  fieldTypeColors,
  output,
  setOutput,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        setItems((items) => {
          const oldIndex = items.findIndex((item) => {
            const id = typeof item === "string" ? item : item.value;
            return String(id) === String(active.id);
          });
          const newIndex = items.findIndex((item) => {
            const id = typeof item === "string" ? item : item.value;
            return String(id) === String(over?.id);
          });

          const newItems = arrayMove(items, oldIndex, newIndex);

          setOutput(
            (
              prevOutput: typeof output & {
                config: { fields: Map<string, any> };
              }
            ) => {
              const newFieldsArray: Array<[string, any]> = newItems.map(
                (item) => {
                  const id = typeof item === "string" ? item : item.value;
                  const value = prevOutput.config.fields.get(id);
                  return [id, value];
                }
              );
              const newFields = new Map(newFieldsArray);

              return {
                ...prevOutput,
                config: {
                  ...prevOutput.config,
                  fields: newFields,
                },
              };
            }
          );
          return newItems;
        });
      }
    },
    [setItems, setOutput]
  );

  const itemIds = items.map((item, index) =>
    typeof item === "string" ? item : item.value
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 px-4 py-2">
          {items.map((item, index) => {
            // Generate a unique id for each item
            const id = typeof item === "object" ? item.value : item;

            return (
              <Item
                key={id}
                id={id}
                item={item}
                index={index}
                onItemChange={onItemChange}
                onItemBlur={onItemBlur}
                fieldTypeColors={fieldTypeColors}
                output={output}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};
