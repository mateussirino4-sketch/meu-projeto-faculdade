"use client";

import { useMemo, useSyncExternalStore } from "react";
import { DEMO_FLOW_EVENT, DEMO_FLOW_KEY, type DemoFlowState } from "./demo-flow";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(DEMO_FLOW_EVENT, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(DEMO_FLOW_EVENT, callback); };
}

function getSnapshot() { return localStorage.getItem(DEMO_FLOW_KEY) ?? ""; }
function getServerSnapshot() { return ""; }

export function useDemoFlow() {
  const serialized = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => { try { const value = JSON.parse(serialized || "null") as DemoFlowState | null; return value?.version === 1 ? value : null; } catch { return null; } }, [serialized]);
}
