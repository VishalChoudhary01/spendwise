import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "../features/uiSlice";
import listsReducer from "../features/listsSlice";
import itemsReducer from "../features/itemsSlice";
import settingsReducer from "../features/settingsSlice";
import searchReducer from "../features/searchSlice";

const STORAGE_KEY = "spendwise_state";

let persistenceReady = false;

/**
 * Hydration calls this only after persisted application data
 * has been completely restored into Redux.
 */
export const markPersistenceReady = () => {
    persistenceReady = true;
};

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        lists: listsReducer,
        items: itemsReducer,
        settings: settingsReducer,
        search: searchReducer,
    },
});

/**
 * Persist application data after hydration.
 *
 * IMPORTANT:
 * - Theme is intentionally NOT stored here.
 * - ThemeHandler owns theme persistence separately.
 * - UI/search state is intentionally NOT persisted.
 */
if (typeof window !== "undefined") {
    store.subscribe(() => {
        if (!persistenceReady) {
            return;
        }

        const state = store.getState();

        const persistedState = {
            lists: state.lists,
            items: state.items,
            settings: state.settings,
        };

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(persistedState)
            );
        } catch (error) {
            console.warn(
                "[Spendwise] Failed to persist state:",
                error?.message || error
            );
        }
    });
}