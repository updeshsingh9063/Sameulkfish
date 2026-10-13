// Project repository.
//
// PREVIEW: stores projects in the browser (localStorage) so the full
// create → calculate → save → reopen loop works without a backend.
// Every function is async and mirrors the planned ASP.NET Core Project API
// (GET /api/projects, GET /api/projects/{id}, POST, PUT), so swapping to
// real fetch() calls with the MSAL access token is a change in this file only.

import { seedProjects } from "./seed";
import type { Project, ProjectInputs, ProjectStatus } from "./types";

const KEY = "spfm.projects.v1";

function readAll(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Project[];
  } catch {
    /* storage unavailable or corrupt: fall back to sample data */
  }
  const seeded = seedProjects();
  writeAll(seeded);
  return seeded;
}

function writeAll(projects: Project[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(projects));
  } catch {
    /* ignore: preview only */
  }
}

export interface ProjectDraft {
  name: string;
  client: string;
  siteAddress: string;
  status: ProjectStatus;
  inputs: ProjectInputs;
  results: Project["results"];
  calculatedFor: string | null;
  calculatedAt: string | null;
}

export async function listProjects(): Promise<Project[]> {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProject(id: string): Promise<Project | null> {
  return readAll().find((p) => p.id === id) ?? null;
}

function nextNumber(all: Project[]): string {
  const year = new Date().getFullYear();
  const prefix = `SSD-${year}-`;
  const max = all
    .filter((p) => p.number.startsWith(prefix))
    .reduce((m, p) => Math.max(m, Number(p.number.slice(prefix.length)) || 0), 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

export async function createProject(draft: ProjectDraft): Promise<Project> {
  const all = readAll();
  const now = new Date().toISOString();
  const project: Project = {
    ...draft,
    id: crypto.randomUUID(),
    number: nextNumber(all),
    createdAt: now,
    updatedAt: now,
  };
  writeAll([...all, project]);
  return project;
}

export async function updateProject(id: string, draft: ProjectDraft): Promise<Project> {
  const all = readAll();
  const i = all.findIndex((p) => p.id === id);
  if (i < 0) throw new Error("This project no longer exists.");
  const updated: Project = { ...all[i], ...draft, updatedAt: new Date().toISOString() };
  all[i] = updated;
  writeAll(all);
  return updated;
}

export async function resetSampleData(): Promise<void> {
  writeAll(seedProjects());
}

export function emptyInputs(): ProjectInputs {
  return {
    products: [{ id: crypto.randomUUID(), description: "", qty: 1, unitCost: 0, unitPrice: 0 }],
    variations: 0,
    labourHours: 0,
    labourRate: 0,
    subcontractorCost: 0,
    otherDirectCost: 0,
    overheadPct: 0,
  };
}
