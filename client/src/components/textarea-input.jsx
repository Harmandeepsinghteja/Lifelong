import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function TextareaInput({
  id,
  label,
  sublabel,
  value,
  onChange,
  required = false,
  placeholder,
  helperText,
}) {
  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor={id} className="text-zinc-100 font-medium text-lg">
          {label}
        </Label>
        {sublabel && <p className="text-sm text-zinc-400 ">{sublabel}</p>}
      </div>
      {helperText && <p className="text-sm text-zinc-400 ">{helperText}</p>}
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500 min-h-[100px]"
        placeholder={placeholder}
      />
    </div>
  );
}
