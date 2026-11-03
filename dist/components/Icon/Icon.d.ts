import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactElement } from "react";
import "./Icon.css";
interface IconProps extends Omit<ComponentProps<"svg">, "children"> {
    icon: LucideIcon;
    size?: number;
    label?: string;
}
declare function Icon({ icon: Drawing, size, label, className, ...rest }: IconProps): ReactElement;
export type { IconProps };
export { Icon };
