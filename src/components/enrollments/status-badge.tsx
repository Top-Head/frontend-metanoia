import clsx from "clsx";
import type { EnrollmentStatus, PaymentStatus } from "@/lib/api/types";
import { ENROLLMENT_STATUS, PAYMENT_STATUS } from "@/lib/enrollment";

export function StatusBadge(
  props: { kind: "enrollment"; status: EnrollmentStatus } | { kind: "payment"; status: PaymentStatus }
) {
  const { label, tone } =
    props.kind === "enrollment" ? ENROLLMENT_STATUS[props.status] : PAYMENT_STATUS[props.status];

  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold", tone)}>
      {label}
    </span>
  );
}
