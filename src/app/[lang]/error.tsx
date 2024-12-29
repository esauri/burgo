"use client";

import { MainContent } from "~/components/MainContent";
import { Text } from "~/components/Text";

export default function ErrorPage() {
  return (
    <MainContent>
      <Text variant="title-sm">Sorry, something went wrong</Text>
    </MainContent>
  );
}
