"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGroup } from "motion/react";
import { FiSearch, FiX, FiArrowLeft, FiShoppingBag } from "react-icons/fi";

import { setGlobalSearchQuery } from "@/app/features/searchSlice";
import Logo from "@/app/components/common/logo";
import ThemeToggle from "@/app/components/ui/ThemeToggle";
import SpendwiseLoader from "@/app/components/common/loader/SpendwiseLoader";

export default function DashboardLayout({ children }) {
  return (
    <>
      <SpendwiseLoader />

      <div className="min-h-screen flex flex-col bg-background">
        <DashboardHeader />

        <main className="flex-1">
          <LayoutGroup id="dashboard-layout">
            {children}
          </LayoutGroup>
        </main>
      </div>
    </>
  );
}

function DashboardHeader() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const globalSearchQuery = useSelector(
    (state) => state.search.globalSearchQuery
  );

  const listsById = useSelector(
    (state) => state.lists.byId
  );

  const listAllIds = useSelector(
    (state) => state.lists.allIds
  );

  const itemsById = useSelector(
    (state) => state.items.byId
  );

  const itemAllIds = useSelector(
    (state) => state.items.allIds
  );

  const [searchOpen, setSearchOpen] = React.useState(false);
  const searchRef = React.useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const query = globalSearchQuery.trim().toLowerCase();

  const matchedLists = [];
  const matchedItems = [];

  if (query.length > 0) {
    for (const listId of listAllIds) {
      const list = listsById[listId];

      if (
        list &&
        list.name.toLowerCase().includes(query)
      ) {
        matchedLists.push(list);
      }
    }

    for (const itemId of itemAllIds) {
      const item = itemsById[itemId];

      if (
        item &&
        item.name.toLowerCase().includes(query)
      ) {
        const parentList = listsById[item.listId];

        matchedItems.push({
          ...item,
          listName: parentList
            ? parentList.name
            : "Unknown List",
        });
      }
    }
  }

  const hasResults =
    matchedLists.length > 0 ||
    matchedItems.length > 0;

  const isListPage = pathname.startsWith(
    "/dashboard/list/"
  );

  return (
    <header className="sticky top-0 z-20 border-b border-border-subtle bg-surface/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex shrink-0 items-center gap-3">
          {isListPage ? (
            <button
              type="button"
              onClick={() =>
                router.push("/dashboard")
              }
              className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:bg-surface-muted hover:text-text-primary"
              aria-label="Back to Dashboard"
            >
              <FiArrowLeft
                className="h-[18px] w-[18px]"
                aria-hidden="true"
              />
            </button>
          ) : null}

          <Link
            href="/"
            className="shrink-0 "
          >
            <Logo />
          </Link>
        </div>

        {/* Center Search */}
        <div
          ref={searchRef}
          className="relative mx-auto hidden max-w-md flex-1 sm:block"
        >
          <div className="relative">
            <FiSearch
              className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />

            <input
              type="text"
              placeholder="Search lists or items..."
              value={globalSearchQuery}
              onChange={(event) => {
                dispatch(
                  setGlobalSearchQuery(
                    event.target.value
                  )
                );

                setSearchOpen(true);
              }}
              onFocus={() =>
                setSearchOpen(true)
              }
              className="h-10 w-full rounded border border-border-subtle bg-surface-muted pl-9 pr-10 text-body-sm text-text-primary outline-none placeholder:text-text-muted hover:border-border-strong focus-visible:border-border-focus"
            />

            {globalSearchQuery && (
              <button
                type="button"
                onClick={() => {
                  dispatch(
                    setGlobalSearchQuery("")
                  );

                  setSearchOpen(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-text-muted hover:bg-surface-muted hover:text-text-primary"
                aria-label="Clear search"
              >
                <FiX
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            )}
          </div>

          {/* Search dropdown */}
          {searchOpen &&
            globalSearchQuery.trim() !== "" && (
              <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[350px] overflow-y-auto rounded-lg border border-border-subtle bg-surface-elevated p-1.5 shadow-md">
                {!hasResults ? (
                  <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
                    <FiSearch
                      className="h-5 w-5 text-text-muted"
                      aria-hidden="true"
                    />

                    <span className="text-body-sm text-text-muted">
                      No matching lists or
                      items found.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {matchedLists.length > 0 && (
                      <div className="pb-1.5">
                        <div className="flex items-center justify-between px-3 pb-1 pt-2.5">
                          <span className="text-label-sm font-semibold uppercase tracking-wider text-text-muted">
                            Shopping Lists
                          </span>

                          <span className="rounded-full bg-surface-muted px-1.5 py-0.5 text-label-sm font-bold leading-none text-text-muted">
                            {matchedLists.length}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          {matchedLists.map(
                            (list) => (
                              <button
                                key={list.id}
                                type="button"
                                onClick={() => {
                                  router.push(
                                    `/dashboard/list/${list.id}`
                                  );

                                  setSearchOpen(
                                    false
                                  );

                                  dispatch(
                                    setGlobalSearchQuery(
                                      ""
                                    )
                                  );
                                }}
                                className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-body-sm text-text-primary hover:bg-surface-muted"
                              >
                                <span className="flex min-w-0 items-center gap-2.5">
                                  <FiShoppingBag
                                    className="h-4 w-4 shrink-0 text-text-muted"
                                    aria-hidden="true"
                                  />

                                  <span className="truncate font-medium">
                                    {
                                      list.name
                                    }
                                  </span>
                                </span>

                                <span className="shrink-0 text-label-sm text-text-muted">
                                  Open
                                </span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {matchedLists.length > 0 &&
                      matchedItems.length > 0 && (
                        <div className="mx-3 my-1 border-t border-border-subtle" />
                      )}

                    {matchedItems.length > 0 && (
                      <div className="pt-1.5">
                        <div className="flex items-center justify-between px-3 pb-1 pt-2.5">
                          <span className="text-label-sm font-semibold uppercase tracking-wider text-text-muted">
                            Products & Items
                          </span>

                          <span className="rounded-full bg-surface-muted px-1.5 py-0.5 text-label-sm font-bold leading-none text-text-muted">
                            {matchedItems.length}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          {matchedItems.map(
                            (item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                  router.push(
                                    `/dashboard/list/${item.listId}?highlight=${item.id}`
                                  );

                                  setSearchOpen(
                                    false
                                  );

                                  dispatch(
                                    setGlobalSearchQuery(
                                      ""
                                    )
                                  );
                                }}
                                className="flex w-full flex-col gap-1 rounded-md px-3 py-2.5 text-left text-body-sm text-text-primary hover:bg-surface-muted"
                              >
                                <div className="flex w-full items-center justify-between gap-3">
                                  <span className="flex min-w-0 items-center gap-2.5">
                                    <FiShoppingBag
                                      className="h-4 w-4 shrink-0 text-text-muted"
                                      aria-hidden="true"
                                    />

                                    <span className="truncate font-medium">
                                      {
                                        item.name
                                      }
                                    </span>
                                  </span>

                                  <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-label-sm text-text-muted">
                                    in{" "}
                                    {
                                      item.listName
                                    }
                                  </span>
                                </div>

                                <span className="pl-7 text-body-sm text-text-muted">
                                  Qty:{" "}
                                  {
                                    item.quantity
                                  }{" "}
                                  {
                                    item.unit
                                  }
                                </span>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
        </div>

        {/* Theme */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile search */}
      <div
        className="block border-t border-border-subtle bg-surface px-4 py-3 sm:hidden"
        ref={searchRef}
      >
        <div className="relative">
          <FiSearch
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />

          <input
            type="text"
            placeholder="Search lists or items..."
            value={globalSearchQuery}
            onChange={(event) => {
              dispatch(
                setGlobalSearchQuery(
                  event.target.value
                )
              );

              setSearchOpen(true);
            }}
            onFocus={() =>
              setSearchOpen(true)
            }
            className="h-10 w-full rounded-md border border-border-subtle bg-surface-muted pl-9 pr-10 text-body-sm text-text-primary outline-none placeholder:text-text-muted hover:border-border-strong focus-visible:border-border-focus"
          />

          {globalSearchQuery && (
            <button
              type="button"
              onClick={() => {
                dispatch(
                  setGlobalSearchQuery("")
                );

                setSearchOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-text-muted hover:bg-surface-muted hover:text-text-primary"
              aria-label="Clear search"
            >
              <FiX
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}