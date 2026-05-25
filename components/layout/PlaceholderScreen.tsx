import { Text, View } from "@/src/tw";

type PlaceholderScreenProps = {
  title: string;
  description?: string;
};

export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  return (
    <View className="flex-1 bg-neo-background px-5 py-16">
      <View className="rounded-lg border border-neo-border bg-neo-surface p-4">
        <Text className="text-[22px] font-bold leading-7 text-neo-text">{title}</Text>
        {description ? (
          <Text className="mt-2 text-[15px] leading-6 text-neo-text-muted">
            {description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
