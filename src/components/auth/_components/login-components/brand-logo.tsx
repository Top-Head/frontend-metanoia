import { JSX } from "react";

function BrandLogo({
  size,
}: {
  size: "small" | "large";
}): JSX.Element {
  const containerSize =
    size === "large" ? "size-10" : "size-8";

  return (
    <div className="flex items-center gap-2">
      <div className={`text-primary ${containerSize}`}>
        <svg fill="none" viewBox="0 0 48 48">
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
            fill="currentColor"
            color="white"
          />
        </svg>
      </div>
      {size === "large" && (
        <span className="text-2xl font-bold tracking-tight">
          Metanoia Academy
        </span>
      )}
    </div>
  );
}

export default BrandLogo;