"use client";
import React from "react";
import { FixedSizeList as List } from "react-window";

interface HexOutputListProps {
  hexOutput: string;
  // You can pass a containerHeight in px, or omit for auto-responsiveness
  containerHeight?: number | string; // px/%, recommended: "100%" or e.g. "15vh"
}

export default function HexOutputList({
  hexOutput,
  containerHeight = "100%", // default to container fill
}: HexOutputListProps) {
  // Split hex string into lines (adjust per line length as needed)
  const lines = React.useMemo(() => hexOutput.match(/.{1,60}/g) || [], [hexOutput]);

  // Use number height (px) or percent, for List height
  // If percent/vh, fallback ~180px for SSR mismatch avoidance, otherwise cast to number
const resolvedHeight: number | string =
  typeof containerHeight === "number"
    ? containerHeight
    : containerHeight?.endsWith("vh") || containerHeight?.endsWith("%")
    ? containerHeight // just use the string directly
    : 180; // fallback px

  // For percent/vh, let outer div handle height.
  return (
    <div
      style={{
        // Responsive: fill parent or set fixed height
        height: containerHeight,
        minHeight: 60,
        maxHeight: "100%",
        border: "1px solid #ccc",
        backgroundColor: "#f3f3f3",
        overflowY: "auto",
        overflowX: "hidden",
        padding: 10,
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
             marginTop: "-0.5rem",
      }}
    >
      <List
        height={resolvedHeight}
        style={{
          flex: typeof containerHeight === "string" ? 1 : undefined,
          width: "100%",
          overflowX: "hidden",
        }}
        itemCount={lines.length}
        itemSize={20}
        width="100%"
      >
        {({ index, style }) => (
          <div
            style={{
              ...style,
              fontFamily: "monospace",
              whiteSpace: "pre",
              overflowX: "hidden",
              textOverflow: "clip",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {lines[index]}
          </div>
        )}
      </List>
    </div>
  );
}
