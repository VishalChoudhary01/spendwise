"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import { FiPlus, FiTrash2, FiLink, FiCheck } from "react-icons/fi";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { UNIT_OPTIONS, COMMON_STORES } from "../../constants";

export default function ItemForm({
  listId,
  itemId = null,
  initialValues = {
    name: "",
    quantity: 1,
    unit: "piece",
    priceSources: [],
  },
  onSubmit,
  onCancel,
  submitLabel = "Save Item",
}) {
  const [name, setName] = useState(initialValues.name);
  const [quantity, setQuantity] = useState(initialValues.quantity);
  const [unit, setUnit] = useState(initialValues.unit);
  const [priceSources, setPriceSources] = useState(
    initialValues.priceSources && initialValues.priceSources.length > 0
      ? initialValues.priceSources.map((src) => ({
          store: src.store || "Amazon",
          price: src.price !== undefined ? String(src.price) : "",
          url: src.url || "",
        }))
      : [{ store: "Amazon", price: "", url: "" }]
  );

  const [nameError, setNameError] = useState("");
  const [sourcesErrors, setSourcesErrors] = useState([]);

  const globalDuplicateToggle = useSelector((state) => state.settings.globalDuplicateToggle);
  const parentList = useSelector((state) => state.lists.byId[listId]);
  const allItems = useSelector((state) => state.items.allIds.map((id) => state.items.byId[id]));

  useEffect(() => {
    setName(initialValues.name);
    setQuantity(initialValues.quantity);
    setUnit(initialValues.unit);
    if (initialValues.priceSources && initialValues.priceSources.length > 0) {
      setPriceSources(
        initialValues.priceSources.map((src) => ({
          store: src.store || "Amazon",
          price: src.price !== undefined ? String(src.price) : "",
          url: src.url || "",
        }))
      );
    } else {
      setPriceSources([{ store: "Amazon", price: "", url: "" }]);
    }
    setNameError("");
    setSourcesErrors([]);
  }, [initialValues]);

  const handleAddSource = () => {
    setPriceSources([...priceSources, { store: "Amazon", price: "", url: "" }]);
  };

  const handleRemoveSource = (index) => {
    const updated = [...priceSources];
    updated.splice(index, 1);
    setPriceSources(updated);
  };

  const handleSourceChange = (index, field, value) => {
    const updated = [...priceSources];
    updated[index][field] = value;
    setPriceSources(updated);
  };

  const validate = () => {
    let isValid = true;
    setNameError("");
    const newSourceErrors = [];

    const cleanName = name.trim();
    if (!cleanName) {
      setNameError("Enter an item name.");
      isValid = false;
    } else {
      const normalizedNewName = cleanName.toLowerCase();

      if (globalDuplicateToggle) {
        const isDuplicate = allItems.some(
          (item) =>
            item.id !== itemId && item.name.trim().toLowerCase() === normalizedNewName
        );
        if (isDuplicate) {
          setNameError("Duplicate detected. Global duplicate protection is active.");
          isValid = false;
        }
      } else if (parentList && parentList.duplicateToggle) {
        const isDuplicate = allItems.some(
          (item) =>
            item.listId === listId &&
            item.id !== itemId &&
            item.name.trim().toLowerCase() === normalizedNewName
        );
        if (isDuplicate) {
          setNameError("Duplicate detected. This item already exists in this list.");
          isValid = false;
        }
      }
    }

    priceSources.forEach((src, idx) => {
      const errors = {};
      if (src.price !== "" && isNaN(Number(src.price))) {
        errors.price = "Must be a valid number.";
        isValid = false;
      } else if (src.price !== "" && Number(src.price) < 0) {
        errors.price = "Cannot be negative.";
        isValid = false;
      }
      newSourceErrors[idx] = errors;
    });

    setSourcesErrors(newSourceErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const cleanedSources = priceSources
      .filter((src) => src.price !== "" || src.url !== "")
      .map((src) => ({
        store: src.store.trim(),
        price: src.price !== "" ? Number(src.price) : 0,
        url: src.url.trim(),
      }));

    onSubmit({
      name: name.trim(),
      quantity: Number(quantity) || 1,
      unit,
      priceSources: cleanedSources,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Product Name */}
      <Input
        label="Product Name"
        id="item-name-input"
        placeholder="e.g. Milk, Apples, USB Cable..."
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (nameError) setNameError("");
        }}
        error={nameError}
        autoFocus
      />

      {/* Quantity + Unit */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Quantity"
          id="item-quantity-input"
          type="number"
          min="1"
          step="any"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <label className="text-label-md font-semibold text-text-primary select-none">
            Unit Type
          </label>
          <Select
            value={unit}
            onChange={setUnit}
            ariaLabel="Unit Type"
            options={UNIT_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
          />
        </div>
      </div>

      {/* Price Comparison Sources */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between select-none">
          <span className="text-label-sm font-semibold text-text-muted uppercase tracking-wider">
            Price Comparison Sources
          </span>
          <button
            type="button"
            onClick={handleAddSource}
            className="inline-flex items-center gap-1.5 px-3 h-8 text-label-md font-semibold text-text-muted border border-border-default rounded hover:bg-surface-muted hover:text-text-primary transition-colors duration-150 cursor-pointer"
          >
            <FiPlus className="w-3.5 h-3.5" />
            Add Store
          </button>
        </div>

        {/* Source Rows */}
        <div className="flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {priceSources.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="flex items-start gap-2">
                  {/* Source fields — flexible grid */}
                  <div className="flex-1 grid grid-cols-[1fr_100px_1fr] sm:grid-cols-[140px_100px_1fr] gap-2">
                    {/* Store */}
                    <div className="flex flex-col gap-1">
                      <Select
                        value={COMMON_STORES.includes(src.store) ? src.store : "Custom"}
                        onChange={(val) => {
                          handleSourceChange(index, "store", val === "Custom" ? "" : val);
                        }}
                        ariaLabel="Store"
                        options={[
                          ...COMMON_STORES.map((s) => ({ value: s, label: s })),
                          { value: "Custom", label: "Custom..." },
                        ]}
                      />
                      {!COMMON_STORES.includes(src.store) && (
                        <input
                          type="text"
                          placeholder="Store name"
                          value={src.store}
                          onChange={(e) => handleSourceChange(index, "store", e.target.value)}
                          className="px-3 h-10 text-body-sm bg-surface-muted border border-border-subtle rounded text-text-primary placeholder:text-text-muted outline-none hover:border-border-strong focus-visible:border-border-focus"
                        />
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-1">
                      <input
                        type="text"
                        placeholder="₹ Price"
                        value={src.price}
                        onChange={(e) => handleSourceChange(index, "price", e.target.value)}
                        className={`px-3 h-10 text-body-sm bg-surface-muted border border-border-subtle rounded text-text-primary placeholder:text-text-muted outline-none hover:border-border-strong focus-visible:border-border-focus ${
                          sourcesErrors[index]?.price ? "border-danger" : ""
                        }`}
                      />
                      {sourcesErrors[index]?.price && (
                        <span className="text-caption text-danger">
                          {sourcesErrors[index].price}
                        </span>
                      )}
                    </div>

                    {/* URL */}
                    <div className="relative flex items-center bg-surface-muted border border-border-subtle rounded hover:border-border-strong focus-within:border-border-focus transition-colors">
                      <FiLink className="absolute left-3 w-4 h-4 text-text-muted pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Product URL"
                        value={src.url}
                        onChange={(e) => handleSourceChange(index, "url", e.target.value)}
                        className="w-full h-10 pl-9 pr-3 text-body-sm text-text-primary bg-transparent placeholder:text-text-muted outline-none"
                      />
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSource(index)}
                    className="w-10 h-10 shrink-0 mt-0 flex items-center justify-center rounded text-text-muted hover:text-danger hover:bg-danger/10 transition-colors duration-150 cursor-pointer"
                    title="Remove store"
                    aria-label="Remove store"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Live best-price indicator */}
        {(() => {
          const validSources = priceSources.filter(
            (src) => src.price !== "" && !isNaN(Number(src.price)) && Number(src.price) >= 0
          );
          if (validSources.length === 0) return null;
          const best = validSources.reduce((min, src) => {
            return Number(src.price) < Number(min.price) ? src : min;
          }, validSources[0]);
          return (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-success/5 border border-success/15 rounded">
              <FiCheck className="w-4 h-4 text-success shrink-0" />
              <span className="text-label-sm font-semibold text-success">Best available:</span>
              <span className="text-label-sm font-bold text-text-primary">{best.store}</span>
              <span className="text-label-sm text-text-muted">·</span>
              <span className="text-label-sm font-bold text-text-primary tabular-nums">
                ₹{Number(best.price).toLocaleString()}
              </span>
            </div>
          );
        })()}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
