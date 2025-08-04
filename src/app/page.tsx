"use client";

import { useState } from "react";
import FileInput from "../components/FileInput";
import TextInput from "../components/TextInput";
import ResultDisplay from "../components/ResultDisplay";
import FrequencyTable from "../components/FrequencyTable";
import HexOutputList from "../components/HexOutputList";
import { compress, decompress, getFrequencies, bitsToBytes, toHex, HuffmanNode } from "../lib/huffman";

export default function HomePage() {
  const [inputText, setInputText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [mode, setMode] = useState<"compress" | "decompress">("compress");
  const [currentTree, setCurrentTree] = useState<HuffmanNode | null>(null);
  const [frequencyMap, setFrequencyMap] = useState<Map<string, number> | null>(null);
  const [compressedBytes, setCompressedBytes] = useState<Uint8Array | null>(null);

  function handleCompress() {
    if (!inputText) {
      setResult("Please enter some text to compress");
      return;
    }
    const freq = getFrequencies(inputText);
    const { compressed, tree } = compress(inputText);
    const byteArr = bitsToBytes(compressed);

    setFrequencyMap(freq);
    setCurrentTree(tree);
    setCompressedBytes(byteArr);
    setResult(``); // Clear textual result on compress
  }

  function handleDecompress() {
    if (!compressedBytes || !currentTree) {
      setResult("No compressed bytes or Huffman tree available for decompression");
      setFrequencyMap(null);
      setCompressedBytes(null);
      return;
    }
    try {
      const bitStr = Array.from(compressedBytes)
        .map(b => b.toString(2).padStart(8, "0"))
        .join("");
      const decompressed = decompress(bitStr, currentTree);
      setResult(decompressed);
      setFrequencyMap(null);
      setCompressedBytes(null);
    } catch (err) {
      setResult("Decompression error: Invalid compressed data or tree");
    }
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

      {mode === "compress" && frequencyMap && (
        <>
          <FrequencyTable frequencyMap={frequencyMap} />
          <div
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            Compressed bit length: {compressedBytes ? compressedBytes.length * 8 : 0} bits
            <br />
            Bytes length: {compressedBytes ? compressedBytes.length : 0} bytes
          </div>
          {compressedBytes && <HexOutputList hexOutput={toHex(compressedBytes)} />}
        </>
      )}

      {mode === "decompress" && <ResultDisplay result={result} />}
    </main>
  );
}
