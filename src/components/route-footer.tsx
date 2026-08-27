"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./layout";

export function RouteFooter() {
  return usePathname() === "/" ? <Footer /> : null;
}
