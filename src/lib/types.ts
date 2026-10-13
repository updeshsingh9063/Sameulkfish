// SPFM data model (Alpha, lean).
//
// PLACEHOLDER FIELDS: these inputs are a working stand-in until Samuel's
// SPFM field list and calculation rules arrive. The shape is deliberately
// simple so it can be swapped for the real field list without touching
// the screens' structure.

export type ProjectStatus = "quote" | "active" | "complete";

export interface ProductLine {
  id: string;
  description: string;
  qty: number;
  unitCost: number; // what Shield pays per unit
  unitPrice: number; // what the client is charged per unit
}

export interface ProjectInputs {
  products: ProductLine[];
  variations: number; // approved variations / extras billed to the client
  labourHours: number;
  labourRate: number; // cost per labour hour
  subcontractorCost: number;
  otherDirectCost: number; // freight, consumables, permits
  overheadPct: number; // overhead recovery, % of direct cost
}

export interface SpfmResults {
  productRevenue: number;
  variations: number;
  revenue: number;
  productCost: number;
  labourCost: number;
  subcontractorCost: number;
  otherDirectCost: number;
  directCost: number;
  grossProfit: number;
  grossMarginPct: number | null;
  overhead: number;
  netProfit: number;
  netMarginPct: number | null;
  markupPct: number | null;
}

export interface Project {
  id: string;
  number: string; // e.g. SSD-2026-014
  name: string;
  client: string;
  siteAddress: string;
  status: ProjectStatus;
  inputs: ProjectInputs;
  results: SpfmResults | null;
  calculatedFor: string | null; // fingerprint of the inputs the results were calculated from
  calculatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  quote: "Quote",
  active: "Active",
  complete: "Complete",
};
