"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function LegacySearchRedirect() {
  const router = useRouter();
  useEffect(() => {
    const check = () => { if (window.location.hash === "#search") router.replace("/search"); };
    check(); window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, [router]);
  return null;
}
