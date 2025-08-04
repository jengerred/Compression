interface ResultDisplayProps {
  result: string;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  return (
    <div style={{ marginTop: 30, background: "#f3f3f3", padding: 10, whiteSpace: "pre-wrap" }}>
      <strong>Output:</strong>
      <pre>{result}</pre>
    </div>
  );
}
