"use client";

import { useState } from "react";
import FileInput from "../components/FileInput";
import TextInput from "../components/TextInput";
import ResultDisplay from "../components/ResultDisplay";
import FrequencyTable from "../components/FrequencyTable";
import HexOutputList from "../components/HexOutputList";
import NarrationPanel, { narrations } from "@/components/Narration";

import {
  compress,
  decompress,
  getFrequencies,
  bitsToBytes,
  toHex,
  HuffmanNode,
} from "../lib/huffman";

const DEMOS = {
  small: "the quick brown fox jumps over the lazy dog",
  large: `THIS IS A LARGE DEMO FILE\n`.repeat(10000),
};

export default function HomePage() {
  const [inputText, setInputText] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [mode, setMode] = useState<"compress" | "decompress">("compress");
  const [currentTree, setCurrentTree] = useState<HuffmanNode | null>(null);
  const [frequencyMap, setFrequencyMap] = useState<Map<string, number> | null>(null);
  const [compressedBytes, setCompressedBytes] = useState<Uint8Array | null>(null);
  const [narrationIndex, setNarrationIndex] = useState(0);


const nextNarration = () =>
  setNarrationIndex((i) => Math.min(i + 1, narrations.length - 1));
  const prevNarration = () =>
    setNarrationIndex((i) => Math.max(i - 1, 0));

  function handleDemoLoad(which: "small" | "large") {
    setInputText(DEMOS[which]);
    setResult("");
    setCompressedBytes(null);
    setFrequencyMap(null);
    setCurrentTree(null);
  }

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
    setResult("");
  }

  function handleDecompress() {
    if (!compressedBytes || !currentTree) {
      setResult(
        "No compressed bytes or Huffman tree available for decompression"
      );
      setFrequencyMap(null);
      setCompressedBytes(null);
      return;
    }
    try {
      const bitStr = Array.from(compressedBytes)
        .map((b) => b.toString(2).padStart(8, "0"))
        .join("");
      const decompressed = decompress(bitStr, currentTree);
      setResult(decompressed);
      setFrequencyMap(null);
      setCompressedBytes(null);
    } catch {
      setResult("Decompression error: Invalid compressed data or tree");
    }
  }

  const originalSize = inputText.length;
  const compressedSize = compressedBytes ? compressedBytes.length : 0;
  const ratio = originalSize
    ? ((1 - compressedSize / originalSize) * 100).toFixed(1)
    : "0";

  return (
    <>
      <main className="huffman-main">
        {/* TOP PANEL */}
        <section className="huffman-top">
         
          <h1>Huffman Compression</h1>

        <div className="huffman-buttons">
          <div className="huffman-upload-row" id="buttons-wrapper">
            <button
              onClick={() => handleDemoLoad("small")}
              className="huffman-demobtn small"
            >
              Small Demo
            </button>
            <button
              onClick={() => handleDemoLoad("large")}
              className="huffman-demobtn large"
            >
              Large Demo
            </button>

   <label htmlFor="file-upload" className="huffman-browse-btn">
              <span role="img" aria-label="file">
                📂
              </span>{" "}
              Browse...
              <FileInput
                onLoad={setInputText}
                style={{ display: "none" }}
                inputProps={{ id: "file-upload" }}
              />
            </label>

            <button
              onClick={handleCompress}
              className={`huffman-actionbtn${mode === "compress" ? " active" : ""}`}
            >
              Compress
            </button>
            <button
              onClick={handleDecompress}
              className={`huffman-actionbtn${mode === "decompress" ? " active" : ""}`}
            >
              Decompress
            </button>
          </div>
</div> 

          <div className="huffman-top-content-row">
            {/* Original Contents + original size */}
            <div className="huffman-original-content">
              <div className="huffman-box-label" style={{backgroundColor: "#98beed", padding: "0.2rem"}}>Original Contents</div>
              <TextInput
                value={inputText}
                onChange={setInputText}

              />

             
            </div>

            {/* Hex output or decompressed output + size */}
            <div className="huffman-output-area">
              {mode === "compress" && compressedBytes && (
                <>
                  <div className="huffman-box-label" style={{backgroundColor: "#e2eafc",  padding: "0.2rem"}}>Hex Output</div>
                  <HexOutputList
                    hexOutput={toHex(compressedBytes)}
                    containerHeight={180}
                  />
                
                </>
              )}
              {mode === "decompress" && (
                <>
                  <div className="huffman-box-label">Decompressed Output</div>
                 
                  <div className="huffman-size-label">
                    Original size: {originalSize} bytes
                  </div>
                </>
              )}
            </div>
         </div>

          <div className="huffman-stats">
            <span style={{color:"red"}}>Original size: {originalSize} bytes</span>
            <span style={{color:"blue"}}>Compressed size: {compressedSize} bytes</span>
            <span style={{color:"green"}}>
          Space saved: {originalSize && compressedSize ? `${ratio}%` : "0%"}
            </span>
          </div>
          
        </section>

        {/* BOTTOM PANEL */}
        <section className="huffman-bottom">
          <div className="huffman-explanation">
              {/* Narration display */}
        <NarrationPanel currentIndex={narrationIndex} />


        {/* Navigation buttons */}
        <div style={{ marginTop: 12, display: "flex", gap: "8px",   justifyContent: "center",}}>
          <button
            onClick={prevNarration}
            disabled={narrationIndex === 0}
              style={{
                border: "1px solid #ccc",
                borderRadius: "1rem",
                padding: "0.5em"
                  }}
          >
            ⬅️ Back
          </button>
          <button
            onClick={nextNarration}
            disabled={narrationIndex === narrations.length - 1}
              style={{
                border: "1px solid #ccc",
                borderRadius: "1rem",
                padding: "0.5em"
                  }}
                >
            Next  ➡️
          </button>
        </div>
          </div>

          {mode === "compress" && frequencyMap && (
            <div className="huffman-freqbox">
              <div className="huffman-freqlabel">Character Frequency</div>
              <FrequencyTable frequencyMap={frequencyMap} />
            </div>
          )}
        </section>
      </main>

      <style jsx global>{`
        .huffman-main {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          background: #f5f7fb;
        }
        .huffman-top {
          height: 350px;
          min-height: 245px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 10px 1rem 10px 1rem;
        }
          
        h1 {
         margin-top: 1rem;
         margin-bottom: 1rem;
          font-family: "Arial", sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #304660;
          user-select: none;
          text-align: center;
        }
.huffman-buttons {
          margin-left: auto;
          margin-right: auto;
 
          }
        /* Shared container for width-limited buttons rows */
        #buttons-wrapper {
          max-width: max-content;

          /* Ensures Compress/Decompress button width == Browse/demos width */
        }

        .huffman-upload-row {
          margin-bottom: 10px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          user-select: none;
        }
        .huffman-browse-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #F0C419;

;
          border-radius: 20px;
          padding: 0.4em 1.2em;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          white-space: nowrap;
        }
        .huffman-demobtn {
          border-radius: 16px;
          padding: 0.4em 1em;
          font-weight: 600;
          border: none;
          font-size: 0.9rem;
          cursor: pointer;
          flex-shrink: 0;
        }
        .huffman-demobtn.small {
          background: #d0f9dcff;
          color: #054e12ff;
        }
        .huffman-demobtn.large {
          background: #f6e1e9;
          color: #9a4163;
        }
        .huffman-controlrow {
          display: flex;
          gap: 0.6rem;
          margin-bottom: 10px;
          user-select: none;
        }
        .huffman-actionbtn {
          background: #e2eafc;
          color: #304660;
          border: none;
          border-radius: 8px;
          padding: 0.45em 1.2em;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          flex: 1;
          transition: background 0.15s ease;
          white-space: nowrap;
        }
        .huffman-actionbtn.active {
          background: #98beed;
          color: #1b3c58;
        }

        .huffman-top-content-row {
          display: flex;
          gap: 1rem;
          overflow: hidden;
           margin-left: auto;
          margin-right: auto;
        }
        .huffman-original-content,
        .huffman-output-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          user-select: text;
          margin-top: 1rem;
          border: 1px solid black;
          max-height: 7rem;
          width: 40vw;
        }
        .huffman-box-label {
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.3rem;
          user-select: none;
        }
        .huffman-size-label {
          font-size: 0.85rem;
          margin-top: 0.3rem;
          color: #555;
          font-family: monospace;
          user-select: none;
        }

        .huffman-stats {
          font-family: monospace;
          font-size: 0.9rem;px;
          user-select: none;

          color: #444;
          margin: auto;
          margin-top:1rem;
          margin-bottom: .5rem;
        }
.huffman-stats span:not(:last-child)::after {
  content: "|";
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  color: #bbb;
}

        .huffman-bottom {
          height: 80vh; /* Adjust bottom height accordingly */
          padding: 1rem 2rem 1.5rem 2rem;
          background: #f3f5fe;
          box-sizing: border-box;
          overflow: visible;
          display: flex;
          flex-direction: column;
          align-items: center;
          user-select: none;
          width: 100vw;
        }
        .huffman-explanation {
          width: 90%;
          background: #f6f6fd;
          border-radius: 12px;
          box-shadow: 0 1px 6px #dde2ff13;
          color: #345;
          font-size: rem;
          letter-spacing: 0.004em;
          line-height: 1.55;          padding: 1rem 1.5rem;
          font-weight: 450;
          margin-top: -2rem;
          margin-left: auto;
          margin-right: auto;
        }
        .huffman-freqbox {
          width: 100%;
          height: 80%;
          overflow-y: auto;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 1.5px 6px #b6b7c014;
          padding: 15px 20px;
          border: 1px solid #eeeeea;
          flex-shrink: 0;
        }
        .huffman-freqlabel {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          letter-spacing: 0.01em;
        }

        /* Responsive */
        @media (max-width: 900px) {

.huffman-top {
  min-height: 470px;
  }

          .huffman-top,
          .huffman-bottom {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .huffman-explanation,
          .huffman-freqbox {
            max-width: 100%;
          }
          .huffman-top-content-row {
            flex-direction: column;
            height: auto;
          }
          .huffman-original-content,
          .huffman-output-area {
            max-height: 40vh;
            margin-bottom: 1rem;
            overflow-y: auto;
            width: 100%;
          }
   .huffman-stats {
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
  }
  .huffman-stats span:not(:last-child)::after {
    content: "";
    margin-left: 0;
  }
  .huffman-stats span {
    display: block;     /* Forces each span on its own line */
    width: 100%;
    text-align: center;
  }
}
          .huffman-demobtn,
  .huffman-browse-btn,
  .huffman-actionbtn {
    font-size: 0.82rem;
    padding: 0.27em 0.68em;
    max-width: 110px;        /* smaller width */
    min-width: 74px;
  }

  /* Button row will show all small buttons inline and let them wrap if needed */
  .huffman-upload-row, .huffman-controlrow {
    gap: 0.38rem;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    max-width: 100vw;
  }

  /* Compress/Decompress always appear as small as other buttons */
  .huffman-actionbtn {
    flex: none;
    width: auto;
  }
   @media (max-width: 500px) {
   .huffman-top {
  min-height: 600px;
  }
   .huffman-freqbox {
  
      height: 50%;}
   }

}
      `}</style>
    </>
  );
}
