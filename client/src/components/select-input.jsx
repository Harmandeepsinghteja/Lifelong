import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectInput({
  id,
  label,
  options,
  value,
  onChange,
  required = false,
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-zinc-100 text-lg">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange} required={required}>
        <SelectTrigger
          id={id}
          className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
        >
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-700 text-zinc-100 border-zinc-600">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
