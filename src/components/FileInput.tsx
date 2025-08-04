interface FileInputProps {
  onLoad: (content: string) => void;
}

export default function FileInput({ onLoad }: FileInputProps) {
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
    <div>
      <label>
        Choose file:{" "}
        <input type="file" accept=".txt" onChange={handleFileChange} />
      </label>
    </div>
  );
}
