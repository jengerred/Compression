"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface HuffmanTreeNode {
  char?: string;
  freq: number;
  left?: HuffmanTreeNode;
  right?: HuffmanTreeNode;
  x?: number;
  y?: number;
  depth?: number;
  _layoutRadius?: number;
}

interface HuffmanCodePathAnimationProps {
  tree: HuffmanTreeNode;
  onBinaryReady?: (binary: string) => void; // optional callback for next step
}

function buildCodeTable(
  node: HuffmanTreeNode | null,
  prefix = "",
  table: Record<string, string> = {}
): Record<string, string> {
  if (!node) return table;
  if (!node.left && !node.right && node.char) table[node.char] = prefix;
  if (node.left) buildCodeTable(node.left, prefix + "0", table);
  if (node.right) buildCodeTable(node.right, prefix + "1", table);
  return table;
}

function findPathToChar(
  node: HuffmanTreeNode,
  targetChar: string,
  path: ("left" | "right")[] = [],
  nodes: HuffmanTreeNode[] = []
): { directions: ("left" | "right")[]; nodes: HuffmanTreeNode[] } | null {
  if (!node.left && !node.right && node.char === targetChar) {
    return { directions: path, nodes: [...nodes, node] };
  }
  if (node.left) {
    const res = findPathToChar(node.left, targetChar, [...path, "left"], [
      ...nodes,
      node,
    ]);
    if (res) return res;
  }
  if (node.right) {
    const res = findPathToChar(node.right, targetChar, [...path, "right"], [
      ...nodes,
      node,
    ]);
    if (res) return res;
  }
  return null;
}

function getAllLeafChars(root: HuffmanTreeNode): string[] {
  const res: string[] = [];
  function walk(node: HuffmanTreeNode | undefined) {
    if (!node) return;
    if (!node.left && !node.right && node.char) res.push(node.char);
    if (node.left) walk(node.left);
    if (node.right) walk(node.right);
  }
  walk(root);
  return res;
}

function getAllNodes(
  node: HuffmanTreeNode | undefined,
  arr: HuffmanTreeNode[] = []
): HuffmanTreeNode[] {
  if (!node) return arr;
  arr.push(node);
  if (node.left) getAllNodes(node.left, arr);
  if (node.right) getAllNodes(node.right, arr);
  return arr;
}

function colorForNode(node: HuffmanTreeNode): THREE.Color {
  if (!node.left && !node.right) {
    // Leaves: blue
    return new THREE.Color("blue");
  }
  const hue = (node.depth! * 70) % 360;
  return new THREE.Color(`hsl(${hue}, 80%, 45%)`);
}

const HIGHLIGHT_PURPLE = "#cc66ff";
const PATH_HIGHLIGHT = new THREE.Color(HIGHLIGHT_PURPLE);
const PATH_PINK = new THREE.Color("#ff0099");
const EDGE_COLOR = 0x333333;

