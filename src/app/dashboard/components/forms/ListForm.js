"use client";

import { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ToggleSwitch from "../ui/ToggleSwitch";

export default function ListForm({
  initialValues = { name: "", duplicateToggle: false },
  onSubmit,
  onCancel,
  submitLabel = "Save",
}) {
  const [name, setName] = useState(initialValues.name);
  const [duplicateToggle, setDuplicateToggle] = useState(initialValues.duplicateToggle);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(initialValues.name);
    setDuplicateToggle(initialValues.duplicateToggle);
    setError("");
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Enter a list name.");
      return;
    }
    onSubmit({ name: cleanName, duplicateToggle });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="List Name"
        id="list-name-input"
        placeholder="e.g. Grocery, Monthly Budget..."
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError("");
        }}
        error={error}
        autoFocus
      />
      <ToggleSwitch
        label="Local Duplicate Prevention"
        description="Do not allow items with duplicate names inside this list."
        checked={duplicateToggle}
        onChange={setDuplicateToggle}
      />
      <div className="flex items-center justify-end gap-2.5 pt-2">
        <Button variant="secondary" onClick={onCancel} size="sm">
          Cancel
        </Button>
        <Button type="submit" size="sm">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
