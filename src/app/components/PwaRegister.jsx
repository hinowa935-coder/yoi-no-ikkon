"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;
    let controller = navigator.serviceWorker.controller;

    navigator.serviceWorker.register("/sw.js").then((registration) => {
      registration.update();
    }).catch(() => {
      // PWA is an enhancement; the site should continue normally without it.
    });

    const handleControllerChange = () => {
      const previous = controller;
      controller = navigator.serviceWorker.controller;
      // The first install claims this page without requiring a reload.
      if (!previous || !controller || previous === controller || refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
    };
  }, []);

  return null;
}
