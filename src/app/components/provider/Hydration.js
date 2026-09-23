"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { setLists } from "@/app/features/listsSlice";
import { setItems } from "@/app/features/itemsSlice";
import { setSettings } from "@/app/features/settingsSlice";

import { markPersistenceReady } from "@/app/store/store";

const STORAGE_KEY = "spendwise_state";

export default function Hydration({ children }) {
  const dispatch = useDispatch();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const hydrate = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (raw) {
          const parsed = JSON.parse(raw);

          /*
           * Restore lists.
           */
          if (
            parsed?.lists &&
            parsed.lists.byId &&
            Array.isArray(parsed.lists.allIds)
          ) {
            dispatch(setLists(parsed.lists));
          }

          /*
           * Restore items.
           */
          if (
            parsed?.items &&
            parsed.items.byId &&
            Array.isArray(parsed.items.allIds)
          ) {
            dispatch(setItems(parsed.items));
          }

          /*
           * Restore settings.
           */
          if (parsed?.settings) {
            dispatch(setSettings(parsed.settings));
          }
        }
      } catch (error) {
        console.warn(
          "[Spendwise] Hydration failed:",
          error?.message || error
        );
      } finally {
        /*
         * VERY IMPORTANT:
         *
         * Persistence becomes active only AFTER all
         * restoration dispatches have completed.
         *
         * No timer.
         * No 100ms guess.
         */
        markPersistenceReady();

        if (!cancelled) {
          setHydrated(true);
        }
      }
    };

    hydrate();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  /*
   * Don't render the application until persisted Redux
   * state has been restored.
   */
  if (!hydrated) {
    return null;
  }

  return children;
}