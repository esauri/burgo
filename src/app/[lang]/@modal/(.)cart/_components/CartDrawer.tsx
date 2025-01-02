"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Drawer } from "~/components/Drawer";
import { useMediaQuery } from "~/helpers/useMediaQuery";

type Props = {
  children: ReactNode;
  href: string;
};

export function CartDrawer({ children }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { back } = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      back();
    }
  };

  return (
    <Drawer
      direction={isDesktop ? "right" : "bottom"}
      open
      onOpenChange={handleOpenChange}
    >
      {children}
    </Drawer>
  );
}
