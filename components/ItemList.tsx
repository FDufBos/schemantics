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
  setOutput;
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
  const value = typeof item === "string" ? item : item.value;
  const fieldType = output.config.fields.get(value)?.type;
  const colors = fieldTypeColors[fieldType as keyof typeof fieldTypeColors];
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="row-grabber"
            {...listeners}
          >
            <path
              fill="#E4E6EA"
              d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2z"
            />
          </svg>
          <Input
            type="text"
            value={value}
            onChange={(event) => onItemChange(event, index)}
            onBlur={(event) => onItemBlur(event, index)}
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

  // Inside your ItemList component
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        setItems((items) => {
          const oldIndex = items.findIndex(
            (item) => item === active.id || item.value === active.id
          );
          const newIndex = items.findIndex(
            (item) => item === over?.id || item.value === over?.id
          );

          const newItems = arrayMove(items, oldIndex, newIndex);

          // Update the output state to reflect the new order of items
          setOutput((prevOutput) => {
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
          });

          return newItems;
        });
      }
    },
    [setItems, setOutput]
  );

  // Map allItems to an array of unique string identifiers
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
            const id = typeof item === "string" ? item : item.value;

            return (
              <Item
                key={`${id}`}
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
