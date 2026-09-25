"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "motion/react";
import {
  FiPlus,
  FiTrash2,
  FiLink,
  FiCheck,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";
import { UNIT_OPTIONS, COMMON_STORES } from "../../constants";
import { detectPlatform } from "../../../lib/product/detectPlatform";
import { PRODUCT_PLATFORMS, getPlatformByStoreName } from "../../../constants/platforms";

/** Client-side resolve timeout — server fetch times out at 10s. */
const RESOLVE_TIMEOUT_MS = 15000;

/** Spec Phase 39 — user-safe copy, never technical errors. */
const COPY = {
  loading: "Fetching product details…",
  success: "Product details found",
  missingPrice: "Product found, but price could not be read.",
  missingName: "Product found, but product name could not be read.",
  failed: "We couldn't read this product automatically.",
  failedHint: "Enter the product name and price manually.",
  unsupported: "This store is not supported.",
  invalid: "Invalid product URL.",
};

/** Applies `updater` to one row by index without mutating the array. */
function withRow(rows, index, updater) {
  const row = rows[index];
  if (!row) return rows;
  const next = [...rows];
  next[index] = updater(row);
  return next;
}

/**
 * Keeps only digits, one decimal point and a minus sign so the
 * display can add Indian grouping commas without the stored value
 * ever containing them (price stays a clean numeric string).
 */
function sanitizePriceInput(value) {
  const cleaned = String(value).replace(/[^\d.-]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot === -1) return cleaned;
  return (
    cleaned.slice(0, firstDot + 1) +
    cleaned.slice(firstDot + 1).replace(/\./g, "")
  );
}

/**
 * Indian digit grouping for display: 148000 → "1,48,000",
 * 1234 → "1,234", decimals and a trailing dot are preserved.
 * Returns the input unchanged when it is not a clean number so
 * mid-edit states are never mangled.
 */
function formatINRDisplay(value) {
  const raw = String(value);
  if (!raw) return "";

  const match = raw.match(/^(-?)(\d*)(?:\.(\d*))?$/);
  if (!match) return raw;

  const [, sign, intPart, decPart] = match;
  if (!intPart && decPart === undefined) return raw;

  let grouped = intPart;
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3);
    const head = intPart.slice(0, -3);
    grouped = `${head.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}`;
  }

  if (raw.includes(".")) return `${sign}${grouped}.${decPart ?? ""}`;
  return `${sign}${grouped}${decPart ? `.${decPart}` : ""}`;
}

/** Counts [0-9.] chars — used to restore the caret after grouping. */
function countDigits(text) {
  return (text.match(/[\d.]/g) || []).length;
}

/**
 * Spec Phase 14 — identity of a source row: the platform id when
 * known (extracted metadata, or mapped from the store label), else
 * the normalized store label for custom stores. Two rows sharing an
 * identity are duplicates ("one source per platform per item").
 */
function sourceKey(src) {
  const platformId = src.platform || getPlatformByStoreName(src.store);
  if (platformId) return platformId;
  return String(src.store || "").trim().toLowerCase().replace(/\s+/g, " ") || null;
}

/** Identities that appear on more than one source row. */
function findDuplicateKeys(sources) {
  const seen = new Set();
  const duplicates = new Set();
  for (const src of sources) {
    const key = sourceKey(src);
    if (!key) continue;
    if (seen.has(key)) duplicates.add(key);
    else seen.add(key);
  }
  return [...duplicates];
}

/**
 * Keeps only the last row per identity — the newest entry (rows are
 * appended) replaces the earlier one on explicit user confirmation.
 */
function dropEarlierDuplicates(sources) {
  const lastIndexByKey = new Map();
  sources.forEach((src, index) => {
    const key = sourceKey(src);
    if (key) lastIndexByKey.set(key, index);
  });
  return sources.filter((src, index) => {
    const key = sourceKey(src);
    return !key || lastIndexByKey.get(key) === index;
  });
}

/** Spec Phase 14 copy: "Amazon source already exists. Replace…" */
function duplicateMessage(sources, duplicateKeys) {
  const lastIndexByKey = new Map();
  sources.forEach((src, index) => {
    const key = sourceKey(src);
    if (key) lastIndexByKey.set(key, index);
  });

  const names = duplicateKeys.map((key) => {
    const row = sources[lastIndexByKey.get(key)];
    return PRODUCT_PLATFORMS[key]?.name || row?.store?.trim() || key;
  });

  if (names.length === 1) {
    return `${names[0]} source already exists. Replace existing source?`;
  }
  return `${names.join(", ")} sources already exist. Replace existing sources?`;
}

