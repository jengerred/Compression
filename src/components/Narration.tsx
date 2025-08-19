import React from "react";

const colorStyles = {
  gold: "#FFD700",
  darkGoldenrod: "#B8860B",
  steelBlue: "#4682B4",
  darkSlateGray: "#2F4F4F",
  forestGreen: "#228B22",
  cornflowerBlue: "#6495ED",
  mediumVioletRed: "#C71585",
  orangeRed: "#FF4500",
  darkOrange: "#FF8C00",
  darkViolet: "#9400D3",
  deepSkyBlue: "#00BFFF",
  darkGreen: "#006400",
};

interface NarrationPanelProps {
  currentIndex: number;
  originalSize: number | string;
  compressedSize: number | string;
  ratio: number | string;
      result?: string; 
}

export function getNarrations({
  originalSize,
  compressedSize,
  ratio,
  result, // <-- add this
}: {
  originalSize: number | string;
  compressedSize: number | string;
  ratio: number | string;
  result?: string; // <-- add this

}) {
  return [
    <div key="waiting" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
      <strong style={{ display: "block", marginBottom: 8 }}>
        GETTING STARTED
      </strong>
      You can <strong>upload your own ASCII text file</strong> using the{" "}
      <span style={{ fontWeight: "bold", color: colorStyles.darkGoldenrod }}>
        &quot;Browse...&quot;
      </span>{" "}
      button, then click{" "}
      <span style={{ fontWeight: "bold", color: colorStyles.steelBlue }}>
        &quot;Compress&quot;
      </span>{" "}
      to start.
      <br />
      Or, simply click the{" "}
      <span style={{ fontWeight: "bold", color: colorStyles.darkSlateGray }}>
        &quot;Small Demo&quot;
      </span>{" "}
      or{" "}
      <span style={{ fontWeight: "bold", color: colorStyles.darkSlateGray }}>
        &quot;Large Demo&quot;
      </span>{" "}
      button to automatically load and compress a sample file.
      <br />
      When you&apos;re ready to see the decompression, click the{" "}
      <span style={{ fontWeight: "bold", color: colorStyles.forestGreen }}>
        &quot;Decompress&quot;
      </span>{" "}
      button.
      <br />
      If the visualization is too large for the page, you can make it full screen
      for the best experience.
      <br />
      I look forward to compressing whichever file you choose!
    </div>,

    <div key="compressionIntro" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
      <strong style={{ display: "block", marginBottom: 8 }}>
        <p style={{ textAlign: "center" }}>⚡ DONE WITH COMPRESSION! </p>
      </strong>
      Although that was incredibly fast, here&apos;s what I was actually doing in the
      background to make your results both quick and accurate:
      <br />
      As soon as you clicked{" "}
      <span style={{ fontWeight: "bold", color: colorStyles.steelBlue }}>
        Compress
      </span>, I sprang into action:
      <br />
      <p style={{ fontWeight: "bold", color: colorStyles.steelBlue, textAlign: "center" }}>Click Continue to learn how I completed these actions.</p>
    </div>,

    <div key="frequency_chart" style={{ whiteSpace: "pre-line" }}>
      <p style={{ textAlign: "center", fontWeight: "bold" }}>
        This frequency table is the foundation of efficient compression!
      </p>
      <p style={{ textAlign: "center" }}>This character frequency chart displays every character and its frequency from the text file, providing a complete overview of your data.</p>
      <p style={{ fontWeight: "bold" }}>How I created this frequency chart:</p>
      <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
        <li>I read your file byte by byte.</li>
        <li>
          For every character, I updated a frequency table&mdash;an array with 256 slots
          (one for each possible ASCII character, 0&ndash;255).
        </li>
        <li>Each time a character appeared, I incremented its count in the array.</li>
      </ul>
    </div>,

    <div key="previewing" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
      <strong style={{ display: "block", marginBottom: 8 }}>
        <p style={{ textAlign: "center" }}>    ✨ Previewing Your Text ✨ </p>
      </strong>
      <span>
        <p style={{ textAlign: "center" }}> 💡 For clarity and readability in the steps ahead, I&apos;ll be showcasing only the first 20 characters &mdash; so we won&apos;t be overwhelmed by a massive wall of text! 🔍 🔡</p>
      </span>
      <br />
      <p style={{ textAlign: "center", fontWeight: "bold" }}>
        Ready? Let’s dive in! 🚀
      </p>
    </div>,

    <div key="huffmanTree" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
      <strong style={{ display: "block", marginBottom: 8 }}>
        <p style={{ textAlign: "center" }}>  🌳 BUILDING THE HUFFMAN TREE</p>
      </strong>
      <p style={{ fontWeight: "bold" }}>With the frequency table ready, I jumped straight into the next phase:{" "}</p>
      <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
        <li>I took every character that showed up in your file and made it into a leaf node, each one labeled with its character and how often it appeared.</li>
        <li>Then, like a matchmaker for bytes, I kept finding the two nodes with the lowest frequencies and merged them into a new parent node. This parent’s frequency is simply the sum of its two children.</li>
        <li>I repeated this merging process—always picking the two smallest—until only one node remained at the very top: the root of the Huffman tree.</li>
      </ul>
      <br />
      <p style={{ textAlign: "center", fontStyle: "italic" }}>
        This special binary tree is cleverly structured so that the most frequent characters end up closer to the root, which means their paths (and codes) are shorter and compression is more efficient!
      </p>
    </div>,

    <div key="encodeData" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
      <strong style={{ display: "block", marginBottom: 8 }}>
        <p style={{ textAlign: "center" }}>  💾 CREATING THE BINARY CODE </p>
      </strong>
      <p style={{ fontWeight: "bold" }}>
        With the Huffman tree built, I assigned a unique binary code to each character in your file:{" "}
      </p>
      <em> This binary sequence corresponds exactly to the edges traversed from the root down to each character’s leaf node.</em>
      <br />
      For every character in your file, I traced a path from the root of the tree down to that character’s leaf node. Starting from the root node of the tree, a ‘0’, is added to the code whenever the path moves to a left child node, and a ‘1’ is added whenever it moves to a right child node.
      This traversal produces a distinct sequence of bits (0s and 1s) for each character based on its path through the tree.
      <br /> <br />
      <p style={{ textAlign: "center", fontWeight: "bold" }}>
        By replacing every character in your data with its binary code, I transformed your original text into a long, compressed stream of bits—ready for the next stage!
      </p>
    </div>,

  <div key="packBinaryData" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
  <strong style={{ display: "block", marginBottom: 8 }}>
    <p style={{ textAlign: "center" }}> 📦 GROUPING THE BINARY CODE INTO BYTES</p>
  </strong>
<p style={{ fontWeight: "bold" }}>
  Now that your entire message is encoded as a continuous stream of 0s and 1s generated from the Huffman tree, I prepared this binary data for efficient storage and display.
</p>
  <br/>
    <p>
    When we look at text, we see one character like a letter or a space as a single item. But a computer does not see it that way. It reads every character as a group of <strong>8 bits</strong>, which together form one byte.
  </p>
  <p>
    So while one character looks like one thing to us, the computer actually treats it as <strong>8 individual bits</strong>.
  </p>
  <br/>
  <p style={{ fontWeight: "bold" }}>
    To make this easier to work with, we group these 8 bits into bytes. Then, instead of showing all 8 bits, we convert each byte into a two-digit hexadecimal (hex) value.
  </p>
  <p>
    This means that the computer&apos;s 8-bit byte can be represented as just <strong>2 hex characters</strong>. So rather than dealing with 8 separate bits, we use 2 hex digits to represent the same information&mdash;making it easier to read and manage.
  </p>
</div>,

    <div key="compressionResults" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
      <strong style={{ display: "block", marginBottom: 8 }}>
        <p style={{ textAlign: "center" }}>📦 COMPRESSED OUTPUT (HEX): ACTUAL FILE RESULT</p>
      </strong>
      <div>
        The original file you uploaded had a size of <strong>{originalSize}</strong> bytes.
        <br />After compressing it, the size is now <strong>{compressedSize}</strong> bytes.
        <br />
        That means the compression ratio is <strong>{ratio}%</strong>.
        <br />
        Below is the actual compressed output for your entire file, shown in hexadecimal&mdash;this is the true content of your file, not just the preview used for animation.
      </div>
    </div>,

<div
  key="decompressionStage"
  style={{ whiteSpace: "pre-line", fontSize: "0.8rem", textAlign: "center" }}
>
  {!result && (
    <>
      <strong
        style={{
          fontWeight: "bold",
          color: colorStyles.darkGreen,
          display: "block",
          marginBottom: 8,
        }}
      >
        <p style={{ textAlign: "center" }}> READY TO RESTORE YOUR FILE!? </p>
      </strong>
      ⬇️ Click the &quot;Decompress&quot; button to begin! ⬇️
    </>
  )}
  {result && (
    <>
      <strong style={{ display: "block", marginBottom: 8 }}>
        <p style={{ textAlign: "center" }}> ✅ DECOMPRESSION COMPLETE!</p>
      </strong>
      <p style={{ fontWeight: "bold" }}> 🔓 DECOMPRESSION RESULTS: YOUR FILE IS BACK!</p>
      ✨ Your file has been fully restored. Every letter, space, and symbol is now back in its original place&mdash;thanks to the magic of Huffman coding! ✨
      <br />
      Your original content is now perfectly reconstructed, no data lost, no changes made.
    </>
  )}
</div>,

    <div key="decompressionTreeExplanation" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
      <strong style={{ display: "block", marginBottom: 8 }}>
        <p style={{ textAlign: "center" }}> 🌳 REMEMBER THAT HUFFMAN TREE WE BUILT DURING COMPRESSION?</p>
      </strong>
      <p style={{ fontWeight: "bold" }}>  I just put it to work! Here’s how your file was restored: </p>
      <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
        <li>I read the compressed file bit by bit, following each '0' and '1' through the Huffman tree.</li>
        <li>Every time I reached a leaf node, I uncovered one of your original characters and added it to the output.</li>
        <li>This process continued until your entire file was rebuilt, character by character, exactly as it was before compression. </li>
      </ul>
      Thanks to the power of Huffman coding, not a single letter, space, or symbol was lost or changed. Your data is safe and sound!
      <br />
      You can now see your original content, perfectly reconstructed.
    </div>,

    <div key="finalConclusion" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
      <strong style={{ display: "block", marginBottom: 8 }}>
        <p style={{ textAlign: "center" }}>  🏁 ALL DONE! YOU'VE MASTERED HUFFMAN COMPRESSION </p>
      </strong>
      <p style={{ fontWeight: "bold" }}>  🤝 What a journey! Together, we: </p>
      <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
        <li>Explored your file’s characters and counted how often each one appeared.</li>
        <li>Built a Huffman tree, merging nodes step by step until just one remained at the top.</li>
        <li>Created unique binary codes for each character, making your data as compact as possible.</li>
        <li>Packed all those bits into real bytes, ready for storage or sharing.</li>
        <li>And finally, decompressed your file—restoring every letter, space, and symbol, perfectly intact!</li>
      </ul>
      <br />
      <p style={{ fontWeight: "bold" }}>💡 Huffman coding is a powerful tool, and now you’ve seen it in action—from start to finish!
        <br />
      </p>
      <br />
      <p style={{ textAlign: "center", fontWeight: "bold" }}>    Thank you for exploring data compression with me.
        <br />👋 This is the end of our journey—for now. Until next time, happy compressing!</p>
    </div>,
  ];
}

export default function NarrationPanel({
  currentIndex,
  originalSize,
  compressedSize,
  ratio,
  result,
}:
 NarrationPanelProps) {
  const narrations = getNarrations({ originalSize, compressedSize, ratio, result });
  return (
    <div
      style={{
        backgroundColor: "#f6f6fd",
        borderRadius: 12,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#345",
        boxShadow: "0 1px 6px #dde2ff13",
        fontSize: "0.8rem",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {narrations[currentIndex]}
    </div>
  );
}
