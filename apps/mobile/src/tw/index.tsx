import type { ComponentProps, ComponentType, ElementType } from "react";
import {
  Pressable as CssPressable,
  ScrollView as CssScrollView,
  Text as CssText,
  TextInput as CssTextInput,
  View as CssView,
} from "react-native-css/components";

export { Link } from "expo-router";

type WithClassName<Props> = Props & {
  className?: string;
};

type CssComponent<Component extends ElementType> = ComponentType<
  WithClassName<ComponentProps<Component>>
>;

export const View = CssView as unknown as CssComponent<typeof CssView>;
export const Text = CssText as unknown as CssComponent<typeof CssText>;
export const Pressable = CssPressable as unknown as CssComponent<typeof CssPressable>;
export const TextInput = CssTextInput as unknown as CssComponent<typeof CssTextInput>;
export const ScrollView = CssScrollView as unknown as ComponentType<
  WithClassName<ComponentProps<typeof CssScrollView>> & {
    contentContainerClassName?: string;
  }
>;
