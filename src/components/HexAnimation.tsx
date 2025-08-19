"use client";

import React, { useEffect, useMemo, useState } from "react";

function chunkIntoBytes(binary: string): string[] {
  const chunks = [];
  for (let i = 0; i < binary.length; i += 8) {
    chunks.push(binary.slice(i, i + 8).padEnd(8, "0"));
  }
  return chunks;
}

function byteToHex(byte: string) {
  return parseInt(byte, 2).toString(16).toUpperCase().padStart(2, "0");
}

interface Props {
  binaryString: string;
  maxBytesToDisplay?: number;
}

export default function BinaryStreamWithHexPairs({
  binaryString,
  maxBytesToDisplay = 20,
}: Props) {
  const bytes = useMemo(
    () => chunkIntoBytes(binaryString).slice(0, maxBytesToDisplay),
    [binaryString, maxBytesToDisplay]
  );

  const [highlightCount, setHighlightCount] = useState(1);

  const COLORS = [
    { hex: "#b32e82", bits: "#ab0058" },  // color set A
    { hex: "#205091", bits: "#1976d2" },  // color set B
  ];

  useEffect(() => {
    setHighlightCount(1);
    if (bytes.length === 0) return;
    const timer = setInterval(() => {
      setHighlightCount((count) => (count < bytes.length ? count + 1 : count));
    }, 1200);
    return () => clearInterval(timer);
  }, [bytes]);

  const blockWidth = "6rem";

  return (
    <div
      style={{
        fontFamily: "monospace",
        padding: "1.25rem",
        maxWidth: "100%",
        margin: "auto",
        userSelect: "text",
      }}
      aria-label="Binary stream with hex value pairs and cumulative hex string"
    >
      {/* BYTE/HEX PAIRS */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2.5rem 1.5rem",
          justifyContent: "flex-start",
        }}
      >
        {bytes.map((byte, idx) => {
          const isRevealed = idx < highlightCount;
          const colorScheme = isRevealed ? COLORS[idx % 2] : null;
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: blockWidth,
                minWidth: "5rem",
                boxSizing: "border-box",
                whiteSpace: "nowrap",
              }}
            >
              {/* Hex value centered above, hidden until revealed */}
              <div
                style={{
                  marginBottom: "0.5rem",
                  fontWeight: isRevealed ? "bold" : "normal",
                  color: isRevealed ? colorScheme!.hex : "#fff", // match background
                  opacity: isRevealed ? 1 : 0, // hide completely if not revealed
                  fontSize: "1.1em",
                  width: "100%",
                  textAlign: "center",
                  fontVariantNumeric: "tabular-nums",
                  userSelect: "text",
                  transition: "color 0.3s, opacity 0.3s",
                }}
              >
                {byteToHex(byte)}
              </div>

              {/* Byte bits */}
              <div
                style={{
                  color: isRevealed ? colorScheme!.bits : "#444",
                  padding: "0.5rem 0.75rem",
                  fontSize: "1.3em",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "0.25em",
                  textAlign: "center",
                  width: "100%",
                  boxSizing: "border-box",
                  fontWeight: isRevealed ? "600" : "normal",
                  userSelect: "text",
                  transition: "color 0.3s",
                }}
                aria-label={`Byte ${idx + 1}: ${byte}`}
              >
                {[...byte].map((bit, bitIdx) => (
                  <span
                    key={bitIdx}
                    style={{
                      minWidth: "1.125rem",
                      textAlign: "center",
                      userSelect: "text",
                      lineHeight: 1.1,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {bit}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Label for hex value string outside the box */}
      <div
        style={{
          fontWeight: 600,
          color: "#b32e82",
          fontSize: "1.14em",
          letterSpacing: "0.06em",
          textAlign: "center",
          marginTop: "3rem",
          marginBottom: "0.75rem",
        }}
      >
        Hex Value:
      </div>

      {/* Cumulative hex value box - wider max width */}
      <div
        style={{
          padding: "1rem 1.25rem",
          border: "2px solid #ccc",
          borderRadius: 8,
          maxWidth: 900,
          marginLeft: "auto",
          marginRight: "auto",
          fontFamily: "monospace",
          fontSize: "1.3em",
          wordBreak: "break-word",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.8rem",
          userSelect: "text",
        }}
        aria-label="Cumulative hex value string"
      >
        {bytes.slice(0, highlightCount).map((byte, idx) => {
          const colorScheme = COLORS[idx % 2];
          return (
            <span
              key={idx}
              style={{
                color: colorScheme.hex,
                fontWeight: 600,
                letterSpacing: "0.15em",
              }}
            >
              {byteToHex(byte)}
            </span>
          );
        })}
      </div>
    </div>
  );
}
