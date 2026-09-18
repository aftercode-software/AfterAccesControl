import { useState } from "react";
import {
  ChevronDown,
  Check,
  X,
} from "lucide-react-native";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { colors } from "@/styles/tokens";

export default function SelectField({
  label,
  value,
  options,
  placeholder = "Seleccionar",
  onValueChange,
  containerClassName = "",
  optionLabels,
}: {
  label: string;
  value: string;
  options: readonly string[];
  placeholder?: string;
  onValueChange: (value: string) => void;
  containerClassName?: string;
  optionLabels?: Record<string, string>;
}) {
  const [isVisible, setIsVisible] = useState(false);

  const getLabel = (option: string) =>
    optionLabels?.[option] || option.charAt(0).toUpperCase() + option.slice(1);

  const selectedLabel = value ? getLabel(value) : placeholder;

  const closeModal = () => setIsVisible(false);

  const handleSelect = (nextValue: string) => {
    onValueChange(nextValue);
    closeModal();
  };

  return (
    <View className={containerClassName}>
      <Text className="mb-[7px] font-inter-medium text-[11px] text-slate">
        {label}
      </Text>
      <Pressable
        accessibilityLabel={`${label}: ${selectedLabel}`}
        accessibilityRole="button"
        onPress={() => setIsVisible(true)}
        className="min-h-[52px] w-full flex-row items-center justify-between border border-line bg-white px-4 active:opacity-80"
      >
        <Text
          className={`flex-1 font-inter text-[14px] ${
            value ? "text-ink" : "text-slate-muted"
          }`}
          numberOfLines={1}
        >
          {selectedLabel}
        </Text>
        <ChevronDown color={colors.slate} size={17} strokeWidth={1.8} />
      </Pressable>

      <Modal
        animationType="slide"
        onRequestClose={closeModal}
        transparent
        visible={isVisible}
      >
        <View className="flex-1 justify-end bg-ink/40">
          <View className="max-h-[78%] min-h-[40%] bg-canvas px-[22px] pb-8 pt-6">
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="font-inter-semibold text-[24px] tracking-[-0.7px] text-ink">
                {label}
              </Text>
              <Pressable
                accessibilityLabel={`Cerrar ${label}`}
                accessibilityRole="button"
                onPress={closeModal}
                className="h-[34px] w-[34px] items-center justify-center border border-line active:opacity-70"
              >
                <X color={colors.ink} size={19} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Pressable
                accessibilityRole="button"
                onPress={() => handleSelect("")}
                className="min-h-[56px] flex-row items-center justify-between border-b border-line py-3 active:opacity-70"
              >
                <Text
                  className={`font-inter text-[14px] ${
                    value ? "text-slate" : "font-inter-semibold text-ink"
                  }`}
                >
                  {placeholder}
                </Text>
                {!value ? <Check color={colors.ink} size={17} /> : null}
              </Pressable>

              {options.map((option) => {
                const isSelected = value === option;

                return (
                  <Pressable
                    accessibilityRole="button"
                    key={option}
                    onPress={() => handleSelect(option)}
                    className="min-h-[56px] flex-row items-center justify-between border-b border-line py-3 active:opacity-70"
                  >
                    <Text
                      className={`font-inter text-[14px] ${
                        isSelected
                          ? "font-inter-semibold text-ink"
                          : "text-slate"
                      }`}
                    >
                      {getLabel(option)}
                    </Text>
                    {isSelected ? <Check color={colors.ink} size={17} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
