"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// OrbitControls requires a separate import from three/examples
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface HuffmanTreeNode {
  char?: string;
  freq: number;
  left?: HuffmanTreeNode;
  right?: HuffmanTreeNode;
  x?: number;
  y?: number;
  depth?: number;
}

interface HuffmanTree3DProps {
  inputText: string;
    onTreeBuilt?: (tree: HuffmanTreeNode) => void; 
}

function buildHuffmanTree(freqMap: Map<string, number>): HuffmanTreeNode | null {
  const nodes: HuffmanTreeNode[] = [];
  freqMap.forEach((freq, char) => {
    nodes.push({ char, freq });
  });
  if (nodes.length === 0) return null;
  if (nodes.length === 1) return nodes[0];

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    nodes.push({ freq: left.freq + right.freq, left, right });
  }
  return nodes[0];
}

// Recursive layout with base spacing 1.0 on bottom row
function computePositions(node: HuffmanTreeNode | undefined, depth = 0, xPos = 0): number {
  if (!node) return xPos;
  node.depth = depth;

  if (!node.left && !node.right) {
    node.x = xPos;
    node.y = 10 - depth * 4;
    return xPos + 1.0;
  }

  const leftEnd = computePositions(node.left, depth + 1, xPos);
  const rightEnd = computePositions(node.right, depth + 1, leftEnd);

  node.x = (node.left!.x! + node.right!.x!) / 2;
  node.y = 10 - depth * 4;

  return rightEnd;
}

function centerTree(root: HuffmanTreeNode) {
  let minX = Infinity;
  let maxX = -Infinity;

  function traverse(node: HuffmanTreeNode | undefined) {
    if (!node) return;
    minX = Math.min(minX, node.x!);
    maxX = Math.max(maxX, node.x!);
    traverse(node.left);
    traverse(node.right);
  }
  traverse(root);

  const centerX = (minX + maxX) / 2;

  function shift(node: HuffmanTreeNode | undefined) {
    if (!node) return;
    node.x = node.x! - centerX;
    shift(node.left);
    shift(node.right);
  }
  shift(root);
}

