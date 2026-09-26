"use client";

import * as React from "react";
import Link from "next/link";

/**
 * Renders the small markdown subset the assistant is told to use — paragraphs,
 * "-"/numbered lists, **bold** and site-relative links — as React elements.
 * No HTML is ever injected; anything else shows as plain text. The server has
 * already restricted links to known site paths (lib/chat-text cleanReply).
 */
export function ChatMarkdown({ text, onNavigate }: { text: string; onNavigate?: () => void }) {
  const blocks: React.ReactNode[] = [];
  // Held in an object (not `let`s) so TS doesn't narrow them across the flush closures.
  const cur = { para: [] as string[], list: null as { ordered: boolean; items: string[] } | null };

  const flushPara = () => {
    if (cur.para.length) {
      const k = blocks.length;
      blocks.push(
        <p key={k}>
          {cur.para.map((line, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {inline(line, onNavigate)}
            </React.Fragment>
          ))}
        </p>,
      );
      cur.para = [];
    }
  };
  const flushList = () => {
    const list = cur.list;
    if (list) {
      const k = blocks.length;
      const items = list.items.map((it, i) => <li key={i}>{inline(it, onNavigate)}</li>);
      blocks.push(
        list.ordered ? (
          <ol key={k} className="list-decimal space-y-1 pl-5">
            {items}
          </ol>
        ) : (
          <ul key={k} className="list-disc space-y-1 pl-5">
            {items}
          </ul>
        ),
      );
      cur.list = null;
    }
  };

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      flushPara();
      const ordered = Boolean(numbered);
      if (cur.list && cur.list.ordered !== ordered) flushList();
      if (!cur.list) cur.list = { ordered, items: [] };
      cur.list.items.push((bullet || numbered)![1]);
    } else if (!line) {
      flushPara();
      flushList();
    } else {
      flushList();
      // Headings aren't part of the chat style; show them as bold lines.
      const heading = line.match(/^#{1,6}\s+(.*)$/);
      cur.para.push(heading ? `**${heading[1]}**` : line);
    }
  }
  flushPara();
  flushList();

  return <div className="space-y-2">{blocks}</div>;
}

const INLINE = /(\*\*[^*\n]+\*\*|\[[^\]\n]+\]\(\/[^)\s]*\))/g;

function inline(s: string, onNavigate?: () => void): React.ReactNode[] {
  return s.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\((\/[^)\s]*)\)$/);
    if (link) {
      return (
        <Link key={i} href={link[2]} onClick={onNavigate} className="text-evergreen underline underline-offset-2">
          {link[1]}
        </Link>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
