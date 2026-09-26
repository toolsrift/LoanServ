import Link from "next/link";

/**
 * The contact-consent wording shown next to every lead form's consent checkbox.
 * Its version is CONTACT_CONSENT_VERSION in lib/apply-schema — bump that
 * whenever this text changes, since the consent record cites it.
 */
export function ContactConsentText() {
  return (
    <span className="text-sm text-slate">
      I agree to be contacted by LoanServ regarding my loan requirement — by phone, WhatsApp
      or email, including an automated AI voice callback — and accept the{" "}
      <Link href="/legal/privacy-policy" className="text-evergreen underline" target="_blank">
        Privacy Policy
      </Link>
      . I understand LoanServ is a DSA facilitator, not a lender.
    </span>
  );
}
