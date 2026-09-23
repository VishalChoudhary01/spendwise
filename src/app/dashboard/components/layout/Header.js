"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiShoppingBag, FiList, FiSun, FiMoon, FiSearch, FiX } from "react-icons/fi";
import { setTheme } from "@/app/features/themeSlice";
import { setGlobalSearchQuery } from "@/app/features/searchSlice";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useSelector((state) => state.settings.theme);
  const globalSearchQuery = useSelector((state) => state.search.globalSearchQuery);

  const listsById = useSelector((state) => state.lists.byId);
  const listAllIds = useSelector((state) => state.lists.allIds);
  const itemsById = useSelector((state) => state.items.byId);
  const itemAllIds = useSelector((state) => state.items.allIds);

  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleThemeSetting = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    dispatch(setTheme(nextTheme));
  };

  // Grouped search logic
  const query = globalSearchQuery.trim().toLowerCase();
  const matchedLists = [];
  const matchedItems = [];

  if (query.length > 0) {
    // Search list names
    for (const listId of listAllIds) {
      const list = listsById[listId];
      if (list && list.name.toLowerCase().includes(query)) {
        matchedLists.push(list);
      }
    }
    // Search item names
    for (const itemId of itemAllIds) {
      const item = itemsById[itemId];
      if (item && item.name.toLowerCase().includes(query)) {
        const parentList = listsById[item.listId];
        matchedItems.push({
          ...item,
          listName: parentList ? parentList.name : "Unknown List",
        });
      }
    }
  }

  const hasResults = matchedLists.length > 0 || matchedItems.length > 0;

  return (
    <header className="sticky top-0 z-20 bg-surface/90 border-b border-border-subtle transition-colors duration-200">
      {/* Main header row */}
      <div className="max-w-app mx-auto px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-md bg-brand text-background flex items-center justify-center group-hover:opacity-90 transition-opacity">
            <FiShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-body-lg font-bold text-text-primary tracking-tight leading-none hidden sm:block">
            SmartShop
          </span>
        </Link>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md mx-auto hidden sm:block">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-[18px] h-[18px] pointer-events-none" />
            <input
              type="text"
              placeholder="Search lists or items..."
              value={globalSearchQuery}
              onChange={(e) => {
                dispatch(setGlobalSearchQuery(e.target.value));
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              className="w-full h-11 pl-9 pr-10 bg-surface-muted border border-border-subtle rounded-sm text-body-sm text-text-primary placeholder:text-text-muted outline-none hover:border-border-strong focus-visible:border-border-focus transition-colors duration-200"
            />
            {globalSearchQuery && (
              <button
                onClick={() => {
                  dispatch(setGlobalSearchQuery(""));
                  setIsOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1 rounded-md hover:bg-surface-muted transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown — desktop */}
          {isOpen && globalSearchQuery.trim() !== "" && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated border border-border-subtle rounded-lg shadow-sm max-h-[350px] overflow-y-auto z-[30] p-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
              {!hasResults ? (
                <div className="py-8 px-6 text-center flex flex-col items-center gap-2">
                  <FiSearch className="w-5 h-5 text-text-muted" aria-hidden="true" />
                  <span className="text-body-sm text-text-muted">No matching lists or items found.</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  {matchedLists.length > 0 && (
                    <div className="pb-1.5">
                      <div className="px-3 pt-2.5 pb-1 flex items-center justify-between select-none">
                        <span className="text-label-sm font-semibold text-text-muted uppercase tracking-wider">
                          Shopping Lists
                        </span>
                        <span className="text-label-sm font-bold text-text-muted bg-surface-muted px-1.5 py-0.5 rounded-full leading-none">
                          {matchedLists.length}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        {matchedLists.map((list) => (
                          <button
                            key={list.id}
                            onClick={() => {
                              router.push(`/dashboard/list/${list.id}`);
                              setIsOpen(false);
                              dispatch(setGlobalSearchQuery(""));
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-md text-body-sm text-text-primary hover:bg-surface-muted flex items-center justify-between gap-3 transition-colors"
                          >
                            <span className="flex items-center gap-2.5 min-w-0">
                              <FiList className="w-4 h-4 text-text-muted shrink-0" aria-hidden="true" />
                              <span className="font-medium truncate">{list.name}</span>
                            </span>
                            <span className="text-label-sm text-text-muted shrink-0">Open</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchedLists.length > 0 && matchedItems.length > 0 && (
                    <div className="mx-3 my-1 border-t border-border-subtle" />
                  )}

                  {matchedItems.length > 0 && (
                    <div className="pt-1.5">
                      <div className="px-3 pt-2.5 pb-1 flex items-center justify-between select-none">
                        <span className="text-label-sm font-semibold text-text-muted uppercase tracking-wider">
                          Products & Items
                        </span>
                        <span className="text-label-sm font-bold text-text-muted bg-surface-muted px-1.5 py-0.5 rounded-full leading-none">
                          {matchedItems.length}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        {matchedItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              router.push(`/dashboard/list/${item.listId}?highlight=${item.id}`);
                              setIsOpen(false);
                              dispatch(setGlobalSearchQuery(""));
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-md text-body-sm text-text-primary hover:bg-surface-muted flex flex-col gap-1 transition-colors"
                          >
                            <div className="flex justify-between items-center w-full gap-3">
                              <span className="flex items-center gap-2.5 min-w-0">
                                <FiShoppingBag className="w-4 h-4 text-text-muted shrink-0" aria-hidden="true" />
                                <span className="font-medium truncate">{item.name}</span>
                              </span>
                              <span className="text-label-sm text-text-muted bg-surface-muted px-2 py-0.5 rounded-full shrink-0">
                                in {item.listName}
                              </span>
                            </div>
                            <span className="text-body-sm text-text-muted pl-7">
                              Qty: {item.quantity} {item.unit}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleThemeSetting}
            className="w-11 h-11 rounded-md border border-border-default hover:bg-surface-muted flex items-center justify-center transition-colors duration-200 cursor-pointer"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <FiSun className="w-[18px] h-[18px] text-text-muted hover:text-text-primary transition-colors" />
            ) : (
              <FiMoon className="w-[18px] h-[18px] text-text-muted hover:text-text-primary transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile search bar — full width row, only on small screens */}
      <div className="block sm:hidden border-t border-border-subtle bg-surface px-4 py-3" ref={searchRef}>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search lists or items..."
            value={globalSearchQuery}
            onChange={(e) => {
              dispatch(setGlobalSearchQuery(e.target.value));
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}              className="w-full h-11 pl-9 pr-10 bg-surface-muted border border-border-subtle rounded-sm text-body-sm text-text-primary placeholder:text-text-muted outline-none hover:border-border-strong focus-visible:border-border-focus transition-colors duration-200"
          />
          {globalSearchQuery && (
            <button
              onClick={() => {
                dispatch(setGlobalSearchQuery(""));
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-1 rounded-md hover:bg-surface-muted transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Dropdown — mobile */}
        {isOpen && globalSearchQuery.trim() !== "" && (
          <div className="absolute left-4 right-4 mt-2 bg-surface-elevated border border-border-subtle rounded-lg shadow-sm max-h-[60vh] overflow-y-auto z-[30] p-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
            {!hasResults ? (
              <div className="py-8 px-6 text-center flex flex-col items-center gap-2">
                <FiSearch className="w-5 h-5 text-text-muted" aria-hidden="true" />
                <span className="text-body-sm text-text-muted">No matching lists or items found.</span>
              </div>
            ) : (
              <div className="flex flex-col">
                {matchedLists.length > 0 && (
                  <div className="pb-1.5">
                    <div className="px-3 pt-2.5 pb-1 flex items-center justify-between select-none">
                      <span className="text-label-sm font-semibold text-text-muted uppercase tracking-wider">
                        Shopping Lists
                      </span>
                      <span className="text-label-sm font-bold text-text-muted bg-surface-muted px-1.5 py-0.5 rounded-full leading-none">
                        {matchedLists.length}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      {matchedLists.map((list) => (
                        <button
                          key={list.id}
                          onClick={() => {
                            router.push(`/dashboard/list/${list.id}`);
                            setIsOpen(false);
                            dispatch(setGlobalSearchQuery(""));
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-md text-body-sm text-text-primary hover:bg-surface-muted flex items-center justify-between gap-3 transition-colors"
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <FiList className="w-4 h-4 text-text-muted shrink-0" aria-hidden="true" />
                            <span className="font-medium truncate">{list.name}</span>
                          </span>
                          <span className="text-label-sm text-text-muted shrink-0">Open</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {matchedLists.length > 0 && matchedItems.length > 0 && (
                  <div className="mx-3 my-1 border-t border-border-subtle" />
                )}

                {matchedItems.length > 0 && (
                  <div className="pt-1.5">
                    <div className="px-3 pt-2.5 pb-1 flex items-center justify-between select-none">
                      <span className="text-label-sm font-semibold text-text-muted uppercase tracking-wider">
                        Products & Items
                      </span>
                      <span className="text-label-sm font-bold text-text-muted bg-surface-muted px-1.5 py-0.5 rounded-full leading-none">
                        {matchedItems.length}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      {matchedItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            router.push(`/dashboard/list/${item.listId}?highlight=${item.id}`);
                            setIsOpen(false);
                            dispatch(setGlobalSearchQuery(""));
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-md text-body-sm text-text-primary hover:bg-surface-muted flex flex-col gap-1 transition-colors"
                        >
                          <div className="flex justify-between items-center w-full gap-3">
                            <span className="flex items-center gap-2.5 min-w-0">
                              <FiShoppingBag className="w-4 h-4 text-text-muted shrink-0" aria-hidden="true" />
                              <span className="font-medium truncate">{item.name}</span>
                            </span>
                            <span className="text-label-sm text-text-muted bg-surface-muted px-2 py-0.5 rounded-full shrink-0">
                              in {item.listName}
                            </span>
                          </div>
                          <span className="text-body-sm text-text-muted pl-7">
                            Qty: {item.quantity} {item.unit}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
