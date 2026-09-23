"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLists } from "@/app/features/listsSlice";
import { setItems } from "@/app/features/itemsSlice";
import { setSettings } from "@/app/features/settingsSlice";

export default function ClientWrapper({ children }) {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.settings.theme);

  useEffect(() => {
    try {
      const savedLists = localStorage.getItem("smart_todo_lists");
      const savedItems = localStorage.getItem("smart_todo_items");
      const savedSettings = localStorage.getItem("smart_todo_settings");

      if (savedLists) {
        dispatch(setLists(JSON.parse(savedLists)));
      }
      if (savedItems) {
        dispatch(setItems(JSON.parse(savedItems)));
      }
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch(setSettings(parsedSettings));
        if (parsedSettings.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }      } catch (err) {
        // failed to hydrate
      }
    setMounted(true);
  }, [dispatch]);

  useEffect(() => {
    if (mounted) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 animate-in fade-in duration-300">
          <div className="w-12 h-12 rounded-md bg-surface-muted" />
          <span className="text-body-sm font-medium text-text-muted">Loading…</span>
        </div>
      </div>
    );
  }

  return children;
}
