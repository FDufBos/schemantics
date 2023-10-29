import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";

type DocumentTypeSelectProps = {
  onValueChange: (value: string) => void;
};

export const DocumentTypeSelect = ({
  onValueChange,
}: DocumentTypeSelectProps) => (
  <div>
    <Label htmlFor="docType">Document Type</Label>
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Document type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="page">Page</SelectItem>
      </SelectContent>
    </Select>
  </div>
);
