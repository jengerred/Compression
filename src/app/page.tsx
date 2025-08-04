"use client";
import { useState } from "react";
import FileInput from "../components/FileInput";
import TextInput from "../components/TextInput";
import ResultDisplay from "../components/ResultDisplay";

export default function HomePage() {
  const [inputText, setInputText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [mode, setMode] = useState<"compress" | "decompress">("compress");

  function handleCompress() {
    // TODO: Add your Huffman compress logic here
    setResult("⚡ Compressed data will appear here");
  }

  function handleDecompress() {
    // TODO: Add your Huffman decompress logic here
    setResult("🔓 Decompressed data will appear here");
  }

  return (
    <main style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Huffman Compression App</h1>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setMode("compress")}
          style={{ marginRight: 10, fontWeight: mode === "compress" ? "bold" : "normal" }}
        >
          Compress
        </button>
        <button
          onClick={() => setMode("decompress")}
          style={{ fontWeight: mode === "decompress" ? "bold" : "normal" }}
        >
          Decompress
        </button>
      </div>

      <FileInput onLoad={setInputText} />
      <TextInput value={inputText} onChange={setInputText} />

      <div style={{ margin: "20px 0" }}>
        <button onClick={mode === "compress" ? handleCompress : handleDecompress}>
          {mode === "compress" ? "Compress" : "Decompress"}
        </button>
      </div>

      <ResultDisplay result={result} />
    </main>
  );
}
