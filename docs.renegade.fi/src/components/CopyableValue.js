import React, { useState } from "react";

const copyIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const checkIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function CopyableValue({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
      <code>{value}</code>
      <button
        onClick={handleCopy}
        title="Copy to clipboard"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "2px",
          display: "inline-flex",
          alignItems: "center",
          color: copied ? "#22c55e" : "var(--ifm-color-emphasis-600)",
          opacity: copied ? 1 : 0.6,
          transition: "color 0.2s, opacity 0.2s",
        }}
        onMouseEnter={(e) => { if (!copied) e.currentTarget.style.opacity = "1"; }}
        onMouseLeave={(e) => { if (!copied) e.currentTarget.style.opacity = "0.6"; }}
      >
        {copied ? checkIcon : copyIcon}
      </button>
    </span>
  );
}
