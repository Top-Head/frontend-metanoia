"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  name?: string;
}

/**
 * Select customizado (padrão "select-only combobox" da WAI-ARIA).
 * O foco permanece no botão; a opção ativa é indicada via
 * aria-activedescendant. Suporta setas, Home/End, Enter/Espaço,
 * Esc, Tab e busca por digitação.
 */
export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  icon,
  name,
}: SelectProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const listboxId = `${id}-listbox`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ query: "", timeout: 0 });

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    const list = listRef.current;
    if (!isOpen || !list || activeIndex < 0) return;

    // Rola apenas a lista (scrollIntoView também rolaria a página).
    const option = list.children[activeIndex] as HTMLElement | undefined;
    if (!option) return;

    const { offsetTop, offsetHeight } = option;
    if (offsetTop < list.scrollTop) {
      list.scrollTop = offsetTop;
    } else if (offsetTop + offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = offsetTop + offsetHeight - list.clientHeight;
    }
  }, [isOpen, activeIndex]);

  function open(index = selectedIndex >= 0 ? selectedIndex : 0) {
    setActiveIndex(index);
    setIsOpen(true);
  }

  function commit(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    setIsOpen(false);
  }

  function findByTyping(key: string) {
    window.clearTimeout(typeahead.current.timeout);
    typeahead.current.query += key.toLowerCase();
    typeahead.current.timeout = window.setTimeout(() => {
      typeahead.current.query = "";
    }, 500);

    const start = isOpen ? activeIndex + 1 : selectedIndex + 1;
    const ordered = [...options.slice(start), ...options.slice(0, start)];
    const match = ordered.find((option) =>
      option.label.toLowerCase().startsWith(typeahead.current.query)
    );

    return match ? options.indexOf(match) : -1;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = options.length - 1;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) open();
        else setActiveIndex((index) => Math.min(index + 1, last));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) open();
        else setActiveIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        open(0);
        break;
      case "End":
        event.preventDefault();
        open(last);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen) commit(activeIndex);
        else open();
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
        }
        break;
      case "Tab":
        if (isOpen) commit(activeIndex);
        break;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const index = findByTyping(event.key);
          if (index < 0) return;
          if (isOpen) setActiveIndex(index);
          else onChange(options[index].value);
        }
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <label id={labelId} htmlFor={`${id}-trigger`} className="mb-2 block text-sm font-bold text-ink">
        {label}
      </label>

      <button
        id={`${id}-trigger`}
        type="button"
        role="combobox"
        aria-labelledby={labelId}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
        className={clsx(
          "relative flex h-11 w-full items-center rounded-lg border bg-panel pr-10 text-left text-sm outline-none transition-colors",
          icon ? "pl-10" : "pl-3",
          isOpen
            ? "border-primary ring-1 ring-primary"
            : "border-line-strong hover:border-ink-faint focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
        )}
      >
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint">
            {icon}
          </span>
        )}
        <span className={clsx("truncate", selected ? "text-ink" : "text-ink-faint")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={18}
          className={clsx(
            "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-transform duration-200",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>

      {name && <input type="hidden" name={name} value={value} />}

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={labelId}
          tabIndex={-1}
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-xl border border-line bg-panel p-1.5 shadow-float transition duration-150 starting:-translate-y-1 starting:opacity-0"
        >
          {options.map((option, index) => {
            const isSelected = index === selectedIndex;
            const isActive = index === activeIndex;

            return (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
                onPointerMove={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => commit(index)}
                className={clsx(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive ? "bg-primary/8" : "bg-transparent",
                  isSelected ? "font-semibold text-primary" : "text-ink"
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{option.label}</span>
                  {option.description && (
                    <span className="mt-0.5 block truncate text-xs font-normal text-ink-soft">
                      {option.description}
                    </span>
                  )}
                </span>
                <Check
                  size={16}
                  aria-hidden="true"
                  className={clsx("shrink-0 text-primary", isSelected ? "opacity-100" : "opacity-0")}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
