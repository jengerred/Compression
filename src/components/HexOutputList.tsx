"use client";

import React from "react";
import { FixedSizeList as List } from "react-window";

interface HexOutputListProps {
  hexOutput: string;
}

export default function HexOutputList({ hexOutput }: HexOutputListProps) {
  // Split hexOutput string into fixed-width lines (48 chars per line)
  const lines = React.useMemo(() => {
    return hexOutput.match(/.{1,75}/g) || [];
  }, [hexOutput]);

  // Row renderer for react-window
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={{ ...style, fontFamily: "monospace", whiteSpace: "pre" }}>
      {lines[index]}
    </div>
  );

  return (
    <div
      style={{
        border: "1px solid #ccc",
        backgroundColor: "#f3f3f3",
        overflow: "hidden",
        maxHeight: 300,
        padding: 10,
        width: "100%", // Adjust as needed

      }}
    >
      <List height={400} itemCount={lines.length} itemSize={20} width={"100%"}>
        {Row}
      </List>
    </div>
  );
}
