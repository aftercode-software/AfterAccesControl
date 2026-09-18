import SelectField from "@/components/ui/SelectField";

export default function CustomPicker({
  arrayOpciones,
  tittle,
  placeholder,
  value,
  onChangeText,
}: {
  className?: string;
  arrayOpciones: string[];
  tittle: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <SelectField
      label={tittle}
      onValueChange={onChangeText}
      options={arrayOpciones}
      placeholder={placeholder}
      value={value}
    />
  );
}
