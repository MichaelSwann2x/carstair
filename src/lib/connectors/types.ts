export type ConnectorId =
  | "carstair_native"
  | "trax"
  | "amos"
  | "sap"
  | "ramco"
  | "veryon"
  | "custom";

export interface ConnectorDefinition {
  id: ConnectorId;
  name: string;
  description: string;
  offlineCapable: boolean;
  status: "available" | "beta" | "planned";
  fields: { key: string; label: string; type: "text" | "password" | "url"; required: boolean }[];
}

export const CONNECTORS: ConnectorDefinition[] = [
  {
    id: "carstair_native",
    name: "Carstair Native CMMS",
    description:
      "Built-in offline-first maintenance system. Fast, local, no internet required.",
    offlineCapable: true,
    status: "available",
    fields: [],
  },
  {
    id: "trax",
    name: "Trax",
    description: "Connect your existing Trax eMRO account.",
    offlineCapable: false,
    status: "beta",
    fields: [
      { key: "baseUrl", label: "Trax API base URL", type: "url", required: true },
      { key: "apiKey", label: "API key", type: "password", required: true },
      { key: "orgId", label: "Organisation ID", type: "text", required: false },
    ],
  },
  {
    id: "amos",
    name: "AMOS (Swiss-AS)",
    description: "Connect AMOS for fleet, work orders and compliance data.",
    offlineCapable: false,
    status: "beta",
    fields: [
      { key: "baseUrl", label: "AMOS endpoint", type: "url", required: true },
      { key: "username", label: "Username", type: "text", required: true },
      { key: "password", label: "Password", type: "password", required: true },
    ],
  },
  {
    id: "sap",
    name: "SAP",
    description: "SAP PM / aviation modules.",
    offlineCapable: false,
    status: "planned",
    fields: [
      { key: "baseUrl", label: "Gateway URL", type: "url", required: true },
      { key: "token", label: "Access token", type: "password", required: true },
    ],
  },
  {
    id: "ramco",
    name: "Ramco Aviation",
    description: "Ramco Aviation Suite connector.",
    offlineCapable: false,
    status: "planned",
    fields: [
      { key: "baseUrl", label: "API URL", type: "url", required: true },
      { key: "apiKey", label: "API key", type: "password", required: true },
    ],
  },
  {
    id: "veryon",
    name: "Veryon",
    description: "Veryon for Business Aviation connector.",
    offlineCapable: false,
    status: "planned",
    fields: [
      { key: "baseUrl", label: "Veryon URL", type: "url", required: true },
      { key: "apiKey", label: "API key", type: "password", required: true },
    ],
  },
];

export interface ConnectorConfig {
  connectorId: ConnectorId;
  tenantId: string;
  credentials: Record<string, string>;
  enabled: boolean;
  connectedAt?: string;
}

const CONFIG_KEY = (tenantId: string) => `carstair_${tenantId}_connectors`;

export function listConnectorConfigs(tenantId: string): ConnectorConfig[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CONFIG_KEY(tenantId)) || "[]");
  } catch {
    return [];
  }
}

export function saveConnectorConfig(config: ConnectorConfig): void {
  if (typeof window === "undefined") return;
  const list = listConnectorConfigs(config.tenantId).filter(
    (c) => c.connectorId !== config.connectorId
  );
  list.push({ ...config, connectedAt: new Date().toISOString() });
  localStorage.setItem(CONFIG_KEY(config.tenantId), JSON.stringify(list));
}
