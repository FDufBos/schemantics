//Input for the top of the form

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InputFieldProps = {
  id: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputField = ({ id, placeholder, onChange }: InputFieldProps) => (
  <div>
    <Label htmlFor={id}>{placeholder}</Label>
    <Input type="text" id={id} placeholder={placeholder} onChange={onChange} />
  </div>
);
