"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Controller, useForm, useWatch, type FieldErrors, type FieldPath } from "react-hook-form";
import { site } from "@/config/site";
import type { MethodId, Option } from "@/config/types";
import { ContactButtons, KakaoLink } from "@/components/common/contact-buttons";
import { useInquiry } from "@/components/providers/inquiry-provider";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { display } from "@/lib/content";
import { setOverlayOpen } from "@/lib/overlay";
import {
  countMessageChars,
  formatPhone,
  inquirySchema,
  MESSAGE_MAX,
  type ErrorCode,
  type Inquiry,
  type InquiryInput,
} from "@/lib/schema";
import { cn } from "@/lib/utils";

type Status =
  | { kind: "idle" }
  | { kind: "submitting"; slow: boolean }
  | { kind: "success"; method: MethodId }
  | { kind: "error"; offline: boolean };

const SLOW_AFTER_MS = 10_000;
const TIMEOUT_MS = 20_000;
const FIELD_ORDER = ["name", "phone", "topic", "message", "method", "time", "consent"] as const;

const f = site.form;

function errorText(code: string | undefined): string | undefined {
  if (!code) return undefined;
  return f.validation[code as ErrorCode] ?? f.validation.name;
}

/** FR-13·FR-15. 상담 신청서와 제출 결과 안내 */
export function InquiryForm() {
  const { selection } = useInquiry();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [consentOpen, setConsentOpen] = useState(false);
  const startedAt = useRef<number>(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const errorBox = useRef<HTMLDivElement>(null);
  const uid = useId();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<InquiryInput, unknown, Inquiry>({
    resolver: zodResolver(inquirySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: false, // 첫 오류 칸은 FIELD_ORDER 순서로 직접 이동
    defaultValues: { name: "", phone: "", message: "", time: "any" },
  });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // FR-11에서 고른 주제를 미리 선택 (이후 자유롭게 변경 가능)
  useEffect(() => {
    if (selection) setValue("topic", selection.topic, { shouldValidate: true, shouldDirty: true });
  }, [selection, setValue]);

  useEffect(() => {
    if (!consentOpen) return;
    setOverlayOpen(true);
    return () => setOverlayOpen(false);
  }, [consentOpen]);

  useEffect(() => {
    if (status.kind === "success") successHeading.current?.focus();
    if (status.kind === "error") errorBox.current?.focus();
  }, [status.kind]);

  const message = useWatch({ control, name: "message" }) ?? "";
  const newlineCount = (message.match(/\n/g) ?? []).length;

  const onSubmit = async (data: Inquiry) => {
    if (status.kind === "submitting") return; // 중복 제출 방지
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setStatus({ kind: "error", offline: true });
      return;
    }
    setStatus({ kind: "submitting", slow: false });
    const slowTimer = window.setTimeout(() => setStatus({ kind: "submitting", slow: true }), SLOW_AFTER_MS);
    const controller = new AbortController();
    const abortTimer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: honeypot.current?.value ?? "",
          elapsedMs: Date.now() - startedAt.current,
        }),
        signal: controller.signal,
      });
      const json: unknown = await res.json().catch(() => null);

      if (res.ok && isOk(json)) {
        reset(); // 입력값은 바로 메모리에서 지움
        setStatus({ kind: "success", method: data.method });
        return;
      }
      if (res.status === 400 && hasFieldErrors(json)) {
        setStatus({ kind: "idle" });
        const fields = FIELD_ORDER.filter((name) => json.errors[name]);
        fields.forEach((name) => setError(name, { type: "server", message: json.errors[name] }));
        if (fields[0]) setFocus(fields[0]);
        return;
      }
      setStatus({ kind: "error", offline: false });
    } catch {
      setStatus({ kind: "error", offline: typeof navigator !== "undefined" && !navigator.onLine });
    } finally {
      window.clearTimeout(slowTimer);
      window.clearTimeout(abortTimer);
    }
  };

  const onInvalid = (errs: FieldErrors<InquiryInput>) => {
    const first = FIELD_ORDER.find((name) => errs[name]);
    if (!first) return;
    document.querySelector(`[data-field="${first}"]`)?.scrollIntoView({ block: "center" });
    setFocus(first);
  };

  const submit = (e?: React.BaseSyntheticEvent) => handleSubmit(onSubmit, onInvalid)(e);
  const submitting = status.kind === "submitting";

  return (
    <section id="apply" aria-labelledby="apply-title" className="section bg-sky">
      <div className="container-page lg:max-w-[760px]">
        <div className="overflow-hidden rounded-[28px] bg-white shadow-soft">
          {/* 상단 포인트 띠: 구역 제목 + 짧은 안내 */}
          <div className="bg-accent px-6 py-5 text-center text-white">
            <h2 id="apply-title" className="h2">
              {f.title}
            </h2>
            <p className="mt-1 text-[16px] font-semibold text-white/95">{f.titleSub}</p>
          </div>

          {status.kind === "success" ? (
            <SuccessView method={status.method} headingRef={successHeading} />
          ) : (
            <div className="p-6 sm:p-8">
              <p className="mt-2 text-[15px] text-ink-muted">{f.description}</p>

              {status.kind === "error" && (
                <div
                  ref={errorBox}
                  tabIndex={-1}
                  role="alert"
                  className="mt-6 rounded-2xl border-2 border-error bg-[#fef2f2] p-5"
                >
                  <p className="flex items-center gap-2 text-[17px] font-bold text-error">
                    <CircleAlert aria-hidden className="size-5 shrink-0" />
                    {f.errorTitle}
                  </p>
                  <p className="mt-1 text-[16px]">{status.offline ? f.offlineBody : f.errorBody}</p>
                  <button type="button" onClick={submit} className="btn btn-accent mt-4 w-full">
                    {f.retry}
                  </button>
                  <ContactButtons className="mt-3" buttonClassName="px-3" />
                </div>
              )}

              <form
                noValidate
                onSubmit={submit}
                onKeyDown={(e) => {
                  // 한글 조합 중 Enter로 제출되지 않게
                  if (e.key === "Enter" && e.nativeEvent.isComposing) e.preventDefault();
                }}
                className="mt-6 flex flex-col gap-7"
              >
                {/* 1. 이름 */}
                <FieldBlock
                  name="name"
                  label={f.labels.name}
                  required
                  error={errorText(errors.name?.message)}
                  uid={uid}
                >
                  {(a11y) => (
                    <input
                      {...register("name")}
                      {...a11y}
                      type="text"
                      autoComplete="name"
                      placeholder={f.placeholders.name}
                      className={inputClass(!!errors.name)}
                    />
                  )}
                </FieldBlock>

                {/* 2. 연락처 (자동 하이픈) */}
                <FieldBlock
                  name="phone"
                  label={f.labels.phone}
                  required
                  error={errorText(errors.phone?.message)}
                  uid={uid}
                >
                  {(a11y) => (
                    <Controller
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <input
                          {...field}
                          {...a11y}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(formatPhone(e.target.value))}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder={f.placeholders.phone}
                          className={inputClass(!!errors.phone)}
                        />
                      )}
                    />
                  )}
                </FieldBlock>

                {/* 3. 궁금한 점: 주제 + 메모 */}
                <Controller
                  control={control}
                  name="topic"
                  render={({ field }) => (
                    <ChoiceGroup
                      name="topic"
                      legend={f.labels.topic}
                      required
                      options={f.topics}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      error={errorText(errors.topic?.message)}
                      uid={uid}
                      columns={2}
                    />
                  )}
                />

                <FieldBlock
                  name="message"
                  label={f.labels.message}
                  error={errorText(errors.message?.message)}
                  uid={uid}
                  hint={f.sensitiveNotice}
                  counter={`${countMessageChars(message)} / ${MESSAGE_MAX}${f.messageCounter}`}
                >
                  {(a11y) => (
                    <textarea
                      {...register("message")}
                      {...a11y}
                      rows={4}
                      maxLength={MESSAGE_MAX + newlineCount}
                      placeholder={f.placeholders.message}
                      className={cn(inputClass(!!errors.message), "h-auto min-h-32 py-3 leading-relaxed")}
                    />
                  )}
                </FieldBlock>

                {/* 4. 원하는 상담 방식 */}
                <Controller
                  control={control}
                  name="method"
                  render={({ field }) => (
                    <ChoiceGroup
                      name="method"
                      legend={f.labels.method}
                      required
                      options={f.methods}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      error={errorText(errors.method?.message)}
                      uid={uid}
                      columns={3}
                    />
                  )}
                />

                {/* 5. 편한 연락 시간대 */}
                <Controller
                  control={control}
                  name="time"
                  render={({ field }) => (
                    <ChoiceGroup
                      name="time"
                      legend={f.labels.time}
                      options={f.times}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      uid={uid}
                      columns={4}
                    />
                  )}
                />

                {/* 개인정보 수집·이용 동의 */}
                <div data-field="consent">
                  <div className="flex items-start gap-3">
                    <input
                      {...register("consent")}
                      id={`${uid}-consent`}
                      type="checkbox"
                      aria-invalid={!!errors.consent}
                      aria-describedby={errors.consent ? `${uid}-consent-error` : undefined}
                      className="mt-0.5 size-6 shrink-0 cursor-pointer accent-navy"
                    />
                    <label htmlFor={`${uid}-consent`} className="cursor-pointer text-[17px] leading-snug font-semibold">
                      {f.consentLabel}
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConsentOpen(true)}
                    className="mt-1 ml-9 inline-flex min-h-12 items-center text-[16px] font-semibold text-navy underline underline-offset-4"
                  >
                    {f.consentDetail}
                  </button>
                  <ErrorText id={`${uid}-consent-error`} text={errorText(errors.consent?.message)} />
                </div>

                {/* 스팸 방어용 숨은 칸 (사람에게는 보이지 않음) */}
                <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    aria-disabled={submitting}
                    className="btn btn-accent h-[60px] w-full text-[18px]"
                  >
                    {submitting && <LoaderCircle aria-hidden className="animate-spin" />}
                    {submitting ? f.submitting : f.submit}
                  </button>
                  <p role="status" className="mt-2 min-h-6 text-center text-[15px] text-ink-muted">
                    {status.kind === "submitting" && status.slow ? f.slowNotice : ""}
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <Dialog open={consentOpen} onOpenChange={setConsentOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100%-2rem)] gap-0 rounded-[28px] bg-white p-6 text-navy sm:max-w-md"
        >
          <DialogTitle className="text-[20px] font-bold">{f.consentDialog.title}</DialogTitle>
          <dl className="mt-4 flex flex-col gap-3 text-[16px]">
            {f.consentDialog.items.map((item) => (
              <div key={item.term}>
                <dt className="font-bold">{item.term}</dt>
                <dd className="text-navy/85">{display(item.desc)}</dd>
              </div>
            ))}
          </dl>
          <a
            href="/privacy"
            className="mt-4 inline-flex min-h-12 items-center font-semibold underline underline-offset-4"
          >
            {f.consentDialog.privacyLink}
          </a>
          <button type="button" onClick={() => setConsentOpen(false)} className="btn btn-navy mt-2 w-full">
            {f.consentDialog.close}
          </button>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function SuccessView({
  method,
  headingRef,
}: {
  method: MethodId;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <div role="status" className="flex flex-col items-center p-8 text-center">
      <CircleCheck aria-hidden className="size-16 text-navy" strokeWidth={1.75} />
      <h3 ref={headingRef} tabIndex={-1} className="h2 mt-4">
        {f.successTitle}
      </h3>
      <p className="mt-2 text-[17px]">{f.successBody}</p>
      {method === "kakao" && <p className="mt-4 text-[16px] text-ink-muted">{f.successKakaoHint}</p>}
      <div className="mt-6 grid w-full gap-3 sm:max-w-sm">
        <KakaoLink className="btn-lg" label={f.successKakaoCta} />
        <a href="#top" className="btn btn-outline btn-lg">
          {f.toHome}
        </a>
      </div>
    </div>
  );
}

