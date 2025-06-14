"use client";

import React from "react";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { PrimitiveIcon, UIIcon } from "@gluestack-ui/icon";
import {
  withStyleContext,
  useStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { createSelect } from "@gluestack-ui/select";
import { cssInterop } from "nativewind";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
  ActionsheetScrollView,
  ActionsheetVirtualizedList,
  ActionsheetFlatList,
  ActionsheetSectionList,
  ActionsheetSectionHeaderText,
} from "./select-actionsheet";
import { Pressable, View, TextInput, StyleSheet } from "react-native";

const SelectTriggerWrapper = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  React.ComponentProps<typeof Pressable>
>(({ ...props }, ref) => {
  return <Pressable {...props} ref={ref} />;
});

const UISelect = createSelect(
  {
    Root: View,
    Trigger: withStyleContext(SelectTriggerWrapper),
    Input: TextInput,
    Icon: UIIcon,
  },
  {
    Portal: Actionsheet,
    Backdrop: ActionsheetBackdrop,
    Content: ActionsheetContent,
    DragIndicator: ActionsheetDragIndicator,
    DragIndicatorWrapper: ActionsheetDragIndicatorWrapper,
    Item: ActionsheetItem,
    ItemText: ActionsheetItemText,
    ScrollView: ActionsheetScrollView,
    VirtualizedList: ActionsheetVirtualizedList,
    FlatList: ActionsheetFlatList,
    SectionList: ActionsheetSectionList,
    SectionHeaderText: ActionsheetSectionHeaderText,
  }
);

cssInterop(UISelect, { className: "style" });
cssInterop(UISelect.Input, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
});
cssInterop(SelectTriggerWrapper, { className: "style" });

cssInterop(PrimitiveIcon, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: true,
      width: true,
      fill: true,
      color: "classNameColor",
      stroke: true,
    },
  },
});

const Select = React.forwardRef((props, ref) => {
  return <UISelect style={styles.select} ref={ref} {...props} />;
});

const SelectTrigger = React.forwardRef((props, ref) => {
  return <UISelect.Trigger style={styles.trigger} ref={ref} {...props} />;
});

const SelectInput = React.forwardRef((props, ref) => {
  return <UISelect.Input style={styles.input} ref={ref} {...props} />;
});

const SelectIcon = React.forwardRef((props, ref) => {
  return <UISelect.Icon style={styles.icon} ref={ref} {...props} />;
});

const styles = StyleSheet.create({
  select: {
    borderWidth: 1,
    borderColor: "#606060",
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 48, // Altura consistente con el Input
  },
  trigger: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: "#606060",
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    paddingHorizontal: 8,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: "#606060", // Color del ícono
  },
});

Select.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectInput.displayName = "SelectInput";
SelectIcon.displayName = "SelectIcon";

// Actionsheet Components
const SelectPortal = UISelect.Portal;
const SelectBackdrop = UISelect.Backdrop;
const SelectContent = UISelect.Content;
const SelectDragIndicator = UISelect.DragIndicator;
const SelectDragIndicatorWrapper = UISelect.DragIndicatorWrapper;
const SelectItem = UISelect.Item;
const SelectScrollView = UISelect.ScrollView;
const SelectVirtualizedList = UISelect.VirtualizedList;
const SelectFlatList = UISelect.FlatList;
const SelectSectionList = UISelect.SectionList;
const SelectSectionHeaderText = UISelect.SectionHeaderText;

export {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
  SelectVirtualizedList,
  SelectFlatList,
  SelectSectionList,
  SelectSectionHeaderText,
};
