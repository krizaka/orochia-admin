"use client";

import React, { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button, Sheet, cx } from "@krizaka/orochia-design-system";
import type { ActionState } from "@/app/actions";

type Tone = "danger" | "primary" | "secondary";

export interface ConfirmDialogProps {
  /** The server action (app/actions.ts) the confirmed form posts to. */
  action: (state: ActionState, form: FormData) => Promise<ActionState>;
  /** Hidden fields sent with the form (ids, the decision). */
  fields?: Record<string, string>;
  trigger: { label: string; tone?: Tone; icon?: React.ReactNode; disabled?: boolean };
  title?: string;
  /** What will happen, in plain words — shown before the operator confirms. */
  description?: React.ReactNode;
  confirmLabel?: string;
  tone?: Tone;
  /** A required text the decision is recorded with (reason, transfer reference). */
  reason?: { label: string; placeholder?: string; minLength?: number; hint?: string };
  /** A phrase the operator must type to arm the action (irreversible operations). */
  phrase?: string;
  /** An option of the action (e.g. back up first), on by default unless said otherwise. */
  option?: { name: string; label: string; hint?: string; defaultChecked?: boolean };
  /** A choice the action needs (e.g. a role). */
  choice?: { name: string; label: string; options: { value: string; label: string }[]; defaultValue?: string };
  /** Run without a dialog (benign, reversible actions): one click, the same pending and error handling. */
  direct?: boolean;
}

const triggerClass: Record<Tone, string> = {
  danger: "border-rose-500/40 text-rose-200 hover:border-rose-400 hover:bg-rose-600 hover:text-white",
  primary: "border-violet-500/50 text-violet-100 hover:bg-violet-600 hover:text-white",
  secondary: "",
};

const field =
  "mt-1.5 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-hidden";

function Submit({ label, tone, disabled }: { label: string; tone: Tone; disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={tone === "danger" ? "danger" : tone === "primary" ? "primary" : "secondary"} loading={pending} disabled={disabled}>
      {label}
    </Button>
  );
}

/**
 * Every operator decision goes through here: a dialog that says what will happen, collects what the decision is
 * recorded with (a reason, a reference, a typed phrase for what cannot be undone), shows the API's refusal in place, and
 * closes on success. Escape, the backdrop and the close button cancel (the kit's Sheet).
 */
export function ConfirmDialog(props: ConfirmDialogProps) {
  const { action, fields = {}, trigger, title = "", description, confirmLabel = "Confirm", tone = "danger", reason, phrase, option, choice, direct } = props;
  const [state, formAction] = useActionState(action, null);
  // The result the dialog opened with: a newer one is this dialog's answer (a success closes it, an error shows in it).
  const [opened, setOpened] = useState<{ base: ActionState } | null>(null);
  const [typed, setTyped] = useState("");
  const answered = opened !== null && state !== opened.base;
  const open = opened !== null && !(answered && state?.ok);
  const show = () => {
    setTyped("");
    setOpened({ base: state });
  };
  const close = () => setOpened(null);

  const hidden = Object.entries(fields).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />);
  const feedback = state && (state.ok ? state.message : direct && state.error) && (
    <span role="status" className={cx("text-[11px]", state.ok ? "text-emerald-300" : "text-rose-300")}>
      {state.ok ? state.message : state.error}
    </span>
  );
  const triggerButton = (type: "button" | "submit") => (
    <button
      type={type}
      disabled={trigger.disabled}
      onClick={type === "button" ? show : undefined}
      className={cx(
        "inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs font-semibold text-zinc-200 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-40",
        triggerClass[trigger.tone ?? "secondary"],
      )}
    >
      {trigger.icon}
      {trigger.label}
    </button>
  );

  if (direct) {
    return (
      <form action={formAction} className="inline-flex items-center gap-2">
        {hidden}
        {triggerButton("submit")}
        {feedback}
      </form>
    );
  }

  const armed = !phrase || typed.trim() === phrase;
  return (
    <span className="inline-flex items-center gap-2">
      {triggerButton("button")}
      {feedback}
      <Sheet
        open={open}
        onClose={close}
        title={title}
        closeLabel="Close"
      >
        <form action={formAction} className="space-y-4">
          {hidden}
          <div className={cx("flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed", tone === "danger" ? "border-rose-500/30 bg-rose-500/10 text-rose-100" : "border-white/10 bg-white/[0.03] text-zinc-300")}>
            {tone === "danger" ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" aria-hidden /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" aria-hidden />}
            <div>{description}</div>
          </div>
          {choice && (
            <label className="block text-xs font-semibold text-zinc-400">
              {choice.label}
              <select name={choice.name} defaultValue={choice.defaultValue} className={field}>
                {choice.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          {reason && (
            <label className="block text-xs font-semibold text-zinc-400">
              {reason.label}
              <textarea name="reason" required minLength={reason.minLength ?? 3} maxLength={500} rows={3} placeholder={reason.placeholder} className={field} />
              {reason.hint && <span className="mt-1 block text-[11px] font-normal text-zinc-500">{reason.hint}</span>}
            </label>
          )}
          {option && (
            <label className="flex items-start gap-3 rounded-2xl border border-white/10 p-4">
              <input type="checkbox" name={option.name} defaultChecked={option.defaultChecked ?? true} className="mt-0.5 h-4 w-4 accent-violet-600" />
              <span>
                <span className="block text-sm font-semibold text-white">{option.label}</span>
                {option.hint && <span className="mt-0.5 block text-[11px] text-zinc-500">{option.hint}</span>}
              </span>
            </label>
          )}
          {phrase && (
            <label className="block text-xs font-semibold text-zinc-400">
              Type <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-rose-200">{phrase}</code> to confirm
              <input name="phrase" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} className={cx(field, "font-mono")} />
            </label>
          )}
          {answered && state && !state.ok && <p role="alert" className="text-xs text-rose-300">{state.error}</p>}
          <div className="flex justify-end gap-2 border-t border-white/10 pt-4">
            <Button type="button" variant="secondary" onClick={close}>
              Go back
            </Button>
            <Submit label={confirmLabel} tone={tone} disabled={!armed} />
          </div>
        </form>
      </Sheet>
    </span>
  );
}