function createNodeRadialGradient(size = 128): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);

  const gradient = ctx.createRadialGradient(
    size/2, size/2, size*0.09,
    size/2, size/2, size/2
  );
  gradient.addColorStop(0, HIGHLIGHT_PURPLE);
  gradient.addColorStop(0.55, "#ff0099");
  gradient.addColorStop(0.75, "rgba(255,0,153,0.23)");
  gradient.addColorStop(0.90, "rgba(255,0,153,0.07)");
  gradient.addColorStop(1, "rgba(255,0,153,0)");
  ctx.fillStyle = gradient;
  ctx.globalAlpha = 1.0;
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI*2);
  ctx.fill();

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const HuffmanCodePathAnimation: React.FC<HuffmanCodePathAnimationProps> = ({
  tree,
  onBinaryReady,
}) => {
  const charsForAnimation = React.useMemo(
    () => getAllLeafChars(tree).slice(0, 20),
    [tree]
  );
  const codeTable = React.useMemo(() => buildCodeTable(tree), [tree]);
  const [charIdx, setCharIdx] = useState(0);
  const [pathStep, setPathStep] = useState(1);

  const mountRef = useRef<HTMLDivElement | null>(null);

  const labelsContainerRef = useRef<HTMLDivElement | null>(null);
  const labelDivsRef = useRef<{ node: HuffmanTreeNode; div: HTMLDivElement }[]>(
    []
  );
 const nodeSpriteTexRef = useRef<THREE.Texture | null>(null);


  const NODE_RADIUS = tree._layoutRadius ?? 0.7;

  const char = charsForAnimation[charIdx];
  const code = codeTable[char] || "";
  const pathInfo = char
    ? findPathToChar(tree, char)
    : { directions: [], nodes: [] };
  const pathDirections = pathInfo ? pathInfo.directions : [];
  const pathNodes = pathInfo ? pathInfo.nodes : [];
  const highlightLen = Math.min(pathStep, pathDirections.length);
  const highlightNodes = pathNodes.slice(0, highlightLen + 1);
  const highlightDirections = pathDirections.slice(0, highlightLen);

  let accumulated = "";
  for (let i = 0; i < charIdx; ++i) {
    accumulated += codeTable[charsForAnimation[i]] || "";
  }
  const currentCharAnimated = code.substring(0, highlightLen);

  // This is your up-to-date binary string, ready anytime for your next steps:
  const binaryString = accumulated + currentCharAnimated;

  // Optional: notify parent on update if onBinaryReady provided
  useEffect(() => {
    if (typeof onBinaryReady === "function") {
      onBinaryReady(binaryString);
    }
  }, [binaryString, onBinaryReady]);

  useEffect(() => {
    if (!char) return;
    if (highlightLen < pathDirections.length) {
      const timer = setTimeout(() => setPathStep(pathStep + 1), 750);
      return () => clearTimeout(timer);
    } else if (charIdx < charsForAnimation.length - 1) {
      const timer = setTimeout(() => {
        setCharIdx(charIdx + 1);
        setPathStep(1);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [
    highlightLen,
    pathDirections.length,
    charIdx,
    charsForAnimation.length,
    pathStep,
    char,
  ]);

  useEffect(() => {
    if (!mountRef.current || !tree) return;
    const container = mountRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    // Sprite gradient for node glow
    if (!nodeSpriteTexRef.current) {
      nodeSpriteTexRef.current = createNodeRadialGradient(128);
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7fc);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 10, 30);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.target.set(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Overlay labels
    const labelsContainer = document.createElement("div");
    labelsContainer.style.position = "absolute";
    labelsContainer.style.top = "0";
    labelsContainer.style.left = "0";
    labelsContainer.style.width = "100%";
    labelsContainer.style.height = "100%";
    labelsContainer.style.pointerEvents = "none";
    container.style.position = "relative";
    container.appendChild(labelsContainer);
    labelsContainerRef.current = labelsContainer;

    labelDivsRef.current = getAllNodes(tree).map((node) => {
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.color = "#eee";
      div.style.fontWeight = "bold";
      div.style.fontSize = "0.65rem";
      div.style.padding = "1px";
      div.style.transform = "translate(-50%, -50%)";
      div.style.whiteSpace = "nowrap";
      div.textContent = node.char
        ? `${node.char} : ${node.freq}`
        : `${node.freq}`;
      labelsContainer.appendChild(div);
      return { node, div };
    });

    function drawEdges(node: HuffmanTreeNode) {
      if (!node) return;
      // LEFT edge
      if (node.left) {
        let isHighlight = false;
        for (let i = 0; i < highlightDirections.length; ++i) {
          if (highlightNodes[i] === node && highlightDirections[i] === "left")
            isHighlight = true;
        }
        const start = new THREE.Vector3(node.x!, node.y!, 0);
        const end = new THREE.Vector3(node.left.x!, node.left.y!, 0);

        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        if (isHighlight) {
          const colors = [
            PATH_HIGHLIGHT.r, PATH_HIGHLIGHT.g, PATH_HIGHLIGHT.b,
            PATH_PINK.r, PATH_PINK.g, PATH_PINK.b
          ];
          geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        }
        scene.add(
          new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
              color: isHighlight ? 0xffffff : EDGE_COLOR,
              linewidth: 2,
              vertexColors: isHighlight ? true : false
            })
          )
        );
      }
      // RIGHT edge
      if (node.right) {
        let isHighlight = false;
        for (let i = 0; i < highlightDirections.length; ++i) {
          if (highlightNodes[i] === node && highlightDirections[i] === "right")
            isHighlight = true;
        }
        const start = new THREE.Vector3(node.x!, node.y!, 0);
        const end = new THREE.Vector3(node.right.x!, node.right.y!, 0);

        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        if (isHighlight) {
          const colors = [
            PATH_HIGHLIGHT.r, PATH_HIGHLIGHT.g, PATH_HIGHLIGHT.b,
            PATH_PINK.r, PATH_PINK.g, PATH_PINK.b
          ];
          geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        }
        scene.add(
          new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
              color: isHighlight ? 0xffffff : EDGE_COLOR,
              linewidth: 2,
              vertexColors: isHighlight ? true : false
            })
          )
        );
      }
      if (node.left) drawEdges(node.left);
      if (node.right) drawEdges(node.right);
    }

    let running = true;
    function animate() {
      if (!running) return;
      controls.update();
      while (scene.children.length > 2) {
        const obj = scene.children[scene.children.length - 1];
        scene.remove(obj);
      }
      drawEdges(tree);

      getAllNodes(tree).forEach((node) => {
        const isHighlight = highlightNodes.includes(node);
        const color = isHighlight ? HIGHLIGHT_PURPLE : colorForNode(node).getStyle();
        const mat = new THREE.MeshPhongMaterial({
          color,
          emissive: 0x101318,
          shininess: 12,
        });
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(NODE_RADIUS, 20, 20),
          mat
        );
        sphere.position.set(node.x!, node.y!, 0);
        scene.add(sphere);

        if (isHighlight && nodeSpriteTexRef.current) {
          const spriteMaterial = new THREE.SpriteMaterial({
            map: nodeSpriteTexRef.current,
            blending: THREE.NormalBlending,
            depthWrite: false,
            transparent: true,
            opacity: 0.29
          });
          const sprite = new THREE.Sprite(spriteMaterial);
          sprite.center.set(0.5, 0.5);
          sprite.scale.set(NODE_RADIUS * 3.4, NODE_RADIUS * 3.4, 1);
          sprite.position.set(node.x!, node.y!, 0.02);
          scene.add(sprite);
        }
      });

      renderer.render(scene, camera);

      if (camera && labelsContainer && container) {
        const w = container.clientWidth,
          h = container.clientHeight;
        labelDivsRef.current.forEach(({ node, div }) => {
          const pos = new THREE.Vector3(node.x!, node.y!, 0);
          pos.project(camera);
          const x = ((pos.x + 1) / 2) * w;
          const y = ((-pos.y + 1) / 2) * h;
          div.style.left = `${x}px`;
          div.style.top = `${y}px`;
          div.style.display = pos.z < 1 ? "block" : "none";
        });
      }

      requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      if (mountRef.current && camera) {
        const w = mountRef.current.clientWidth,
          h = mountRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    }
    window.addEventListener("resize", handleResize);

    return () => {
      running = false;
      window.removeEventListener("resize", handleResize);
      labelDivsRef.current.forEach(({ div }) => {
        if (labelsContainerRef.current)
          labelsContainerRef.current.removeChild(div);
      });
      if (
        labelsContainerRef.current &&
        container.contains(labelsContainerRef.current)
      ) {
        container.removeChild(labelsContainerRef.current);
      }
      renderer.dispose();
      controls.dispose();
      if (container && renderer.domElement.parentElement === container)
        container.removeChild(renderer.domElement);
    };
  }, [
    tree,
    charIdx,
    pathStep,
    highlightNodes,
    highlightDirections,
    NODE_RADIUS,
  ]);

  return (
    <div style={{ position: "relative", width: "100%", height: "600px" }}>
      <div style={{ marginBottom: 8 }}>
        <b>Character:</b>{" "}
        <span style={{ fontSize: "1.19em" }}>{char}</span>
        &nbsp;|&nbsp;
        <b>Code stream:</b>{" "}
        <code style={{ fontSize: "1.13em", fontFamily: "monospace" }}>
          <span style={{ color: "#aaa" }}>{accumulated}</span>
          <span style={{ color: HIGHLIGHT_PURPLE }}>{currentCharAnimated}</span>
        </code>
      </div>
      <div
        ref={mountRef}
        style={{ width: "100%", height: "100%", position: "relative" }}
      />
    </div>
  );
};

export default HuffmanCodePathAnimation;
