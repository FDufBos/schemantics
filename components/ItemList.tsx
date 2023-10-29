import { Input } from "@/components/ui/input";

type FieldTypeColors = {
  [key: string]: {
    bg: string;
    text: string;
  };
};

interface ItemListProps {
  items: (string | { type: string; value: string })[];
  onItemChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  onItemBlur: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  fieldTypeColors: FieldTypeColors;
  output: any; // Replace 'any' with the actual type of 'output'
}

export const ItemList = ({
  items,
  onItemChange,
  onItemBlur,
  fieldTypeColors,
  output,
}: ItemListProps) => (
  <div className="flex flex-col gap-2 px-4 py-2">
    {items.map((item, index) => {
      const value = typeof item === "string" ? item : item.value;
      const fieldType = output.config.fields.get(value)?.type;
      const colors = fieldTypeColors[fieldType as keyof typeof fieldTypeColors];

      return (
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
      );
    })}
  </div>
);
