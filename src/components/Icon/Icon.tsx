import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactElement } from "react";
import "./Icon.css";

// Aurum's stroke, the original design's: every icon is drawn with it (decision 0056).
const stroke = 1.5;
const defaultSize = 20;

interface IconProps extends Omit<ComponentProps<"svg">, "children"> {
  // The drawing, from Lucide; the app chooses it for each of its concepts.
  icon: LucideIcon;
  // The size in pixels.
  size?: number;
  // What the icon means, for screen readers, when it stands alone; without it, the icon is hidden from them.
  label?: string;
}

// A Lucide drawing, in Aurum's stroke and the colour of the text around it (decision 0056).
function Icon({
  icon: Drawing,
  size = defaultSize,
  label,
  className,
  ...rest
}: IconProps): ReactElement {
  const named =
    label === undefined
      ? { "aria-hidden": true }
      : { role: "img", "aria-label": label };
  return (
    <Drawing
      {...rest}
      {...named}
      className={className === undefined ? "au-icon" : `au-icon ${className}`}
      size={size}
      strokeWidth={stroke}
    />
  );
}

export type { IconProps };
export { Icon };
