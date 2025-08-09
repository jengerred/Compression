interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
    style?: React.CSSProperties;
}

export default function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div>
      <textarea
        rows={6}
        cols={60}
        placeholder="Type or paste here, or upload a file above..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", borderTop: "1.5px solid grey", backgroundColor: "white", marginTop: "-0.5rem" }}
      />
    </div>
  );
}
