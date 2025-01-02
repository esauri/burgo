"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Drawer } from "~/components/Drawer";
import { useMediaQuery } from "~/helpers/useMediaQuery";

type Props = {
  children: ReactNode;
  href: string;
};

export function CartDrawer({ children, href }: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const pathname = usePathname();
  const { back } = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      back();
    }
  };

  return (
    <Drawer
      direction={isDesktop ? "right" : "bottom"}
      open={pathname === href}
      onOpenChange={handleOpenChange}
    >
      {children}
    </Drawer>
  );
}