export default function HuffmanTree3D({ inputText, onTreeBuilt }: HuffmanTree3DProps) {

  const mountRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<InstanceType<typeof OrbitControls> | null>(null);

  const [nodeLabels, setNodeLabels] = useState<
    { id: string; text: string; x: number; y: number }[]
  >([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const readableChars = Array.from(inputText)
      .filter((c) => c >= " " && c <= "~")
      .slice(0, 20);

    const freqMap = new Map<string, number>();
    readableChars.forEach((c) => freqMap.set(c, (freqMap.get(c) ?? 0) + 1));

    const huffmanRoot = buildHuffmanTree(freqMap);
    if (!huffmanRoot) return;

    computePositions(huffmanRoot);

    // Gather nodes by depth
    const levels: HuffmanTreeNode[][] = [];
    (function gather(node: HuffmanTreeNode) {
      if (!node) return;
      if (!levels[node.depth!]) levels[node.depth!] = [];
      levels[node.depth!].push(node);
      gather(node.left!);
      gather(node.right!);
    })(huffmanRoot);

    const bottomLevel = levels.length - 1;
    const bottomNodes = levels[bottomLevel];

    const containerWidth = mountRef.current.clientWidth;
    const containerHeight = mountRef.current.clientHeight;

    const maxAllowedWidth = Math.min(containerWidth, window.innerWidth) * 0.9;

    const xs = bottomNodes.map((n) => n.x!);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const naturalWidth = maxX - minX;

    const minWidth = 300;
    const baseRadius = 0.7;
    const radius = Math.min(Math.max((containerWidth / 600) * baseRadius, 0.15), 1.2);

    const spacing = radius * 2;

    let scaleX = 1;
    const pixelWidth = naturalWidth * spacing;

    if (pixelWidth > maxAllowedWidth) {
      scaleX = maxAllowedWidth / pixelWidth;
    } else if (pixelWidth < (bottomNodes.length - 1) * spacing) {
      scaleX = ((bottomNodes.length - 1) * spacing) / pixelWidth;
      scaleX = Math.min(scaleX, 1);
    }

    levels.forEach((levelNodes) => {
      levelNodes.forEach((node) => {
        node.x = node.x! * scaleX * spacing;
      });
    });

    centerTree(huffmanRoot);

(huffmanRoot as any)._layoutRadius = radius;
if (typeof onTreeBuilt === "function") {
  onTreeBuilt(JSON.parse(JSON.stringify(huffmanRoot)));
}

    const sphereGeo = new THREE.SphereGeometry(radius, 20, 20);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7fc);

    const camera = new THREE.PerspectiveCamera(
      45,
      containerWidth / containerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 10, 30);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerWidth, containerHeight);
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    controlsRef.current = new OrbitControls(camera, renderer.domElement);
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.05;
    controlsRef.current.enablePan = true;
    controlsRef.current.enableZoom = true;
    controlsRef.current.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    const treeGroup = new THREE.Group();
    scene.add(treeGroup);

    const meshMap = new Map<HuffmanTreeNode, THREE.Mesh>();
    const lineMap = new Map<HuffmanTreeNode, THREE.Line>();

    function colorForNode(node: HuffmanTreeNode): THREE.Color {
      if (!node.left && !node.right) {
        // Leaf nodes are purple
        return new THREE.Color("blue");
      }
      // Internal nodes colored by depth hue
      const hue = (node.depth! * 70) % 360;
      return new THREE.Color(`hsl(${hue}, 70%, 60%)`);
    }

    function createNodeMesh(node: HuffmanTreeNode): THREE.Mesh {
      const material = new THREE.MeshPhongMaterial({ color: colorForNode(node) });
      const mesh = new THREE.Mesh(sphereGeo, material);
      mesh.position.set(node.x!, node.y!, 0);
      mesh.visible = false;
      return mesh;
    }

    function createEdge(parent: HuffmanTreeNode, child: HuffmanTreeNode): THREE.Line {
      const start = new THREE.Vector3(parent.x!, parent.y!, 0);
      const end = new THREE.Vector3(child.x!, child.y!, 0);
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      const material = new THREE.LineBasicMaterial({ color: 0x333333 });
      const line = new THREE.Line(geometry, material);
      line.visible = false;
      return line;
    }

    levels.forEach((levelNodes) => {
      levelNodes.forEach((node) => {
        const mesh = createNodeMesh(node);
        meshMap.set(node, mesh);
        treeGroup.add(mesh);

        if (node.left) {
          const edge = createEdge(node, node.left);
          lineMap.set(node.left, edge);
          treeGroup.add(edge);
        }
        if (node.right) {
          const edge = createEdge(node, node.right);
          lineMap.set(node.right, edge);
          treeGroup.add(edge);
        }
      });
    });

    let currentLevel = bottomLevel;
    let pairIndex = 0;
    const highlightDuration = 90;
    let frameCount = 0;

    const visibleNodes = new Set<HuffmanTreeNode>();
    const visibleEdges = new Set<THREE.Line>();

    let secondRowShown = false;

    let highlightedMeshes: THREE.Mesh[] = [];
    let highlightedLines: THREE.Line[] = [];

    function setVisibility(showSecondRow: boolean) {
      levels.forEach((levelNodes, depth) => {
        levelNodes.forEach((node) => {
          const mesh = meshMap.get(node);
          if (!mesh) return;
          if (depth === bottomLevel) {
            mesh.visible = true;
            visibleNodes.add(node);
            return;
          }
          if (depth === bottomLevel - 1) {
            if (showSecondRow) {
              if (!node.left && !node.right) {
                mesh.visible = true;
                visibleNodes.add(node);
              } else {
                mesh.visible = visibleNodes.has(node);
              }
            } else {
              mesh.visible = visibleNodes.has(node);
            }
            return;
          }
          mesh.visible = visibleNodes.has(node);
        });
      });

      levels.forEach((levelNodes) => {
        levelNodes.forEach((node) => {
          ["left", "right"].forEach((side) => {
            const child = node[side as "left" | "right"];
            if (!child) return;
            const edge = lineMap.get(child);
            if (!edge) return;

            const mesh = meshMap.get(node);
            if (edge.visible) {
              visibleEdges.add(edge);
            }
            edge.visible = visibleEdges.has(edge) || (mesh ? mesh.visible : false);
          });
        });
      });
    }

    function highlightPair(nodes: HuffmanTreeNode[], idx: number) {
      highlightedMeshes.forEach((mesh) =>
        (mesh.material as THREE.MeshPhongMaterial).emissive.set(0)
      );
      highlightedLines.forEach((line) =>
        (line.material as THREE.LineBasicMaterial).color.set(0x333333)
      );

      highlightedMeshes = [];
      highlightedLines = [];

      const first = nodes[idx];
      const second = nodes[idx + 1];
      if (!first || !second) return;

      const mesh1 = meshMap.get(first);
      const mesh2 = meshMap.get(second);
      if (mesh1) {
        (mesh1.material as THREE.MeshPhongMaterial).emissive.set(0x00ff00);
        highlightedMeshes.push(mesh1);
      }
      if (mesh2) {
        (mesh2.material as THREE.MeshPhongMaterial).emissive.set(0x00ff00);
        highlightedMeshes.push(mesh2);
      }

      if (currentLevel > 0) {
        const parentLevel = levels[currentLevel - 1];
        for (const parent of parentLevel) {
          if (
            parent.left === first ||
            parent.right === first ||
            parent.left === second ||
            parent.right === second
          ) {
            const parentMesh = meshMap.get(parent);
            if (parentMesh) {
              parentMesh.visible = true;
              visibleNodes.add(parent);
              (parentMesh.material as THREE.MeshPhongMaterial).emissive.set(0xffff00);
              highlightedMeshes.push(parentMesh);
            }
            [first, second].forEach((child) => {
              const edge = lineMap.get(child);
              if (edge) {
                edge.visible = true;
                visibleEdges.add(edge);
                (edge.material as THREE.LineBasicMaterial).color.set(0x00ff00);
                highlightedLines.push(edge);
              }
            });
            break;
          }
        }
      }
    }

    setVisibility(false);

    function animate() {
      requestAnimationFrame(animate);
      frameCount++;

      if (controlsRef.current) controlsRef.current.update();

      if (!secondRowShown && frameCount > highlightDuration * 2) {
        secondRowShown = true;
        setVisibility(true);
        return;
      }

      if (secondRowShown && frameCount % highlightDuration === 0) {
        const levelNodes = levels[currentLevel];
        if (levelNodes) {
          highlightPair(levelNodes, pairIndex);
          pairIndex += 2;
          if (pairIndex >= levelNodes.length) {
            pairIndex = 0;
            currentLevel--;
            if (currentLevel < 0) {
              setVisibility(true);
              highlightedMeshes.forEach((mesh) =>
                (mesh.material as THREE.MeshPhongMaterial).emissive.set(0)
              );
              highlightedLines.forEach((line) =>
                (line.material as THREE.LineBasicMaterial).color.set(0x333333)
              );
              highlightedMeshes = [];
              highlightedLines = [];
              return;
            }
            setVisibility(true);
          }
        }
      }

      const labels: { id: string; text: string; x: number; y: number }[] = [];
      let labelId = 0;

      treeGroup.children.forEach((obj) => {
        if (obj instanceof THREE.Mesh && obj.visible) {
          const pos = obj.position.clone().project(camera);
          const x = ((pos.x + 1) / 2) * containerWidth;
          const y = ((-pos.y + 1) / 2) * containerHeight;

          for (const [node, mesh] of meshMap.entries()) {
            if (mesh === obj) {
              labels.push({ id: `label-${labelId++}`, text: node.char ? `${node.char} : ${node.freq}` : `${node.freq}`, x, y });
              break;
            }
          }
        }
      });
      setNodeLabels(labels);
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      if (renderer) {
        renderer.dispose();
        if (mountRef.current && renderer.domElement.parentElement === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
      if (controlsRef.current) controlsRef.current.dispose();
      setNodeLabels([]);
    };
}, [inputText, onTreeBuilt]);


  return (
    <div style={{ position: "relative", width: "100%", height: "600px" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      {nodeLabels.map(({ id, text, x, y }) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left: x,
            top: y,
            pointerEvents: "none",
            userSelect: "none",
            color: "white",
            fontWeight: "bold",
            fontSize: "0.65rem",
            padding: "1px",
            transform: "translate(-50%, -50%)",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      ))}
    </div>
  );
}
