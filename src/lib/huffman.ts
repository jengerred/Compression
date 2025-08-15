export type HuffmanNode = {
  char?: string;
  freq: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
};

// Count character frequencies
export function getFrequencies(text: string): Map<string, number> {
  const freqMap = new Map<string, number>();
  for (const ch of text) {
    freqMap.set(ch, (freqMap.get(ch) || 0) + 1);
  }
  return freqMap;
}

// Build Huffman tree
export function buildTree(freqMap: Map<string, number>): HuffmanNode {
  const nodes: HuffmanNode[] = [];
  freqMap.forEach((freq, char) => nodes.push({ char, freq }));

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    nodes.push({ freq: left.freq + right.freq, left, right });
  }

  return nodes[0];
}

// Generate codes from tree
export function generateCodes(
  node: HuffmanNode,
  prefix = "",
  codes: Map<string, string> = new Map()
): Map<string, string> {
  if (node.char !== undefined) codes.set(node.char, prefix);
  else {
    if (node.left) generateCodes(node.left, prefix + "0", codes);
    if (node.right) generateCodes(node.right, prefix + "1", codes);
  }
  return codes;
}

// Compress text
export function compress(text: string): { compressed: string; tree: HuffmanNode } {
  const freqMap = getFrequencies(text);
  const tree = buildTree(freqMap);
  const codes = generateCodes(tree);

  let compressed = "";
  for (const ch of text) compressed += codes.get(ch);

  return { compressed, tree };
}

// Decompress string (needs full tree)
export function decompress(compressed: string, tree: HuffmanNode): string {
  let result = "";
  let node = tree;
  for (const bit of compressed) {
    node = bit === "0" ? node.left! : node.right!;
    if (node.char !== undefined) {
      result += node.char;
      node = tree;
    }
  }
  return result;
}

// Converts bitstring to Uint8Array (bit packing)
export function bitsToBytes(bitString: string): Uint8Array {
  const bytes = new Uint8Array(Math.ceil(bitString.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    const byteBits = bitString.slice(i * 8, i * 8 + 8).padEnd(8, "0");
    bytes[i] = parseInt(byteBits, 2);
  }
  return bytes;
}


// Converts Uint8Array to hex string for display
export function toHex(byteArr: Uint8Array): string {
  return Array.from(byteArr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

