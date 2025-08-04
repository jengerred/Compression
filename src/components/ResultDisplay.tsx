interface ResultDisplayProps {
  result: string;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  return (
    <div
      style={{
        marginTop: 30,
        background: "#f3f3f3",
        padding: 10,
        whiteSpace: "pre-wrap",
        fontFamily: "monospace",
        maxHeight: 300,
        overflowY: "auto",
        border: "1px solid #ccc",
      }}
    >
      <strong>Output:</strong>
      <pre>{result}</pre>
    </div>
  );
}
