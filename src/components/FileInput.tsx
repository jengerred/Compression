interface FileInputProps {
  onLoad: (content: string) => void;
  style?: React.CSSProperties;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}


export default function FileInput({ onLoad, style, inputProps }: FileInputProps) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        onLoad(text);
      }
    };
    reader.readAsText(file);
  }

  return (
    <input
      type="file"
      accept=".txt"
      onChange={handleFileChange}
      style={style}
      {...inputProps}
    />
  );
}
