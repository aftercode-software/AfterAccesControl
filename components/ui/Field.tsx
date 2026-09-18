import { ReactNode, useState } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "@/styles/tokens";

type FieldProps = TextInputProps & {
  label: string;
  hint?: string;
  rightElement?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
};

export default function Field({
  label,
  hint,
  rightElement,
  containerClassName = "",
  inputClassName = "",
  multiline,
  onFocus,
  onBlur,
  ...inputProps
}: FieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className={containerClassName}>
      <View className="mb-[7px] flex-row items-center justify-between">
        <Text className="font-inter-medium text-[11px] tracking-[0.15px] text-slate">
          {label}
        </Text>
        {hint ? (
          <Text className="font-inter text-[10px] text-slate-muted">{hint}</Text>
        ) : null}
      </View>
      <View
        className={`min-h-[52px] flex-row items-center gap-2 border bg-white px-4 ${
          multiline ? "items-stretch min-h-[112px]" : ""
        } ${focused ? "border-ink" : "border-line"}`}
      >
        <TextInput
          {...inputProps}
          className={`min-h-[50px] flex-1 p-0 font-inter text-[15px] text-ink ${
            multiline ? "min-h-[100px] pt-[14px]" : ""
          } ${inputClassName}`}
          multiline={multiline}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={colors.slateMuted}
          textAlignVertical={multiline ? "top" : "auto"}
        />
        {rightElement}
      </View>
    </View>
  );
}
