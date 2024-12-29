import React, { type ElementType } from "react";
import { cn } from "~/helpers/cn";
import type { ObjectValues } from "~/types/ObjectValues";
import type { PolymorphicComponentPropWithRef } from "~/types/PolymorphicComponent";

// #region Variant
const Variant = {
  titleLg: "title-lg",
  title: "title",
  titleSm: "title-sm",
  bodyLg: "body-lg",
  body: "body",
  bodySm: "body-sm",
  label: "label",
} as const;

type Variant = ObjectValues<typeof Variant>;

const VariantClassNames: Record<Variant, string> = {
  [Variant.titleLg]:
    "font-sans text-3xl font-bold leading-[1.2] tracking-[-0.7px] md:text-4xl",
  [Variant.title]:
    "font-sans text-2xl font-bold leading-[1.2] tracking-[-0.6px] md:text-3xl",
  [Variant.titleSm]:
    "font-sans text-lg font-bold leading-[1.2] tracking-[-0.45px] md:text-2xl",
  [Variant.bodyLg]: "font-sans text-base leading-[1.2] md:text-lg",
  [Variant.body]: "font-sans text-sm leading-[1.2] md:text-base",
  [Variant.bodySm]: "font-sans text-xs leading-[1.2] md:text-sm",
  [Variant.label]: "font-sans text-base font-bold leading-[1.2]",
};

const VariantTag: Record<Variant, string> = {
  [Variant.titleLg]: "h1",
  [Variant.title]: "h2",
  [Variant.titleSm]: "h3",
  [Variant.bodyLg]: "p",
  [Variant.body]: "p",
  [Variant.bodySm]: "p",
  [Variant.label]: "label",
};
// #endregion

type Props<C extends ElementType> = PolymorphicComponentPropWithRef<
  C,
  { variant: Variant }
>;

export function Text<C extends ElementType = "p">({
  as,
  className,
  children,
  variant,
  ...restOfProps
}: Props<C>) {
  const Component = as || VariantTag[variant];
  const defaultclsx = VariantClassNames[variant];

  return (
    <Component {...restOfProps} className={cn([defaultclsx, className])}>
      {children}
    </Component>
  );
}
