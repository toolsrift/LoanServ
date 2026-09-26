import "server-only";
import { channelLabel, type Attribution } from "./attribution";
import { esc } from "./email";

/**
 * "Lead source" block for lead emails: the channel in one line, then the raw
 * details so campaigns and partners can be tallied from the inbox.
 */
export function leadSourceHtml(a: Attribution | undefined): string {
  const campaign = a && [a.source, a.medium, a.campaign, a.term, a.content].filter(Boolean).join(" / ");
  const rows: [string, string | undefined][] = [
    ["Channel", channelLabel(a)],
    ["Campaign", campaign || undefined],
    ["Partner code", a?.ref],
    ["Ad click", a?.googleAds ? "Google Ads" : a?.metaAds ? "Meta Ads" : undefined],
    ["Referring site", a?.referrer],
    ["Landing page", a?.landingPage],
    ["Form page", a?.page],
    ["First seen", a?.at],
  ];
  const body = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`)
    .join("");
  return `<h3>Lead source</h3><table cellpadding="6" style="border-collapse:collapse">${body}</table>`;
}

/** Short channel tag for the email subject, e.g. " [Google Ads]". */
export function leadSourceTag(a: Attribution | undefined): string {
  return ` [${channelLabel(a)}]`;
}
