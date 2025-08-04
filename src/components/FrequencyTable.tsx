interface FrequencyTableProps {
  frequencyMap: Map<string, number>;
}

export default function FrequencyTable({ frequencyMap }: FrequencyTableProps) {
  const entries = Array.from(frequencyMap.entries());
  return (
    <div
      style={{
        height: "200px",
        overflowY: "scroll",
        border: "1px solid black",
        marginTop: 20,
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: 8 }}>Character</th>
            <th style={{ border: "1px solid black", padding: 8 }}>Frequency</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(([char, freq], idx) => (
            <tr key={idx}>
              <td style={{ border: "1px solid black", padding: 8, fontFamily: "monospace" }}>
                {char === " " ? "<space>" : char === "\n" ? "<newline>" : char}
              </td>
              <td style={{ border: "1px solid black", padding: 8 }}>{freq}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
