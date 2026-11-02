/**
 * RSVP submission adapter.
 *
 * The form only talks to `submitRsvp`. In this demo it stores the answer in
 * localStorage after a short, realistic delay. To go live, replace the body of
 * `submitRsvp` with a call to a database or mail service, for example:
 *
 *   await supabase.from("rsvps").insert({ wedding: slug, ...payload });
 *   // or: await fetch("/api/rsvp", { method: "POST", body: JSON.stringify(payload) });
 *
 * Keep the signature the same and the UI keeps working unchanged.
 */

export type RsvpPayload = {
  name: string;
  email: string;
  attending: boolean;
  guests: number;
  diet: string[];
  dietOther: string;
  message: string;
};

export type RsvpRecord = RsvpPayload & { submittedAt: string };

const key = (slug: string) => `june-rsvp:${slug}`;

export const IS_DEMO = true;

export async function submitRsvp(slug: string, payload: RsvpPayload): Promise<RsvpRecord> {
  const record: RsvpRecord = { ...payload, submittedAt: new Date().toISOString() };
  await new Promise((resolve) => setTimeout(resolve, 900));
  try {
    window.localStorage.setItem(key(slug), JSON.stringify(record));
  } catch {
    // Private mode or blocked storage: the demo confirmation still shows.
  }
  return record;
}

export function loadRsvp(slug: string): RsvpRecord | null {
  try {
    const raw = window.localStorage.getItem(key(slug));
    return raw ? (JSON.parse(raw) as RsvpRecord) : null;
  } catch {
    return null;
  }
}

export function clearRsvp(slug: string) {
  try {
    window.localStorage.removeItem(key(slug));
  } catch {
    /* ignore */
  }
}
