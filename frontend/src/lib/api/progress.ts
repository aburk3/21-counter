import type { DashboardResponse } from "@/types/api";

import { request } from "./client";

const dashboard = () => request<DashboardResponse>("/dashboard");

export { dashboard };
