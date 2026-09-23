"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import { FiPlus, FiList, FiCheckSquare, FiClock, FiTrendingUp, FiSliders, FiShoppingBag } from "react-icons/fi";
import { addList, editList, deleteList } from "../features/listsSlice";
import { toggleGlobalDuplicate } from "../features/settingsSlice";
import { getItemTotal } from "./utils/priceEngine";
import StatsCard from "./components/layout/StatsCard";
import ListCard from "./components/layout/ListCard";
import Button from "./components/ui/Button";
import Modal from "./components/ui/Modal";
import ToggleSwitch from "./components/ui/ToggleSwitch";
import EmptyState from "./components/ui/EmptyState";
import ConfirmDialog from "./components/ui/ConfirmDialog";
import ListForm from "./components/forms/ListForm";
import CreateListEmptyState from "./components/common/CreateListEmptyState";
import CreateListTile from "./components/layout/CreateListTile";
import GlobalDuplicateSafeguard from "./components/layout/GlobalDuplicateSafeguard";

export default function Dashboard() {
    const dispatch = useDispatch();

    // Selectors
    const listsById = useSelector((state) => state.lists.byId);
    const listIds = useSelector((state) => state.lists.allIds);
    const itemsById = useSelector((state) => state.items.byId);
    const itemIds = useSelector((state) => state.items.allIds);
    const globalDuplicateToggle = useSelector((state) => state.settings.globalDuplicateToggle);

    // Modal & Dialog States
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editListObj, setEditListObj] = useState(null);
    const [deleteListId, setDeleteListId] = useState(null);

    // Core Math Metrics
    const totalLists = listIds.length;
    const totalItems = itemIds.length;

    const itemsArray = itemIds.map((id) => itemsById[id]).filter(Boolean);
    const purchasedItems = itemsArray.filter((item) => item.isPurchased).length;
    const pendingItems = totalItems - purchasedItems;

    const totalEstimatedCost = itemsArray.reduce((sum, item) => sum + getItemTotal(item), 0);

    // List Handlers
    const handleCreateList = ({ name, duplicateToggle }) => {
        const newList = {
            id: `list-${Date.now()}`,
            name,
            duplicateToggle,
        };
        dispatch(addList(newList));
        setIsCreateOpen(false);
    };

    const handleEditListSubmit = ({ name, duplicateToggle }) => {
        if (editListObj) {
            dispatch(
                editList({
                    id: editListObj.id,
                    name,
                    duplicateToggle,
                })
            );
            setEditListObj(null);
        }
    };

    const handleDeleteListConfirm = () => {
        if (deleteListId) {
            dispatch(deleteList(deleteListId));
            setDeleteListId(null);
        }
    };

    const handleToggleLocalDuplicate = (listId, checked) => {
        const list = listsById[listId];
        if (list) {
            dispatch(
                editList({
                    ...list,
                    duplicateToggle: checked,
                })
            );
        }
    };

    // Pre-calculate per-list stats for grid display
    const getListStats = (listId) => {
        const listItems = itemsArray.filter((item) => item.listId === listId);
        const count = listItems.length;
        const purchased = listItems.filter((item) => item.isPurchased).length;
        const pending = count - purchased;
        const cost = listItems.reduce((sum, item) => sum + getItemTotal(item), 0);
        return { count, purchased, pending, cost };
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0.65, 0.3, 1] }}
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-14 flex flex-col gap-8 sm:gap-10"
        >
            {/* Welcome & Dashboard Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
                <div>
                    <h1 className="text-heading-md sm:text-heading-lg font-bold tracking-tight text-text-primary">
                        Shopping Lists
                    </h1>
                    <p className="text-body-sm text-text-muted mt-2">
                        Organize, compare prices, and track your purchases.
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="shrink-0 self-start md:self-auto" icon={FiPlus}>
                    Create List
                </Button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <StatsCard
                    title="Total Lists"
                    value={totalLists}
                    description="Active shopping lists"
                    icon={FiList}
                    accentColor="text-accent"
                />
                <StatsCard
                    title="Total Products"
                    value={totalItems}
                    description="Items across all lists"
                    icon={FiCheckSquare}
                    accentColor="text-success"
                />
                <StatsCard
                    title="Pending Items"
                    value={pendingItems}
                    description={`${purchasedItems} items purchased`}
                    icon={FiClock}
                    accentColor="text-warning"
                />
                <StatsCard
                    title="Total Est. Cost"
                    value={totalEstimatedCost}
                    prefix="₹"
                    minimumFractionDigits={2}
                    maximumFractionDigits={2}
                    description="Combined estimated budget"
                    icon={FiTrendingUp}
                    accentColor="text-action"
                />
            </div>

            {/* Global Duplicate Safeguard */}
            <GlobalDuplicateSafeguard
                checked={globalDuplicateToggle}
                onChange={() => dispatch(toggleGlobalDuplicate())}
            />

            {/* Shopping Lists Workspace */}
            <div>
                <div className="flex items-center gap-2.5 mb-5 select-none">
                    <h2 className="text-body-md font-bold text-text-primary uppercase tracking-wider">
                        Shopping Lists
                    </h2>
                    <span className="text-label-sm font-bold text-text-muted bg-surface-muted px-2 py-0.5 rounded-full">
                        {totalLists}
                    </span>
                </div>

                {listIds.length === 0 ? (
                    <CreateListEmptyState
                        onCreate={() => setIsCreateOpen(true)}
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {listIds.map((listId) => {
                            const list = listsById[listId];
                            const stats = getListStats(listId);
                            return (
                                <ListCard
                                    key={listId}
                                    list={list}
                                    itemsCount={stats.count}
                                    pendingCount={stats.pending}
                                    purchasedCount={stats.purchased}
                                    estimatedCost={stats.cost}
                                    onToggleDuplicate={handleToggleLocalDuplicate}
                                    onEdit={setEditListObj}
                                    onDelete={setDeleteListId}
                                />
                            );
                        })}

                        {/* Secondary create-list tile */}
                            <CreateListTile
                                onCreate={() => setIsCreateOpen(true)}
                            />
                    </div>
                )}
            </div>

            {/* Modals & Dialogs */}
            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Shopping List">
                <ListForm onSubmit={handleCreateList} onCancel={() => setIsCreateOpen(false)} submitLabel="Create List" />
            </Modal>

            <Modal isOpen={!!editListObj} onClose={() => setEditListObj(null)} title="Edit Shopping List">
                {editListObj && (
                    <ListForm
                        initialValues={editListObj}
                        onSubmit={handleEditListSubmit}
                        onCancel={() => setEditListObj(null)}
                        submitLabel="Save Changes"
                    />
                )}
            </Modal>

            <ConfirmDialog
                isOpen={!!deleteListId}
                onClose={() => setDeleteListId(null)}
                onConfirm={handleDeleteListConfirm}
                title="Delete Shopping List?"
                message="Are you sure you want to delete this shopping list? All items inside this list will be permanently removed."
            />
        </motion.div>
    );
}