/** Spec Phase 11/39 — "Amazon detected" line while typing/pasting. */
function statusFromUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const detection = detectPlatform(trimmed);
  if (!detection.platform) return null;
  return {
    state: "detected",
    message: `${PRODUCT_PLATFORMS[detection.platform].name} detected`,
  };
}

/** Spec Phase 36 — invalid / unsupported URLs before any request. */
function statusFromRejection(reason) {
  if (reason === "unsupported-host") {
    return { state: "error", message: COPY.unsupported };
  }
  return { state: "error", message: COPY.invalid };
}

/** Spec Phase 36 — partial extraction still succeeds, with honest copy. */
function statusFromProduct(product) {
  if (product.name !== null && product.price !== null) {
    return { state: "success", message: COPY.success };
  }
  if (product.price === null) {
    return { state: "success", message: COPY.missingPrice };
  }
  return { state: "success", message: COPY.missingName };
}

/**
 * One form row. Transient extraction fields (status, resolvedUrl,
 * requestId) live here too but are stripped again on submit, so the
 * persisted source keeps only additive metadata (spec Phase 12):
 * platform, currency, extractedAt, extractionMethod.
 */
function createSource(src = {}) {
  return {
    store: src.store || "Amazon",
    price:
      src.price !== undefined && src.price !== null ? String(src.price) : "",
    url: src.url || "",
    platform: src.platform || null,
    currency: src.currency || null,
    extractedAt: src.extractedAt || null,
    extractionMethod: src.extractionMethod || null,
    // Transient — never persisted.
    status: null,
    resolvedUrl: null,
    requestId: null,
  };
}

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
      ? initialValues.priceSources.map(createSource)
      : [createSource()]
  );

  const [nameError, setNameError] = useState("");
  const [sourcesErrors, setSourcesErrors] = useState([]);
  // Spec Phase 14 — pending duplicate conflict awaiting user choice.
  const [duplicateConflict, setDuplicateConflict] = useState(null);

  const globalDuplicateToggle = useSelector((state) => state.settings.globalDuplicateToggle);
  const parentList = useSelector((state) => state.lists.byId[listId]);
  // NOTE: index into byId with the id — mapping the whole map made every
  // entry `undefined.name` and crashed submit whenever duplicate
  // protection was on.
  const allItems = useSelector((state) =>
    state.items.allIds
      .map((id) => state.items.byId[id])
      .filter((item) => item && item.name)
  );

  // Fresh snapshots for async resolve callbacks (spec Phase 26).
  const sourcesRef = useRef(priceSources);
  const nameRef = useRef(name);
  const requestIdRef = useRef(0);
  useEffect(() => {
    sourcesRef.current = priceSources;
    nameRef.current = name;
  });

  useEffect(() => {
    setName(initialValues.name);
    setQuantity(initialValues.quantity);
    setUnit(initialValues.unit);
    if (initialValues.priceSources && initialValues.priceSources.length > 0) {
      setPriceSources(initialValues.priceSources.map(createSource));
    } else {
      setPriceSources([createSource()]);
    }
    setNameError("");
    setSourcesErrors([]);
    setDuplicateConflict(null);
  }, [initialValues]);

  const handleAddSource = () => {
    setPriceSources([...priceSources, createSource()]);
  };

  const handleRemoveSource = (index) => {
    const updated = [...priceSources];
    updated.splice(index, 1);
    setPriceSources(updated);
  };

  const handleSourceChange = (index, field, value) => {
    const updated = [...priceSources];

    if (field === "url") {
      // Spec Phase 26 — a changed URL invalidates the last resolve:
      // stale metadata is cleared and the row becomes resolvable again.
      // The URL also defines the source's platform (spec §13), so the
      // store label follows it — a Flipkart link in a row labelled
      // "Amazon" used to save as a mismatched source.
      const detection = detectPlatform(value);
      const detected = detection.platform
        ? PRODUCT_PLATFORMS[detection.platform]
        : null;

      updated[index] = {
        ...updated[index],
        url: value,
        store: detected ? detected.name : updated[index].store,
        platform: detected ? detected.id : null,
        currency: null,
        extractedAt: null,
        extractionMethod: null,
        resolvedUrl: null,
        requestId: null,
        status: statusFromUrl(value),
      };
    } else {
      updated[index][field] = value;
    }

    setPriceSources(updated);
  };

  /**
   * Spec Phase 4 + 8 — server-side resolve through the guarded API.
   * Fires only on paste/blur (Phase 26), never per keystroke, and
   * never twice for the same unchanged URL after success.
   */
  const resolveUrl = async (index, urlOverride, { force = false } = {}) => {
    const current = sourcesRef.current[index];
    if (!current) return;

    const url = String(urlOverride ?? current.url).trim();
    if (!url) return;

    // Rejected before any network activity (spec Phase 25 + 36).
    const detection = detectPlatform(url);
    if (!detection.platform) {
      if (detection.reason !== "empty") {
        setPriceSources((prev) =>
          withRow(prev, index, (row) => ({
            ...row,
            status: statusFromRejection(detection.reason),
          }))
        );
      }
      return;
    }

    // Spec Phase 26 — one request per unchanged URL, and never while
    // one is already in flight. An explicit re-paste may force a retry.
    if (current.status?.state === "loading") return;
    if (current.resolvedUrl === url && !force) return;

    const requestId = ++requestIdRef.current;
    setPriceSources((prev) =>
      withRow(prev, index, (row) => ({
        ...row,
        requestId,
        status: { state: "loading", message: COPY.loading },
      }))
    );

    let data = null;
    try {
      const response = await fetch("/api/product/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: AbortSignal.timeout(RESOLVE_TIMEOUT_MS),
      });
      data = await response.json().catch(() => null);
    } catch {
      data = null; // network/timeout → generic failure copy below
    }

    const product = data && data.success ? data.product : null;

    // Spec Phase 11 — populate Product Name, but never overwrite
    // something the user already typed (Phase 30: values are editable).
    if (product && product.name && !nameRef.current.trim()) {
      setName(product.name);
      setNameError("");
    }

    setPriceSources((prev) =>
      withRow(prev, index, (row) => {
        // The URL changed (or row was removed/replaced) while the
        // request was in flight — drop the stale response.
        if (row.requestId !== requestId) return row;

        if (!product) {
          const message =
            data && data.code === "UNSUPPORTED_URL"
              ? COPY.unsupported
              : data && data.code === "INVALID_URL"
                ? COPY.invalid
                : COPY.failed;
          return {
            ...row,
            // Record the attempt so repeated blurs cannot re-request
            // the same unchanged URL (spec Phase 26).
            resolvedUrl: url,
            requestId: null,
            status: {
              state: "error",
              message,
              sub: message === COPY.failed ? COPY.failedHint : null,
            },
          };
        }

        return {
          ...row,
          price:
            row.price === "" && product.price !== null
              ? String(product.price)
              : row.price,
          // Keep label and platform in sync — the display name always
          // comes from the canonical platform config (spec §13).
          store:
            PRODUCT_PLATFORMS[product.platform ?? detection.platform]?.name ??
            row.store,
          platform: product.platform ?? detection.platform,
          currency: product.currency ?? null,
          extractedAt: product.extractedAt ?? null,
          extractionMethod: product.extractionMethod ?? null,
          resolvedUrl: url,
          requestId: null,
          status: statusFromProduct(product),
        };
      })
    );
  };

  const handleUrlPaste = (index, event) => {
    const pasted = (event.clipboardData?.getData("text") || "").trim();
    if (!pasted) return;
    // Let onChange record the pasted value first, then resolve once.
    // Paste is an explicit trigger (spec Phase 26) — it may retry a
    // URL that previously failed, but never while one is in flight.
    setTimeout(() => {
      resolveUrl(index, pasted, { force: true });
    }, 0);
  };

  const handleUrlBlur = (index) => {
    resolveUrl(index);
  };

  /**
   * Price field with live Indian grouping (148000 → 1,48,000).
   * The caret is repositioned by digit count so commas inserted
   * before it don't shift the user's editing position.
   */
  const handlePriceChange = (index, event) => {
    const input = event.target;
    const previous = input.value;
    const caret = input.selectionStart ?? previous.length;
    const digitsBefore = countDigits(previous.slice(0, caret));

    handleSourceChange(index, "price", sanitizePriceInput(previous));

    requestAnimationFrame(() => {
      const value = input.value;
      if (digitsBefore === 0) {
        input.setSelectionRange(0, 0);
        return;
      }
      let seen = 0;
      let position = value.length;
      for (let i = 0; i < value.length; i++) {
        if (/[\d.]/.test(value[i])) {
          seen++;
          if (seen === digitsBefore) {
            position = i + 1;
            break;
          }
        }
      }
      input.setSelectionRange(position, position);
    });
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

      // Defensive: never trust a persisted record's shape.
      const itemLabel = (item) => String(item?.name ?? "").trim().toLowerCase();

      if (globalDuplicateToggle) {
        const isDuplicate = allItems.some(
          (item) => item.id !== itemId && itemLabel(item) === normalizedNewName
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
            itemLabel(item) === normalizedNewName
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

  /** Spec Phase 14 — builds the persisted rows and either submits or
   *  pauses on a duplicate conflict for explicit user confirmation. */
  const buildCleanedSources = () =>
    priceSources
      .filter((src) => src.price !== "" || src.url !== "")
      .map((src) => {
        const source = {
          store: src.store.trim(),
          price: src.price !== "" ? Number(src.price) : 0,
          url: src.url.trim(),
        };
        // Additive extraction metadata (spec Phase 12) — only when a
        // resolve actually produced it; transient fields never persist.
        if (src.platform) source.platform = src.platform;
        if (src.currency) source.currency = src.currency;
        if (src.extractedAt) source.extractedAt = src.extractedAt;
        if (src.extractionMethod) source.extractionMethod = src.extractionMethod;
        return source;
      });

  const submitValues = (cleanedSources) => {
    onSubmit({
      name: name.trim(),
      quantity: Number(quantity) || 1,
      unit,
      priceSources: cleanedSources,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const cleanedSources = buildCleanedSources();

    // Spec Phase 14 — "one source per platform per item": never
    // silently create a second source, never silently overwrite.
    const duplicateKeys = findDuplicateKeys(cleanedSources);
    if (duplicateKeys.length > 0) {
      setDuplicateConflict({
        message: duplicateMessage(cleanedSources, duplicateKeys),
        sources: cleanedSources,
      });
      return;
    }

    submitValues(cleanedSources);
  };

  const handleReplaceConfirm = () => {
    if (!duplicateConflict) return;
    submitValues(dropEarlierDuplicates(duplicateConflict.sources));
    setDuplicateConflict(null);
  };

  /** Spec Phase 20/21 — small loader, subtle status copy, no banners. */
  const renderStatus = (status) => {
    if (!status || !status.message) return null;

    const tone =
      status.state === "error"
        ? "text-danger"
        : status.state === "loading"
          ? "text-text-muted"
          : "text-success";

    const icon =
      status.state === "loading" ? (
        <FiLoader className="w-3.5 h-3.5 shrink-0 animate-spin" />
      ) : status.state === "error" ? (
        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
      ) : (
        <FiCheck className="w-3.5 h-3.5 shrink-0" />
      );

    return (
      <motion.div
        key={`${status.state}-${status.message}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        role="status"
        aria-live="polite"
        className={`flex items-start gap-1.5 ${tone}`}
      >
        {icon}
        <span className="text-caption leading-snug">
          {status.message}
          {status.sub && (
            <span className="text-text-muted"> {status.sub}</span>
          )}
        </span>
      </motion.div>
    );
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
                      {COMMON_STORES.includes(src.store) ? (
                        <Select
                          value={src.store}
                          onChange={(val) => {
                            handleSourceChange(index, "store", val);
                          }}
                          ariaLabel="Store"
                          options={COMMON_STORES.map((s) => ({ value: s, label: s }))}
                        />
                      ) : (
                        /* Legacy/custom store saved before the canonical
                           platform list — keep the record editable without
                           reintroducing a removed platform option. Typing an
                           approved name switches back to the select. */
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
                        inputMode="decimal"
                        placeholder="₹ Price"
                        value={formatINRDisplay(src.price)}
                        onChange={(e) => handlePriceChange(index, e)}
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
                        onPaste={(e) => handleUrlPaste(index, e)}
                        onBlur={() => handleUrlBlur(index)}
                        aria-label={`Product URL for ${src.store || "store"}`}
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

                {/* Extraction feedback — detected / fetching / result */}
                <AnimatePresence mode="wait" initial={false}>
                  {renderStatus(src.status)}
                </AnimatePresence>
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
                ₹{Number(best.price).toLocaleString("en-IN")}
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

      {/* Spec Phase 14 — duplicate source: ask, never silently overwrite */}
      <ConfirmDialog
        isOpen={!!duplicateConflict}
        onClose={() => setDuplicateConflict(null)}
        onConfirm={handleReplaceConfirm}
        title="Duplicate Source"
        message={duplicateConflict?.message || ""}
        confirmLabel="Replace"
        cancelLabel="Cancel"
      />
    </form>
  );
}
