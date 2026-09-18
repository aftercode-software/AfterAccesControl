import Field from "@/components/ui/Field";

export default function CustomInput({
  tittle,
  placeholder,
  value,
  onChangeText,
}: {
  tittle: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <Field
      label={tittle}
      onChangeText={onChangeText}
      placeholder={placeholder}
      value={value}
    />
  );
}
