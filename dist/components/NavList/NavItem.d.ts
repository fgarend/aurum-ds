import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactElement, ReactNode } from "react";
interface NavItemProps extends ComponentProps<"a"> {
    icon?: LucideIcon;
    end?: ReactNode;
}
declare function NavItem({ icon, end, children, className, ...rest }: NavItemProps): ReactElement;
export type { NavItemProps };
export { NavItem };
