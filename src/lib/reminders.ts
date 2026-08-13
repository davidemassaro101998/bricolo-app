// I progetti salvati — il pezzo che rende Bricolo AI un'abitudine
// invece di un tool usa-e-getta. Il tipo `SavedReminder` e la funzione
// `checkSavedEventNotifications` (14/7/3 giorni prima) vivono in
// pwaNotifications.ts. Questo file e le funzioni CRUD su cui si
// appoggiano sia SettingsDrawer (lista/elimina) sia ResultsDeckApple
// (salva dopo un risultato).

import { SavedReminder } from "../types";

const STORAGE_KEY = "kado_saved_reminders";

export function getReminders(): SavedReminder[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function addReminder(reminder: Omit<SavedReminder, "id" | "createdAt">): SavedReminder {
  const full: SavedReminder = {
    ...reminder,
    id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  const all = getReminders();
  all.push(full);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    // ignore
  }
  return full;
}

export function deleteReminder(id: string): void {
  const all = getReminders().filter((r) => r.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    // ignore
  }
}
