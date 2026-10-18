import type { ChatMessage } from "@/lib/api/types";

// A API não tem campo de resposta: a citação vai no início do conteúdo.
// Formato: "[reply:<id>]\n> <autor>: <trecho>\n<texto>"
const REPLY_PATTERN = /^\[reply:(\d+)\]\n> (.*?): (.*)\n([\s\S]*)$/;
const EXCERPT_LENGTH = 90;

export interface ReplyReference {
  id: number;
  authorName: string;
  excerpt: string;
}

export interface ParsedMessage {
  reply: ReplyReference | null;
  body: string;
}

export function parseMessageContent(content: string): ParsedMessage {
  const match = REPLY_PATTERN.exec(content);
  if (!match) return { reply: null, body: content };
  const [, id, authorName, excerpt, body] = match;
  return { reply: { id: Number(id), authorName, excerpt }, body };
}

export function replyReferenceFor(message: ChatMessage): ReplyReference {
  const text = parseMessageContent(message.content).body.replace(/\s+/g, " ").trim();
  return {
    id: message.id,
    authorName: message.author_name,
    excerpt: text.length > EXCERPT_LENGTH ? `${text.slice(0, EXCERPT_LENGTH)}…` : text,
  };
}

export function withReply(body: string, reply: ReplyReference | null) {
  if (!reply) return body;
  return `[reply:${reply.id}]\n> ${reply.authorName}: ${reply.excerpt}\n${body}`;
}
