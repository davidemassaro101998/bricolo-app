// Bricolo AI - PWA Smart Notification Infrastructure

let swRegistration: ServiceWorkerRegistration | null = null;

/**
 * Register Service Worker if supported by browser
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    swRegistration = reg;
    console.log("Bricolo AI Service Worker registered successfully.");
    return reg;
  } catch (err) {
    console.warn("Service Worker registration failed:", err);
    return null;
  }
}

/**
 * Request Notification Permissions
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (e) {
      console.warn("Error requesting notification permission:", e);
    }
  }

  return false;
}

/**
 * Interface for Dispatching Notifications
 */
export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag: string;
  vibrate?: number[];
  actions?: Array<{ action: string; title: string }>;
  data?: Record<string, any>;
}

/**
 * Send Web Push Notification via ServiceWorker or Fallback Notification API
 */
export async function dispatchPwaNotification(payload: NotificationPayload): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission !== "granted") {
    const granted = await requestNotificationPermission();
    if (!granted) return false;
  }

  const defaultVibrate = [200, 100, 200];
  const icon = payload.icon || "/icon.svg";
  const badge = payload.badge || "/favicon.ico";

  // Trigger native vibration if supported
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(payload.vibrate || defaultVibrate);
    } catch (e) {
      // ignore
    }
  }

  // 1. Prefer Service Worker registration showNotification
  try {
    if (!swRegistration && "serviceWorker" in navigator) {
      swRegistration = await navigator.serviceWorker.ready.catch(() => null);
    }

    if (swRegistration && "showNotification" in swRegistration) {
      await swRegistration.showNotification(payload.title, {
        body: payload.body,
        icon,
        badge,
        tag: payload.tag,
        vibrate: payload.vibrate || defaultVibrate,
        actions: payload.actions,
        data: payload.data || { url: "/" },
        requireInteraction: true,
      } as NotificationOptions);
      return true;
    }
  } catch (err) {
    console.warn("SW showNotification failed, using fallback Notification API:", err);
  }

  // 2. Fallback to standard Browser Notification constructor
  try {
    const n = new Notification(payload.title, {
      body: payload.body,
      icon,
      badge,
      tag: payload.tag,
      data: payload.data || { url: "/" },
    });

    n.onclick = () => {
      window.focus();
      if (payload.data?.url) {
        window.location.href = payload.data.url;
      }
      n.close();
    };
    return true;
  } catch (err) {
    console.error("Failed to display notification:", err);
    return false;
  }
}

