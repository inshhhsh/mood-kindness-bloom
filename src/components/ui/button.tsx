import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "pixel-button",
        destructive: "pixel-button bg-destructive text-destructive-foreground",
        outline: "pixel-button bg-background border-input",
        secondary: "pixel-button bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground font-pixel text-xs p-2",
        link: "text-primary underline-offset-4 hover:underline font-pixel text-xs",
        pixel: "pixel-button",
        "pixel-mood": "pixel-mood-button",
      },
      size: {
        default: "px-4 py-3",
        sm: "px-3 py-2 text-xs",
        lg: "px-8 py-4 text-base",
        icon: "w-10 h-10 p-0",
        mood: "w-48 h-32",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
