import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-montserrat font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "btn-premium text-white hover:opacity-90 transition-all",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full transition-colors",
        outline: "border border-[#D2A89B] text-[#D2A89B] bg-transparent hover:bg-[#D2A89B] hover:text-[#5E3A2F] rounded-full transition-colors",
        secondary: "bg-[#F5E6E0] text-[#5E3A2F] hover:bg-[#D2A89B]/80 rounded-full transition-colors",
        ghost: "hover:bg-[#F5E6E0] hover:text-[#5E3A2F] rounded-full transition-colors",
        link: "text-[#D2A89B] underline-offset-4 hover:underline rounded-full",
      },
      size: {
        default: "h-12 px-6 py-3", // Adjusted for a slightly larger feel than h-10
        sm: "h-10 rounded-full px-4",
        lg: "h-14 rounded-full px-10",
        xl: "h-[71px] px-8 text-lg", // Adding the specific height requested as an option
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
