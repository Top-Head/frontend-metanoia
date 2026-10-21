"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Smile } from "lucide-react";

const CATEGORIES: Array<{ id: string; label: string; icon: string; emojis: string }> = [
  {
    id: "smileys",
    label: "Smileys",
    icon: "😀",
    emojis:
      "😀 😃 😄 😁 😆 😅 🤣 😂 🙂 🙃 😉 😊 😇 🥰 😍 🤩 😘 😗 😚 😙 😋 😛 😜 🤪 😝 🤑 🤗 🤭 🤫 🤔 🤐 🤨 😐 😑 😶 😏 😒 🙄 😬 😮‍💨 🤥 😌 😔 😪 🤤 😴 😷 🤒 🤕 🤢 🤮 🥵 🥶 🥴 😵 🤯 🤠 🥳 😎 🤓 🧐 😕 😟 🙁 😮 😯 😲 😳 🥺 😦 😧 😨 😰 😥 😢 😭 😱 😖 😣 😞 😓 😩 😫 🥱 😤 😡 😠 🤬 😈 💀 💩 🤡 👻 👽 🤖",
  },
  {
    id: "gestures",
    label: "Gestos",
    icon: "👍",
    emojis:
      "👍 👎 👌 🤌 🤏 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 👇 ☝️ ✋ 🤚 🖐️ 🖖 👋 🤝 🙏 👏 🙌 👐 🤲 💪 ✍️ 💅 🫶 👀 🧠 🗣️ 👤 👥 🧑‍🏫 👩‍🏫 👨‍🏫 🧑‍🎓 👩‍🎓 👨‍🎓 🧑‍💻 👩‍💻 👨‍💻 🙋 🙋‍♀️ 🙋‍♂️ 🤷 🤷‍♀️ 🤷‍♂️ 🤦 🙆 🙅 💁",
  },
  {
    id: "hearts",
    label: "Corações",
    icon: "❤️",
    emojis: "❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💯 💢 💥 💫 💦 💨 🔥 ✨ ⭐ 🌟 ⚡ 🎉 🎊",
  },
  {
    id: "study",
    label: "Estudo e trabalho",
    icon: "📚",
    emojis:
      "📚 📖 📝 ✏️ 🖊️ 🖍️ 📒 📓 📔 📕 📗 📘 📙 📎 📌 📍 📏 📐 ✂️ 🗂️ 📁 📂 📅 📆 🗓️ ⏰ ⏳ ⌛ 💡 🔍 🔎 💻 🖥️ ⌨️ 🖱️ 📱 ☎️ 📞 🎧 🎤 🎓 🏫 🏆 🥇 🥈 🥉 🏅 🎯 📈 📉 📊 💼 💰 💵 🧾 ✅ ☑️ ✔️ ❌ ❓ ❗ ⚠️ 🚀",
  },
  {
    id: "nature",
    label: "Natureza",
    icon: "🌿",
    emojis:
      "🐶 🐱 🐭 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🙈 🙉 🙊 🐔 🐧 🐦 🦉 🦋 🐝 🐢 🐍 🐙 🐬 🐳 🦒 🐘 🌵 🌴 🌳 🌲 🌿 🍀 🌱 🌻 🌹 🌷 🌸 🌼 🌞 🌝 🌚 🌙 🌈 ☀️ ⛅ ☁️ 🌧️ ⛈️ ❄️ 🌊 🌍",
  },
  {
    id: "food",
    label: "Comida",
    icon: "🍕",
    emojis:
      "🍎 🍊 🍋 🍌 🍉 🍇 🍓 🍒 🍑 🥭 🍍 🥥 🥑 🍅 🌽 🥕 🥔 🍞 🧀 🥚 🍳 🥞 🥓 🍗 🍖 🌭 🍔 🍟 🍕 🥪 🌮 🌯 🍝 🍜 🍲 🍛 🍣 🍚 🍰 🎂 🧁 🍩 🍪 🍫 🍬 🍦 ☕ 🍵 🧃 🥤 🍺 🍷 🥂",
  },
  {
    id: "activities",
    label: "Atividades e viagens",
    icon: "⚽",
    emojis:
      "⚽ 🏀 🏈 ⚾ 🎾 🏐 🏓 🏸 🥊 🏋️ 🚴 🏃 🧘 🎮 🎲 🧩 🎨 🎬 🎵 🎶 🎸 🎹 🥁 🎭 🚗 🚕 🚌 🚲 🛵 ✈️ 🚆 🚢 🏠 🏢 🏥 🏦 🏖️ 🏝️ 🗺️ 🧭 ⛺ 🎁 🎈",
  },
  {
    id: "flags",
    label: "Bandeiras",
    icon: "🇦🇴",
    emojis: "🇦🇴 🇧🇷 🇵🇹 🇲🇿 🇨🇻 🇬🇼 🇸🇹 🇹🇱 🇿🇦 🇳🇦 🇨🇩 🇳🇬 🇺🇸 🇬🇧 🇫🇷 🇪🇸 🏁 🏳️ 🏴",
  },
];

