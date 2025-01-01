import type { ReactNode } from "react";
import type { Language } from "~/types/Language";
import { CartDrawer } from "./_components/CartDrawer";

type Props = {
  children: ReactNode;
  params: Promise<{ lang: Language }>;
};

export default async function CartModalLayout(props: Props) {
  const { lang } = await props.params;

  return <CartDrawer href={`/${lang}/cart`}>{props.children}</CartDrawer>;
}
