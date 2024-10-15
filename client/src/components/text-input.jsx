import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TextInput({
  id,
  label,
  value,
  onChange,
  required = false,
  type = "text",
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-zinc-100 text-lg">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="bg-zinc-700 text-zinc-100 border-zinc-600 focus:border-zinc-500"
      />
    </div>
  );
}