const RECENT_KEY = "metanoia.recent-emojis";
const RECENT_LIMIT = 24;

function readRecent(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item) => typeof item === "string").slice(0, RECENT_LIMIT) : [];
  } catch {
    return [];
  }
}

function saveRecent(emoji: string) {
  try {
    const next = [emoji, ...readRecent().filter((item) => item !== emoji)].slice(0, RECENT_LIMIT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

export function EmojiPicker({ onPick, disabled = false }: { onPick: (emoji: string) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [active, setActive] = useState("smileys");
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function toggle() {
    if (!open) {
      const stored = readRecent();
      setRecent(stored);
      setActive(stored.length > 0 ? "recent" : "smileys");
    }
    setOpen((value) => !value);
  }

  function pick(emoji: string) {
    saveRecent(emoji);
    onPick(emoji);
  }

  function jump(id: string) {
    setActive(id);
    gridRef.current?.querySelector(`[data-category="${id}"]`)?.scrollIntoView({ block: "start" });
  }

  const sections = [
    ...(recent.length > 0 ? [{ id: "recent", label: "Recentes", icon: "🕘", list: recent }] : []),
    ...CATEGORIES.map((category) => ({ ...category, list: category.emojis.split(" ") })),
  ];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-label="Emojis"
        aria-expanded={open}
        aria-haspopup="dialog"
        title="Emojis"
        className={clsx(
          "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50",
          open ? "bg-primary-soft text-primary" : "text-ink-soft hover:bg-tone hover:text-ink"
        )}
      >
        <Smile size={19} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Escolher emoji"
          className="absolute bottom-full left-0 z-40 mb-3 flex w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg bg-panel shadow-float ring-1 ring-line"
        >
          <div className="flex gap-0.5 overflow-x-auto border-b border-line px-2 py-1.5 [scrollbar-width:none]">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => jump(section.id)}
                aria-label={section.label}
                title={section.label}
                className={clsx(
                  "flex size-8 shrink-0 items-center justify-center rounded-md text-lg transition-colors",
                  active === section.id ? "bg-primary-soft" : "opacity-60 hover:bg-tone hover:opacity-100"
                )}
              >
                {section.icon}
              </button>
            ))}
          </div>
          <div
            ref={gridRef}
            className="relative h-72 overflow-y-auto px-2 pb-2"
            onScroll={(event) => {
              const top = event.currentTarget.scrollTop;
              const headers = [...event.currentTarget.querySelectorAll<HTMLElement>("[data-category]")];
              const current = headers.filter((header) => header.offsetTop - 8 <= top).at(-1);
              if (current?.dataset.category) setActive(current.dataset.category);
            }}
          >
            {sections.map((section) => (
              <section key={section.id} aria-label={section.label} data-category={section.id}>
                <h3
                  className="sticky top-0 bg-panel px-1.5 pb-1 pt-2.5 text-xs font-semibold text-ink-soft"
                >
                  {section.label}
                </h3>
                <div className="grid grid-cols-8 gap-0.5">
                  {section.list.map((emoji, index) => (
                    <button
                      key={`${section.id}-${emoji}-${index}`}
                      type="button"
                      onClick={() => pick(emoji)}
                      aria-label={emoji}
                      className="flex aspect-square items-center justify-center rounded-md text-[22px] leading-none transition-transform hover:scale-110 hover:bg-tone focus-visible:outline-2 focus-visible:outline-primary motion-reduce:hover:scale-100"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