type A11yProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
};

function FieldBlock({
  name,
  label,
  required = false,
  error,
  hint,
  counter,
  uid,
  children,
}: {
  name: FieldPath<InquiryInput>;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  counter?: string;
  uid: string;
  children: (a11y: A11yProps) => React.ReactNode;
}) {
  const id = `${uid}-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div data-field={name}>
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-[17px] font-bold">
        {label}
        <RequiredMark required={required} />
      </label>
      {children({
        id,
        "aria-invalid": !!error,
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
      })}
      <div className="mt-1.5 flex items-start justify-between gap-3">
        {hint ? (
          <p id={`${id}-hint`} className="text-[14px] text-ink-muted">
            {hint}
          </p>
        ) : (
          <span />
        )}
        {counter && (
          <span aria-hidden className="shrink-0 text-[14px] text-ink-muted tabular-nums">
            {counter}
          </span>
        )}
      </div>
      <ErrorText id={`${id}-error`} text={error} />
    </div>
  );
}

function ChoiceGroup<T extends string>({
  name,
  legend,
  required = false,
  options,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
  uid,
  columns,
}: {
  name: FieldPath<InquiryInput>;
  legend: string;
  required?: boolean;
  options: Option<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
  onBlur: () => void;
  inputRef: (el: HTMLInputElement | null) => void;
  error?: string;
  uid: string;
  columns: 2 | 3 | 4;
}) {
  const errorId = `${uid}-${name}-error`;
  return (
    <fieldset data-field={name} aria-describedby={error ? errorId : undefined}>
      <legend className="mb-2 flex items-center gap-2 text-[17px] font-bold">
        {legend}
        <RequiredMark required={required} />
      </legend>
      <div
        className={cn(
          "grid gap-2",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-3",
          columns === 4 && "grid-cols-2 sm:grid-cols-4",
        )}
      >
        {options.map((option, i) => {
          const checked = value === option.id;
          return (
            <label
              key={option.id}
              className={cn(
                "relative flex min-h-14 cursor-pointer items-center justify-center gap-1.5 rounded-2xl border-2 px-2 text-center text-[16px] font-semibold transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy",
                checked ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-navy/40",
                error && !checked && "border-error/60",
              )}
            >
              <input
                ref={i === 0 ? inputRef : undefined}
                type="radio"
                name={name}
                value={option.id}
                checked={checked}
                onChange={() => onChange(option.id)}
                onBlur={onBlur}
                required={required}
                className="sr-only"
              />
              {checked && <Check aria-hidden className="size-[18px] shrink-0" />}
              {option.label}
            </label>
          );
        })}
      </div>
      <ErrorText id={errorId} text={error} />
    </fieldset>
  );
}

function RequiredMark({ required }: { required: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[13px] leading-tight font-bold",
        required ? "bg-accent/10 text-accent-hover" : "bg-navy/5 text-ink-muted",
      )}
    >
      {required ? f.requiredMark : f.optionalMark}
    </span>
  );
}

function ErrorText({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[15px] font-semibold text-error">
      <CircleAlert aria-hidden className="mt-0.5 size-[18px] shrink-0" />
      {text}
    </p>
  );
}

function inputClass(invalid: boolean): string {
  return cn(
    "block h-14 w-full rounded-2xl border-2 bg-white px-4 text-[17px] text-navy placeholder:text-ink-muted/70 focus:border-navy",
    invalid ? "border-error" : "border-line",
  );
}

function isOk(json: unknown): boolean {
  return typeof json === "object" && json !== null && (json as { ok?: unknown }).ok === true;
}

function hasFieldErrors(json: unknown): json is { errors: Partial<Record<(typeof FIELD_ORDER)[number], string>> } {
  return typeof json === "object" && json !== null && typeof (json as { errors?: unknown }).errors === "object";
}
