import { cookies } from "next/headers";
import type { SessionUser } from "./types";
import { repo } from "./repo";

const COOKIE = "vaad_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Resolve the logged-in resident into a full session context
// (resident → building → company). Cookie stores only the residentId.
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const id = store.get(COOKIE)?.value;
  if (!id) return null;

  const resident = await repo.getResidentById(id);
  if (!resident) return null;

  const building = await repo.getBuilding(resident.buildingId);
  if (!building) return null;

  return {
    residentId: resident.id,
    name: resident.name,
    phone: resident.phone,
    role: resident.role,
    buildingId: building.id,
    companyId: building.companyId,
    unitId: resident.unitId || undefined,
  };
}

export async function setSession(residentId: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, residentId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

// Login by phone number → maps to a resident (building + company) in the backend.
export async function loginByPhone(phone: string): Promise<SessionUser | null> {
  const resident = await repo.getResidentByPhone(phone);
  if (!resident) return null;
  await setSession(resident.id);
  return getSession();
}
