import "@/global.css";
import { ButtonText,Button } from "@/components/ui/button";
import { FormControl, FormControlLabel, FormControlLabelText, FormControlHelper, FormControlHelperText, FormControlError, FormControlErrorIcon, FormControlErrorText } from "@/components/ui/form-control";
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { View,Text } from "react-native";

export default function Login () {
  const [showPassword, setShowPassword] = React.useState(false)
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }
  function setShowModal(arg0: boolean) {
    throw new Error("Function not implemented.");
  }

    return (
     <GluestackUIProvider mode="light">
      <View className="flex items-center justify-center h-full">
    <FormControl className="p-4 border rounded-lg border-outline-300">
      <VStack space="xl">
        <VStack space="xs">
          <Text className="text-typography-500">Email</Text>
          <Input className="min-w-[250px]">
            <InputField type="text" />
          </Input>
        </VStack>
        <VStack space="xs">
          <Text className="text-typography-500">Password</Text>
          <Input className="text-center">
            <InputField type={showPassword ? "text" : "password"} />
            <InputSlot className="pr-3" onPress={handleState}>
              <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
            </InputSlot>
          </Input>
        </VStack>
        <Button
          className="ml-auto"
          onPress={() => {
            setShowModal(false)
          }}
        >
          <ButtonText className="text-typography-0">Save</ButtonText>
        </Button>
      </VStack>
    </FormControl>
    </View>
    </GluestackUIProvider>
  )
}