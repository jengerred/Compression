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
  currentIndex: number; // which narration to show, controlled by parent
}

export const narrations = [
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

    Or, simply click the{" "}
    <span style={{ fontWeight: "bold", color: colorStyles.darkSlateGray }}>
      &quot;Small Demo&quot;
    </span>{" "}
    or{" "}
    <span style={{ fontWeight: "bold", color: colorStyles.darkSlateGray }}>
      &quot;Large Demo&quot;
    </span>{" "}
    button to automatically load and compress a sample file.

    When you&apos;re ready to see the decompression, click the{" "}
    <span style={{ fontWeight: "bold", color: colorStyles.forestGreen }}>
      &quot;Decompress&quot;
    </span>{" "}
    button.

    If the visualization is too large for the page, you can make it full screen
    for the best experience.

    I look forward to compressing whichever file you choose!
  </div>,

  <div key="compressionIntro" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
    
    <strong style={{ display: "block", marginBottom: 8 }}>
      ⚡ DONE WITH COMPRESSION!
    </strong>
    Although that was incredibly fast, here&apos;s what I was actually doing in the
    background to make your results both quick and accurate:

    As soon as you clicked{" "}
    <span style={{ fontWeight: "bold", color: colorStyles.steelBlue }}>
      Compress
    </span>, I sprang into action:

   <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
  <li>I read your file byte by byte.</li>
  <li>
    For every character, I updated a frequency table&mdash;an array with 256 slots
    (one for each possible ASCII character, 0&ndash;255).
  </li>
  <li>Each time a character appeared, I incremented its count in the array.</li>
</ul>


    <strong>
      This frequency table is the foundation of efficient compression!
    </strong>{" "}
    This character frequency chart displays every character and its frequency from your input file, providing a complete overview of your data.

   
      <br/>💡 <span style={{ fontStyle: "italic", fontWeight:"bold"}}> For clarity and readability in the steps ahead, I&apos;ll be showcasing only the first 20 characters &mdash; so we won&apos;t be overwhelmed by a massive wall of text!
    </span>
  </div>,

  <div key="first20Raw" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
    
    <strong style={{ display: "block", marginBottom: 8 }}>
     👀 PREVIEW: THE FIRST 20 RAW CHARACTERS
    </strong>
    Here are the first 20 characters from your file, shown exactly as they appear in the raw data.{" "}
    <em>Depending on your file, you might see only normal, readable text&mdash;or you might notice some &apos;weird&apos; or unreadable symbols.</em>

    These unusual symbols can appear if your file contains special control characters, formatting codes, or other non-printable bytes that aren&apos;t meant to be displayed as regular text.

    To keep things clear and easy to understand, I&apos;ll focus only on the{" "}
    <strong>first 20 readable characters</strong> (letters, numbers, punctuation, and spaces) in the steps ahead. This way, you&apos;ll always get a preview that&apos;s meaningful and easy to follow, no matter what kind of file you use!
  </div>,

  <div key="huffmanTree" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
   
    <strong style={{ display: "block", marginBottom: 8 }}>
      🌳 BUILDING THE HUFFMAN TREE
    </strong>
    With the frequency table ready, I jumped straight into the next phase:{" "}
    <em>This special binary tree (not a binary search tree!) is cleverly structured so that the most frequent characters end up closer to the root, which means their paths (and codes) are shorter and compression is more efficient!</em>

    • I took every character that showed up in your file and made it into a leaf node, each one labeled with its character and how often it appeared.
    • Then, like a matchmaker for bytes, I kept finding the two nodes with the lowest frequencies and merged them into a new parent node. This parent&rsquo;s frequency is simply the sum of its two children.
    • I repeated this merging process&mdash;always picking the two smallest&mdash;until only one node remained at the very top: the root of the Huffman tree.
  </div>,

  <div key="encodeData" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
   
    <strong style={{ display: "block", marginBottom: 8 }}>
      💾 CREATING THE BINARY CODE
    </strong>
    With the Huffman tree built, I assigned a unique binary code to each character in your file:{" "}
    <em>Every left move adds a &lsquo;0&rsquo;, every right move adds a &lsquo;1&rsquo; to the code.</em>

    For every character in your file, I traced a path from the root of the tree down to that character&rsquo;s leaf node. This traversal produces a distinct sequence of bits (0s and 1s) for each character based on its path through the tree. By replacing every character in your data with its binary code, I transformed your original text into a long, compressed stream of bits&mdash;ready for the next stage!
  </div>,

  <div key="packBinaryData" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
   
    <strong style={{ display: "block", marginBottom: 8 }}>
      📦 GROUPING THE BINARY CODE INTO BYTES
    </strong>
    Now that your entire message is represented as a continuous stream of 0s and 1s, I prepared it for storage as a file:{" "}
    <em>I grouped the bits into bytes, padding zeros if needed, and wrote them to the compressed file.</em>

    I also converted these bytes into hexadecimal numbers for display and debugging purposes.
  </div>,

  <div key="compressionResults" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
   
    <strong style={{ display: "block", marginBottom: 8 }}>
     📦 COMPRESSED OUTPUT (HEX): ACTUAL FILE RESULT
    </strong>
    The original file you uploaded had a size of originalSize bytes. After compressing it, the size is now compressedSize bytes.

    That means the compression ratio is ratio%.

    Your compressed file has been automatically saved in your project folder.

    Below is the actual compressed output for your entire file, shown in hexadecimal&mdash;this is the true content of your file, not just the preview used for animation.
  </div>,

  <div key="readyToRestore" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
    <strong style={{ fontWeight: "bold", color: colorStyles.darkGreen, display: "block", marginBottom: 8 }}>
      READY TO RESTORE YOUR FILE!?
    </strong>
    ⬅️ Click the &quot;Decompress&quot; button to begin! ⬅️

    ⬇️ Or click the &quot;Next&quot; button to continue with just the first 20 characters. ⬇️
  </div>,

  <div key="decompressionComplete" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
   
    <strong style={{ display: "block", marginBottom: 8 }}>
      ✅ DECOMPRESSION COMPLETE!
    </strong>
  ✨ Your file has been fully restored. Every letter, space, and symbol is now back in its original place&mdash;thanks to the magic of Huffman coding! ✨
  </div>,

  <div key="decompressionTreeExplanation" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
   
    <strong style={{ display: "block", marginBottom: 8 }}>
      🌳 REMEMBER THAT HUFFMAN TREE WE BUILT DURING COMPRESSION?
    </strong>
    I just put it to work! Here&rsquo;s how your file was restored:

    • I read the compressed file bit by bit, following each &#39;0&#39; and &#39;1&#39; through the Huffman tree.
    • Every time I reached a leaf node, I uncovered one of your original characters and added it to the output.
    • This process continued until your entire file was rebuilt, character by character, exactly as it was before compression.

    Thanks to the power of Huffman coding, not a single letter, space, or symbol was lost or changed. Your data is safe and sound!

    You can now open your restored file and see your original content, perfectly reconstructed.
  </div>,

  <div key="decompressionResults" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
   
    <strong style={{ display: "block", marginBottom: 8 }}>
       🔓 DECOMPRESSION RESULTS: YOUR FILE IS BACK!
    </strong>
    Your file has been fully restored and saved in your project files.

    Every letter, space, and symbol is back in its original place&mdash;no data lost, no changes made!

    You can now open this new file to see your original content, perfectly reconstructed and ready to use.
  </div>,

  <div key="finalConclusion" style={{ whiteSpace: "pre-line", fontSize: "0.8rem" }}>
   
    <strong style={{ display: "block", marginBottom: 8 }}>
      🏁 ALL DONE! YOU&apos;VE MASTERED HUFFMAN COMPRESSION
    </strong>

    🤝 What a journey! Together, we:

    • Explored your file&rsquo;s characters and counted how often each one appeared.
    • Built a Huffman tree, merging nodes step by step until just one remained at the top.
    • Created unique binary codes for each character, making your data as compact as possible.
    • Packed all those bits into real bytes, ready for storage or sharing.
    • And finally, decompressed your file&mdash;restoring every letter, space, and symbol, perfectly intact!

    <br/><br/>💡 Huffman coding is a powerful tool, and now you&rsquo;ve seen it in action&mdash;from start to finish!

    Thank you for exploring data compression with me. If you want to try again, just upload or click on a new file to replay the animation!

  
    <br/><p style={{textAlign:"center"}}>👋 This is the end of our journey&mdash;for now. Until next time, happy compressing!</p>
  </div>,
];

export default function NarrationPanel({ currentIndex }: NarrationPanelProps) {
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
