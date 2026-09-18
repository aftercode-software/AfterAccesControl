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
import { Pressable, View, TextInput } from "react-native";

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

const Select = React.forwardRef<any, any>(({ className, ...props }, ref) => {
  return (
    <UISelect
      ref={ref}
      {...props}
      className={`flex-row items-center overflow-hidden border border-line px-3 h-12 ${className || ""}`}
    />
  );
});

const SelectTrigger = React.forwardRef<any, any>(({ className, ...props }, ref) => {
  return (
    <UISelect.Trigger
      ref={ref}
      {...props}
      className={`flex-1 flex-row items-center ${className || ""}`}
    />
  );
});

const SelectInput = React.forwardRef<any, any>(({ className, ...props }, ref) => {
  return (
    <UISelect.Input
      ref={ref}
      {...props}
      className={`flex-1 px-2 font-inter text-base text-slate ${className || ""}`}
    />
  );
});

const SelectIcon = React.forwardRef<any, any>(({ className, ...props }, ref) => {
  return (
    <UISelect.Icon
      ref={ref}
      {...props}
      className={`h-6 w-6 text-slate ${className || ""}`}
    />
  );
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
