import { LoaderIcon } from "lucide-react";
import NextLink, { type LinkProps as InternalLinkProps } from "next/link";
import React, {
  type ComponentProps,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "~/helpers/cn";
import type { ObjectValues } from "~/types/ObjectValues";
import type { PolymorphicComponentProp } from "~/types/PolymorphicComponent";

// #region Variant
const Variant = {
  destructive: "destructive",
  filled: "filled",
  ghost: "ghost",
  icon: "icon",
  link: "link",
  outline: "outline",
} as const;

type Variant = ObjectValues<typeof Variant>;

const VariantBaseClassName: Record<Variant, string> = {
  destructive:
    "border-destructive @lg/pressable:w-fit text-destructive text-base flex h-12 justify-center rounded-sm px-4 py-3",
  filled:
    "bg-primary border-primary @lg/pressable:w-fit text-primary-foreground text-base flex h-12 justify-center rounded-sm px-4 py-3",
  ghost:
    "@lg/pressable:w-fit rounded-sm px-3 border-none py-2 flex transition focus-visible:ring focus-visible:ring-offset-2 focus-visible:outline-none",
  icon: "bg-primary text-primary-foreground p-3 h-12 w-12 border-transparent",
  link: "text-foreground inline-flex justify-center rounded-sm border-transparent underline",
  outline:
    "border-foreground @lg/pressable:w-fit text-foreground text-base flex h-12 justify-center rounded-sm px-4 py-3",
};

const VariantButtonDisabledClassName: Record<Variant, string> = {
  destructive: "disabled:border-disabled disabled:text-disabled",
  filled: "disabled:opacity-60",
  ghost: "disabled:text-disabled disabled:border-transparent",
  icon: "disabled:text-disabled-foreground disabled:bg-disabled",
  link: "disabled:text-disabled disabled:border-transparent",
  outline: "disabled:border-disabled disabled:text-disabled",
};

// Same as VariantLinkModifierClassName but also prefixed with enabled: so we only apply modifiers when enabled
const VariantButtonModifierClassName: Record<Variant, string> = {
  destructive: "enabled:hover:bg-destructive/20",
  filled: "enabled:hover:opacity-80",
  ghost: "enabled:hover:bg-muted/20",
  icon: "enabled:hover:opacity-80",
  link: "enabled:hover:opacity-80",
  outline: "enabled:hover:bg-foreground/20",
};

const VariantLinkModifierClassName: Record<Variant, string> = {
  destructive: "hover:bg-destructive/20",
  filled: "hover:opacity-80",
  ghost: "hover:bg-muted/20",
  icon: "hover:opacity-80",
  link: "hover:opacity-80",
  outline: "hover:bg-foreground/20",
};
// #endregion

type BaseProps = {
  children: ReactNode;
  variant: Variant;
};

// #region Button
type ButtonElementProps = Omit<ComponentProps<"button">, "className">;

type ButtonProps = BaseProps & ButtonElementProps;

export function Button({
  children,
  disabled = false,
  variant,
  ...restOfProps
}: ButtonProps) {
  return (
    <button
      type="button"
      {...restOfProps}
      aria-disabled={disabled}
      className={`relative flex-row items-center gap-2 border leading-[1.2] font-bold capitalize enabled:active:scale-95 disabled:cursor-not-allowed ${VariantBaseClassName[variant]} ${VariantButtonDisabledClassName[variant]} ${VariantButtonModifierClassName[variant]}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
// #endregion

// #region Link
type NextLinkProps = Omit<ComponentProps<"a">, keyof InternalLinkProps> &
  InternalLinkProps;

type LinkElementProps = Omit<NextLinkProps, "className">;

type LinkProps = BaseProps & LinkElementProps;

export function Link({ children, variant, ...restOfProps }: LinkProps) {
  return (
    <NextLink
      {...restOfProps}
      className={`relative flex-row items-center gap-2 border leading-[1.2] font-bold active:scale-95 ${VariantBaseClassName[variant]} ${VariantLinkModifierClassName[variant]}`}
    >
      {children}
    </NextLink>
  );
}
// #endregion

// #region PressableContainer
type PressableContainerProps<C extends ElementType> =
  PolymorphicComponentProp<C>;

/**
 * Pressable container in order to have a full-width link on smaller pressabled and a fit one on larger ones
 *
 */
export function PressableContainer<C extends ElementType = "div">({
  as,
  children,
  className,
}: PressableContainerProps<C>) {
  const Component = as || "div";

  return (
    <Component className={cn([className, "@container/pressable"])}>
      {children}
    </Component>
  );
}
// #endregion

type SubmitButtonProps = Omit<ButtonProps, "type"> & {
  pending: boolean;
};

export function SubmitButton({
  children,
  disabled,
  pending,
  ...props
}: SubmitButtonProps) {
  return (
    <Button disabled={disabled || pending} type="submit" {...props}>
      <div className="grid-template-areas-stack grid justify-items-center">
        <span
          className={cn([
            "grid-area-stack",
            {
              invisible: pending,
            },
          ])}
        >
          {children}
        </span>
        <span
          className={cn([
            "grid-area-stack text-center",
            {
              invisible: !pending,
            },
          ])}
        >
          <LoaderIcon className="size-4 animate-spin" />
        </span>
      </div>
    </Button>
  );
}
