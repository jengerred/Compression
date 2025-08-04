interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
}

export default function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div>
      <textarea
        rows={6}
        cols={60}
        placeholder="Or paste text here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", marginTop: 10 }}
      />
    </div>
  );
}
