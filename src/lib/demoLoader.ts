import { compress, getFrequencies, bitsToBytes } from "./huffman";
import type { HuffmanNode } from "./huffman";

export async function loadAndCompressDemo(which: "small" | "large"): Promise<{
  text: string;
  frequencyMap: Map<string, number>;
  tree: HuffmanNode;
  compressedBytes: Uint8Array;
}> {
  let url = "";
  if (which === "small") url = "/small-demo.txt";
  else if (which === "large") url = "/large-demo.txt";
  else throw new Error("Invalid demo type");

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to load demo file");

  const text = await response.text();

  const freq = getFrequencies(text);
  const { compressed, tree } = compress(text);
  const byteArr = bitsToBytes(compressed);

  return { text, frequencyMap: freq, tree, compressedBytes: byteArr };
}
