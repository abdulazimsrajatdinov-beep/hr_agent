"use client";
import { useEffect } from "react";

export function TelegramInit() {
  useEffect(() => {
    // @ts-ignore
    const WebApp = window.Telegram?.WebApp;
    if (WebApp) {
      WebApp.ready();
      WebApp.expand();
      WebApp.enableClosingConfirmation();
      // Optional: Set header color to match dark mode
      WebApp.setHeaderColor('#020617');
    }
  }, []);

  return null;
}
