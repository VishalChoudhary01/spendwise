"use client";

import { FiSearch } from "react-icons/fi";
import Input from "./Input";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  id,
}) {
  return (
    <Input
      id={id}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      icon={FiSearch}
      className={className}
    />
  );
}
