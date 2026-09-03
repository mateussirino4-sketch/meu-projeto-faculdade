export const DEMO_FLOW_KEY = "acorda_demo_flow_v1";
export const DEMO_FLOW_EVENT = "acorda-demo-flow-change";

export type DemoProfile = {
  id: string;
  demoIdentifier: string;
  displayName: string;
  birthDate: string | null;
  motherName: string | null;
  isManualEntry: boolean;
};

export type DemoAnswers = {
  fullName: string;
  motherName: string;
  monthlyIncome: string;
  birthDate: string;
  debtType: string;
  email: string;
  phone: string;
};

export type DemoFlowState = {
  version: 1;
  profile: DemoProfile;
  answers: DemoAnswers;
  verificationStep: number;
  contentStep: number;
  selectedCreditorId?: string;
  updatedAt: string;
};

const emptyAnswers: DemoAnswers = { fullName: "", motherName: "", monthlyIncome: "", birthDate: "", debtType: "", email: "", phone: "" };

export function createDemoFlow(profile: DemoProfile): DemoFlowState {
  return { version: 1, profile, answers: { ...emptyAnswers }, verificationStep: 0, contentStep: 0, updatedAt: new Date().toISOString() };
}

export function loadDemoFlow(): DemoFlowState | null {
  if (typeof window === "undefined") return null;
  try { const value = JSON.parse(localStorage.getItem(DEMO_FLOW_KEY) ?? "null") as DemoFlowState | null; return value?.version === 1 && value.profile?.demoIdentifier ? value : null; } catch { return null; }
}

export function saveDemoFlow(state: DemoFlowState) {
  localStorage.setItem(DEMO_FLOW_KEY, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }));
  window.dispatchEvent(new Event(DEMO_FLOW_EVENT));
}

export function clearDemoFlow() { localStorage.removeItem(DEMO_FLOW_KEY); window.dispatchEvent(new Event(DEMO_FLOW_EVENT)); }

export function normalizeDemoIdentifier(value: string) { return value.trim().toUpperCase().replace(/\s+/g, "-"); }

export function validateDemoIdentifier(value: string) {
  const normalized = normalizeDemoIdentifier(value);
  if (!/^DEMO-[A-Z]+-\d{3}$/.test(normalized)) return "Use um identificador fictício no formato DEMO-FOUND-001.";
  return "";
}

export function normalizeNumericIdentifier(value: string) { return value.replace(/\D/g, "").slice(0, 11); }

export function formatNumericIdentifier(value: string) {
  const digits = normalizeNumericIdentifier(value);
  return digits.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function validateNumericIdentifier(value: string) {
  return normalizeNumericIdentifier(value).length === 11 ? "" : "Informe exatamente 11 números.";
}
