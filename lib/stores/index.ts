export { useAuthStore } from "./auth.store";
export { useUIStore } from "./ui.store";
export { useDashboardStore } from "./dashboard.store";

export type { User } from "./auth.store";

export interface EndpointResponse {
  status: string;
  message: string;
}
