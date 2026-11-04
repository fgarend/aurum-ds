import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactElement } from "react";
interface IconProps extends Omit<ComponentProps<"svg">, "children"> {
    icon: LucideIcon;
    size?: number;
}
declare function Icon({ icon: Drawing, size, className, ...rest }: IconProps): ReactElement;
export type { IconProps };
export { Icon };
