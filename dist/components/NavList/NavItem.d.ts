import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactElement, ReactNode } from "react";
interface NavItemProps extends Omit<ComponentProps<"a">, "children"> {
    icon: LucideIcon;
    children: string;
    end?: ReactNode;
}
declare function NavItem({ icon, end, children, className, ...rest }: NavItemProps): ReactElement;
export type { NavItemProps };
export { NavItem };
