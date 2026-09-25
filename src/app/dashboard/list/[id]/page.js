"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { FiArrowLeft, FiArrowUp, FiPlus, FiSearch, FiShoppingCart } from "react-icons/fi";
import { addItem, editItem, deleteItem, toggleItemPurchased } from "@/app/features/itemsSlice";
import { editList } from "@/app/features/listsSlice";
import { getItemTotal, getListTotal } from "../../utils/priceEngine";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Select from "../../components/ui/Select";
import ToggleSwitch from "../../components/ui/ToggleSwitch";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ItemForm from "../../components/forms/ItemForm";
import ItemCard from "../../components/layout/ItemCard";

const formatINR = (value) =>
    value.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export default function ListDetails() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const listId = params.id;
    const highlightId = searchParams.get("highlight");

    // Redux Slices
    const list = useSelector((state) => state.lists.byId[listId]);
    const itemsById = useSelector((state) => state.items.byId);
    const itemIds = useSelector((state) => state.items.allIds);

    // Component States
    const [localSearch, setLocalSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editItemObj, setEditItemObj] = useState(null);
    const [deleteItemId, setDeleteItemId] = useState(null);

    // If list doesn't exist
    if (!list) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-18 pb-8">
                <div className="flex flex-col items-center justify-center py-20 text-center select-none">
                    <FiShoppingCart aria-hidden="true" className="w-6 h-6 text-text-muted mb-4" />
                    <h2 className="text-heading-sm font-bold text-text-primary mb-2">List Not Found</h2>
                    <p className="text-body-sm text-text-muted mb-6 max-w-xs">
                        The shopping list you are trying to view does not exist or has been deleted.
                    </p>
                    <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
                </div>
            </div>
        );
    }

    // Get items belonging to this list
    const listItems = itemIds
        .map((id) => itemsById[id])
        .filter((item) => item && item.listId === listId);

    // Totals calculations
    const totalCost = getListTotal(listItems);
    const totalCount = listItems.length;
    const purchasedCount = listItems.filter((i) => i.isPurchased).length;
    const pendingCount = totalCount - purchasedCount;

    // Filter & Search
    const filteredItems = listItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(localSearch.toLowerCase().trim());
        const matchesStatus =
            filterStatus === "all" ||
            (filterStatus === "pending" && !item.isPurchased) ||
            (filterStatus === "purchased" && item.isPurchased);
        return matchesSearch && matchesStatus;
    });

    // Sorting
    const sortedItems = [...filteredItems].sort((a, b) => {
        let comparison = 0;
        if (sortBy === "name") {
            comparison = a.name.localeCompare(b.name);
        } else if (sortBy === "price") {
            comparison = getItemTotal(a) - getItemTotal(b);
        } else if (sortBy === "quantity") {
            comparison = a.quantity - b.quantity;
        }
        return sortOrder === "asc" ? comparison : -comparison;
    });

    // Pending first, purchased second
    const pendingItemsGroup = sortedItems.filter((i) => !i.isPurchased);
    const purchasedItemsGroup = sortedItems.filter((i) => i.isPurchased);
    const finalOrderedItems = [...pendingItemsGroup, ...purchasedItemsGroup];

    // Handlers
    const handleAddItem = (itemValues) => {
        const newItem = {
            id: `item-${Date.now()}`,
            listId,
            isPurchased: false,
            ...itemValues,
        };
        dispatch(addItem(newItem));
        setIsAddOpen(false);
    };

    const handleEditItemSubmit = (itemValues) => {
        if (editItemObj) {
            dispatch(
                editItem({
                    id: editItemObj.id,
                    ...itemValues,
                })
            );
            setEditItemObj(null);
        }
    };

    const handleDeleteItemConfirm = () => {
        if (deleteItemId) {
            dispatch(deleteItem(deleteItemId));
            setDeleteItemId(null);
        }
    };

    const handleTogglePurchased = (id) => {
        dispatch(toggleItemPurchased(id));
    };

    const handleToggleDuplicatePrevention = (checked) => {
        dispatch(
            editList({
                ...list,
                duplicateToggle: checked,
            })
        );
    };

    const STATUS_OPTIONS = [
        { value: "all", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "purchased", label: "Purchased" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.285 ,filter:"blur(50px)"}}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-14 flex flex-col gap-8 sm:gap-10"
        >
            {/* List Header */}
            <div className="flex flex-col gap-4 select-none">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <Button
                            variant="icon"
                            onClick={() => router.push("/dashboard")}
                            title="Go back to Dashboard"
                            aria-label="Go back to Dashboard"
                        >
                            <FiArrowLeft className="w-[18px] h-[18px]" />
                        </Button>
                        <div className="flex flex-col">
                            <h1 className="text-heading-md sm:text-heading-lg font-bold tracking-tight text-text-primary leading-tight">
                                {list.name}
                            </h1>
                            <p className="text-body-sm text-text-muted mt-2">
                                ₹{formatINR(totalCost)} estimated
                                <span className="mx-2 text-border-strong">·</span>
                                {totalCount} {totalCount === 1 ? "item" : "items"}
                                <span className="mx-2 text-border-strong">·</span>
                                {pendingCount} pending
                                <span className="mx-2 text-border-strong">·</span>
                                {purchasedCount} purchased
                            </p>
                        </div>
                    </div>

                    {/* Header actions */}
                    <div className="flex items-center gap-3 self-start md:self-auto">
                        <div className="flex items-center gap-2.5 px-3 h-9 border border-border-subtle bg-surface rounded">
                            <span className="text-body-sm font-semibold text-text-primary whitespace-nowrap">
                                Duplicate protection
                            </span>
                            <ToggleSwitch
                                checked={!!list.duplicateToggle}
                                onChange={handleToggleDuplicatePrevention}
                                showState
                            />
                        </div>
                        <Button onClick={() => setIsAddOpen(true)} icon={FiPlus}>
                            Add Item
                        </Button>
                    </div>
                </div>
            </div>

            {/* Items Workspace */}
            <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2.5 select-none">
                    <h2 className="text-body-md font-bold text-text-primary uppercase tracking-wider">Items</h2>
                    <span className="text-label-sm font-bold text-text-muted bg-surface-muted px-2 py-0.5 rounded-full">
                        {totalCount}
                    </span>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 bg-surface border border-border-subtle rounded-sm  ">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <FiSearch
                            aria-hidden="true"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="Search items in this list..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 bg-surface-muted border border-border-subtle rounded text-body-sm text-text-primary placeholder:text-text-muted outline-none hover:border-border-strong focus-visible:border-border-focus transition-colors duration-200"
                        />
                    </div>

                    {/* Status + Sort */}
                    <div className="flex flex-wrap items-center gap-3 select-none">
                        {/* Status pill selection with motion */}
                        <div className="relative flex bg-surface-muted dark:bg-surface-elevated p-0.5 gap-0.5 rounded">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setFilterStatus(opt.value)}
                                    className={`relative px-3 h-8 text-label-md font-semibold transition-colors cursor-pointer rounded z-10 ${
                                        filterStatus === opt.value
                                            ? "text-white"
                                            : "text-text-muted hover:text-text-primary"
                                    }`}
                                >
                                    {filterStatus === opt.value && (
                                        <motion.div
                                            layoutId="filter-pill"
                                            className="absolute inset-0 bg-brand rounded"
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{opt.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <Select
                                value={sortBy}
                                onChange={setSortBy}
                                ariaLabel="Sort by"
                                options={[
                                    { value: "name", label: "Name" },
                                    { value: "price", label: "Estimated Price" },
                                    { value: "quantity", label: "Quantity" },
                                ]}
                            />
                            <button
                                type="button"
                                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                className="w-10 h-10 rounded border border-border-default bg-surface-muted dark:bg-surface-elevated text-text-muted hover:text-text-primary hover:bg-surface flex items-center justify-center cursor-pointer transition-colors"
                                title={sortOrder === "asc" ? "Sorting ascending" : "Sorting descending"}
                                aria-label={`Sort direction: ${sortOrder === "asc" ? "ascending" : "descending"}`}
                            >
                                <FiArrowUp
                                    className={`w-[18px] h-[18px] transition-transform duration-200 ${
                                        sortOrder === "desc" ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product rows */}
                <div className="flex flex-col gap-3 min-h-[200px]">
                    {finalOrderedItems.length === 0 ? (
                        <EmptyState
                            icon={FiShoppingCart}
                            title={localSearch ? "No matching products" : "Your shopping list is empty"}
                            description={
                                localSearch
                                    ? "Try searching for another item or clear your search term."
                                    : "Add products to start comparing supported prices."
                            }
                            actionLabel={localSearch ? null : "Add Item"}
                            onAction={localSearch ? null : () => setIsAddOpen(true)}
                        />
                    ) : (
                        <AnimatePresence mode="popLayout" initial={false}>
                            {finalOrderedItems.map((item) => {
                                const isHighlighted = item.id === highlightId;
                                return (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className={`rounded-sm  ${
                                            isHighlighted ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""
                                        }`}
                                    >
                                        <ItemCard
                                            item={item}
                                            onTogglePurchased={handleTogglePurchased}
                                            onEdit={setEditItemObj}
                                            onDelete={setDeleteItemId}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Modals & Dialogs */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Item">
                <ItemForm
                    listId={listId}
                    onSubmit={handleAddItem}
                    onCancel={() => setIsAddOpen(false)}
                    submitLabel="Add Item"
                />
            </Modal>

            <Modal isOpen={!!editItemObj} onClose={() => setEditItemObj(null)} title="Edit Item">
                {editItemObj && (
                    <ItemForm
                        listId={listId}
                        itemId={editItemObj.id}
                        initialValues={editItemObj}
                        onSubmit={handleEditItemSubmit}
                        onCancel={() => setEditItemObj(null)}
                        submitLabel="Save Changes"
                    />
                )}
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteItemId}
                onClose={() => setDeleteItemId(null)}
                onConfirm={handleDeleteItemConfirm}
                title="Delete Item?"
                message="Are you sure you want to delete this item? This product will be permanently removed from this shopping list."
            />
        </motion.div>
    );
}
