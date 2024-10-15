import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RadioGroupInput({
  label,
  options,
  value,
  onChange,
  required = false,
}) {
  return (
    <div className="space-y-2">
      <Label className="text-zinc-100 text-lg ">{label}</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        required={required}
        className="flex flex-wrap gap-4 mt-4"
      >
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option}
              id={`option-${option}`}
              className="border-zinc-500"
            />
            <Label htmlFor={`option-${option}`} className="text-zinc-100">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
