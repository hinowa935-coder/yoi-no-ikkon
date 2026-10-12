"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationCupIcon, NavigationMoonIcon, NavigationSearchIcon } from "./InterfaceIcons.jsx";
import { primaryDestinations, navigationCurrent } from "./navigationModel.js";

export default function PrimaryNavigation({ placement }) {
  const pathname = usePathname();
  const destinations = placement === "header" ? primaryDestinations.slice(1) : primaryDestinations;
  return <nav className={`primary-navigation navigation-${placement}`} aria-label={placement === "header" ? "メインナビゲーション" : "画面下部のナビゲーション"}>
    {destinations.map(destination => {
      const current = navigationCurrent(pathname, destination);
      return <Link key={destination.id} href={destination.href} aria-current={current} className={`primary-nav-link ${current ? "is-current" : ""}`}>
        {destination.id === "ochoko" ? <NavigationCupIcon /> : destination.id === "tonight" ? <NavigationMoonIcon /> : <NavigationSearchIcon />}
        <span>{placement === "header" && destination.id === "search" ? "日本酒を探す" : destination.label}</span>
      </Link>;
    })}
  </nav>;
}
