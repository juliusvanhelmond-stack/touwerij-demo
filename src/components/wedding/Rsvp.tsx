import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE, Reveal, downloadIcs } from "./primitives";
import { IS_DEMO, clearRsvp, loadRsvp, submitRsvp, type RsvpPayload, type RsvpRecord } from "./rsvp-service";
import type { WeddingConfig } from "./types";

type Errors = Partial<Record<"name" | "email" | "attending", string>>;

const emptyForm = {
  name: "",
  email: "",
  attending: null as boolean | null,
  guests: 1,
  diet: [] as string[],
  dietOther: "",
  message: "",
};

function validate(f: typeof emptyForm): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Vul je naam in, zodat we weten wie er komt.";
  if (!f.email.trim()) e.email = "Vul je e-mailadres in.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Dit e-mailadres lijkt niet te kloppen.";
  if (f.attending === null) e.attending = "Laat ons weten of je erbij bent.";
  return e;
}

/** The reply card: an ivory card on deep cocoa, like the RSVP slipped into a printed invitation. */
export function Rsvp({ config }: { config: WeddingConfig }) {
  const { rsvp } = config;
  // Client-only app, so storage can be read during the first render (no flash of the empty form).
  const [record, setRecord] = useState<RsvpRecord | null>(() => loadRsvp(config.slug));
  const [justSent, setJustSent] = useState(false);
  const [editing, setEditing] = useState(false);
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const swap = { initial: reduced ? false : { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } } as const;

  return (
    <section id="rsvp" aria-labelledby="rsvp-title" className="relative bg-wed-cocoa px-4 py-20 text-wed-ink outline-none md:px-10 md:py-32">
      <div className="mx-auto max-w-[680px]">
        <Reveal y={40}>
          <div ref={cardRef} className="wed-paper relative bg-wed-ivory px-6 py-12 sm:px-10 md:px-16 md:py-16">
            <span aria-hidden className="pointer-events-none absolute inset-2 border border-wed-sand/70 md:inset-3" />
            <AnimatePresence mode="wait" initial={false}>
              {record ? (
                <motion.div key="thanks" {...swap} transition={{ duration: 0.7, ease: EASE }}>
                  <Thanks
                    config={config}
                    record={record}
                    focusOnMount={justSent}
                    onEdit={() => {
                      clearRsvp(config.slug);
                      setJustSent(false);
                      setEditing(true);
                      setRecord(null);
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div key="form" {...swap} transition={{ duration: 0.7, ease: EASE }}>
                  <header className="text-center">
                    <p className="font-wsans text-[0.64rem] uppercase tracking-[0.36em] text-wed-cocoa/80">
                      RSVP · {rsvp.deadline}
                    </p>
                    <h2 id="rsvp-title" className="mx-auto mt-6 max-w-[14ch] font-wserif [text-wrap:balance] text-[2.35rem] italic leading-[1.05] md:text-[3.1rem]">
                      {rsvp.title}
                    </h2>
                    <p className="mx-auto mt-5 max-w-[42ch] text-[1rem] leading-relaxed text-wed-ink/75">{rsvp.text}</p>
                  </header>
                  <RsvpForm config={config} focusOnMount={editing} onDone={(r) => {
                    setJustSent(true);
                    setRecord(r);
                    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
                    if (top < 0) cardRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
                  }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function RsvpForm({
  config,
  focusOnMount,
  onDone,
}: {
  config: WeddingConfig;
  focusOnMount: boolean;
  onDone: (r: RsvpRecord) => void;
}) {
  const { rsvp } = config;
  const reduced = useReducedMotion();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();

  useEffect(() => {
    if (focusOnMount) formRef.current?.querySelector<HTMLInputElement>('[data-field="name"]')?.focus({ preventScroll: true });
  }, [focusOnMount]);

  const set = <K extends keyof typeof emptyForm>(k: K, v: (typeof emptyForm)[K]) => {
    const next = { ...form, [k]: v };
    setForm(next);
    if (tried) setErrors(validate(next));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    const errs = validate(form);
    setErrors(errs);
    const first = (["name", "email", "attending"] as const).find((k) => errs[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setSending(true);
    setFailed(false);
    const payload: RsvpPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      attending: form.attending === true,
      guests: form.attending ? form.guests : 0,
      diet: form.attending ? form.diet : [],
      dietOther: form.attending ? form.dietOther.trim() : "",
      message: form.message.trim(),
    };
    try {
      onDone(await submitRsvp(config.slug, payload));
    } catch {
      setFailed(true);
      setSending(false);
    }
  };

  const errId = (k: keyof Errors) => `${uid}-${k}-error`;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="mt-12 space-y-9" aria-describedby={`${uid}-demo`}>
      <Field label="Naam" htmlFor={`${uid}-name`} error={errors.name} errorId={errId("name")}>
        <input
          id={`${uid}-name`}
          data-field="name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? errId("name") : undefined}
          required
          className={inputCls(!!errors.name)}
          placeholder="Voor- en achternaam"
        />
      </Field>

      <Field label="E-mailadres" htmlFor={`${uid}-email`} error={errors.email} errorId={errId("email")}>
        <input
          id={`${uid}-email`}
          data-field="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? errId("email") : undefined}
          required
          className={inputCls(!!errors.email)}
          placeholder="naam@voorbeeld.nl"
        />
      </Field>

      <fieldset aria-describedby={errors.attending ? errId("attending") : undefined}>
        <legend className={labelCls}>Ben je erbij?</legend>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { v: true, l: "Ja, ik ben erbij", s: "Met liefde" },
            { v: false, l: "Helaas, ik kan niet", s: "Ik proost van een afstand" },
          ].map((o, i) => {
            const checked = form.attending === o.v;
            return (
              <label
                key={String(o.v)}
                className={cn(
                  "relative flex cursor-pointer flex-col border px-5 py-4 transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-wed-ink",
                  checked ? "border-wed-ink bg-wed-ink text-wed-ivory" : "border-wed-ink/25 hover:border-wed-ink/60",
                  errors.attending && !checked && "border-[#9b4a3c]/70",
                )}
              >
                <input
                  type="radio"
                  name={`${uid}-attending`}
                  data-field={i === 0 ? "attending" : undefined}
                  className="sr-only"
                  checked={checked}
                  onChange={() => set("attending", o.v)}
                  aria-invalid={!!errors.attending}
                />
                <span className="font-wserif text-[1.2rem] leading-tight">{o.l}</span>
                <span className={cn("mt-1 font-wserif text-[0.95rem] italic", checked ? "text-wed-ivory/75" : "text-wed-ink/55")}>{o.s}</span>
              </label>
            );
          })}
        </div>
        <ErrorText id={errId("attending")} msg={errors.attending} />
      </fieldset>

      <AnimatePresence initial={false}>
        {form.attending && (
          <motion.div
            key="attending-extra"
            initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="-mx-2 overflow-hidden px-2"
          >
            <div className="space-y-9 pt-1">
              <div>
                <span id={`${uid}-guests-label`} className={labelCls}>
                  Aantal gasten, inclusief jezelf
                </span>
                <div className="mt-3 flex items-center gap-1" role="group" aria-labelledby={`${uid}-guests-label`}>
                  <StepButton label="Een gast minder" disabled={form.guests <= 1} onClick={() => set("guests", Math.max(1, form.guests - 1))}>
                    −
                  </StepButton>
                  <output aria-live="polite" className="wed-figures w-16 text-center font-wserif text-[2rem] leading-none">
                    {form.guests}
                  </output>
                  <StepButton
                    label="Een gast meer"
                    disabled={form.guests >= rsvp.maxGuests}
                    onClick={() => set("guests", Math.min(rsvp.maxGuests, form.guests + 1))}
                  >
                    +
                  </StepButton>
                  <span className="ml-4 text-[0.88rem] text-wed-ink/55">max. {rsvp.maxGuests}</span>
                </div>
              </div>

              <fieldset>
                <legend className={labelCls}>Dieetwensen of allergieën</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {rsvp.dietOptions.map((d) => {
                    const on = form.diet.includes(d);
                    return (
                      <label
                        key={d}
                        className={cn(
                          "cursor-pointer border px-4 py-2 text-[0.92rem] transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-wed-ink",
                          on ? "border-wed-olive bg-wed-olive text-wed-ivory" : "border-wed-ink/20 text-wed-ink/80 hover:border-wed-ink/50",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={on}
                          onChange={() => set("diet", on ? form.diet.filter((x) => x !== d) : [...form.diet, d])}
                        />
                        {d}
                      </label>
                    );
                  })}
                </div>
                <label htmlFor={`${uid}-diet-other`} className="sr-only">
                  Andere dieetwens
                </label>
                <input
                  id={`${uid}-diet-other`}
                  type="text"
                  value={form.dietOther}
                  onChange={(e) => set("dietOther", e.target.value)}
                  className={cn(inputCls(false), "mt-4")}
                  placeholder="Iets anders? Laat het ons weten"
                />
              </fieldset>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Field label="Persoonlijk bericht" hint="optioneel" htmlFor={`${uid}-message`}>
        <textarea
          id={`${uid}-message`}
          rows={3}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          className={cn(inputCls(false), "resize-none leading-relaxed")}
          placeholder="Een lief woord, een verzoeknummer…"
        />
      </Field>

      <div className="pt-2 text-center">
        <button
          type="submit"
          disabled={sending}
          className="group relative inline-flex min-w-[220px] items-center justify-center overflow-hidden bg-wed-ink px-10 py-4 font-wsans text-[0.72rem] uppercase tracking-[0.3em] text-wed-ivory transition-colors duration-500 hover:bg-wed-cocoa disabled:cursor-wait disabled:opacity-80"
        >
          {sending ? (
            <span className="flex items-center gap-3">
              <span aria-hidden className="h-3 w-3 animate-spin rounded-full border border-wed-ivory/40 border-t-wed-ivory" />
              Versturen
            </span>
          ) : (
            "Verstuur antwoord"
          )}
        </button>
        <p aria-live="polite" className="sr-only">
          {sending ? "Je antwoord wordt verstuurd." : ""}
        </p>
        {failed && (
          <p role="alert" className="mt-4 text-[0.92rem] text-[#9b4a3c]">
            Er ging iets mis bij het versturen. Probeer het nog eens.
          </p>
        )}
        {IS_DEMO && (
          <p id={`${uid}-demo`} className="mx-auto mt-6 max-w-[38ch] text-[0.8rem] leading-relaxed text-wed-ink/50">
            {rsvp.demoNote}
          </p>
        )}
      </div>
    </form>
  );
}

function Thanks({
  config,
  record,
  focusOnMount,
  onEdit,
}: {
  config: WeddingConfig;
  record: RsvpRecord;
  focusOnMount: boolean;
  onEdit: () => void;
}) {
  const { rsvp, venue } = config;
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    // Announce the confirmation to keyboard and screen reader users right after sending.
    if (focusOnMount) titleRef.current?.focus({ preventScroll: true });
  }, [focusOnMount]);
  const yes = record.attending;
  const diet = [...record.diet, record.dietOther].filter(Boolean).join(", ");
  return (
    <div className="py-4 text-center">
      <p aria-hidden className="font-wserif text-[1.6rem] italic text-wed-cocoa">
        {config.couple.monogram}
      </p>
      <h2
        id="rsvp-title"
        ref={titleRef}
        tabIndex={-1}
        className="mx-auto mt-6 max-w-[16ch] font-wserif [text-wrap:balance] text-[2.2rem] italic leading-[1.08] outline-none md:text-[2.8rem]"
      >
        {yes ? rsvp.thanksYes : rsvp.thanksNo}
      </h2>
      <p className="mx-auto mt-5 max-w-[38ch] text-[1rem] leading-relaxed text-wed-ink/75">{yes ? rsvp.thanksYesSub : rsvp.thanksNoSub}</p>

      <dl className="mx-auto mt-10 grid max-w-[420px] grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-y border-wed-ink/15 py-6 text-left text-[0.95rem]">
        <dt className="font-wsans text-[0.62rem] uppercase leading-6 tracking-[0.26em] text-wed-cocoa/75">Naam</dt>
        <dd>{record.name}</dd>
        <dt className="font-wsans text-[0.62rem] uppercase leading-6 tracking-[0.26em] text-wed-cocoa/75">Antwoord</dt>
        <dd>{yes ? `Erbij, met ${record.guests} ${record.guests === 1 ? "persoon" : "personen"}` : "Kan helaas niet"}</dd>
        {yes && diet && (
          <>
            <dt className="font-wsans text-[0.62rem] uppercase leading-6 tracking-[0.26em] text-wed-cocoa/75">Dieet</dt>
            <dd>{diet}</dd>
          </>
        )}
      </dl>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
        {yes && (
          <button
            type="button"
            onClick={() =>
              downloadIcs({
                title: `Bruiloft ${config.couple.first} & ${config.couple.second}`,
                start: config.arrival,
                end: config.partyEnd,
                location: `${venue.name}, ${venue.address.street}, ${venue.address.postcode} ${venue.address.city}`,
                description: config.programme.moments.map((m) => `${m.time} ${m.title}`).join("\n"),
                slug: config.slug,
              })
            }
            className="bg-wed-ink px-8 py-4 font-wsans text-[0.7rem] uppercase tracking-[0.28em] text-wed-ivory transition-colors duration-500 hover:bg-wed-cocoa"
          >
            Zet in je agenda
          </button>
        )}
        <button
          type="button"
          onClick={onEdit}
          className="border-b border-wed-ink/30 pb-1 font-wsans text-[0.7rem] uppercase tracking-[0.28em] text-wed-ink/75 transition-colors hover:border-wed-ink hover:text-wed-ink"
        >
          Antwoord wijzigen
        </button>
      </div>
      {IS_DEMO && <p className="mx-auto mt-8 max-w-[38ch] text-[0.8rem] leading-relaxed text-wed-ink/50">{rsvp.demoNote}</p>}
    </div>
  );
}

const labelCls = "block font-wsans text-[0.64rem] uppercase tracking-[0.3em] text-wed-cocoa/85";

const inputCls = (invalid: boolean) =>
  cn(
    "mt-2 block w-full border-0 border-b bg-transparent px-0 py-2.5 font-wserif text-[1.2rem] text-wed-ink placeholder:font-wserif placeholder:italic placeholder:text-wed-ink/35 transition-colors duration-300 focus:outline-none focus:ring-0 focus-visible:outline-none",
    invalid ? "border-[#9b4a3c]" : "border-wed-ink/25 hover:border-wed-ink/50 focus:border-wed-ink",
  );

function Field({
  label,
  hint,
  htmlFor,
  error,
  errorId,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  error?: string;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
        {hint && <span className="ml-2 normal-case tracking-normal text-wed-ink/45">({hint})</span>}
      </label>
      {children}
      {errorId && <ErrorText id={errorId} msg={error} />}
    </div>
  );
}

function ErrorText({ id, msg }: { id: string; msg?: string }) {
  return (
    <p id={id} role={msg ? "alert" : undefined} className={cn("text-[0.88rem] text-[#9b4a3c]", msg ? "mt-2" : "sr-only")}>
      {msg ?? ""}
    </p>
  );
}

function StepButton({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center border border-wed-ink/25 font-wserif text-[1.3rem] leading-none text-wed-ink transition-colors hover:border-wed-ink disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}
