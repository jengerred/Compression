interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
    style?: React.CSSProperties;
      readOnly?: boolean;
        placeholder?: string;
          disabled?: boolean; 
}

export default function TextInput({ 
  value, 
  onChange, 
  readOnly = false, 
  style, 
  placeholder = "Type or paste here, or upload a file above...",
    disabled = false
}: TextInputProps) {
  return ( 
    <div>
      <textarea
          rows={6}
        cols={60}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
                disabled={disabled}
   style={{
          width: "100%",
          borderTop: "1.5px solid grey",
          backgroundColor: "white",
          marginTop: "-0.5rem",
          ...style,
        }}
      />
    </div>
  );
}
