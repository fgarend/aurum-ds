import type { LucideIcon } from "lucide-react";
import { type ComponentProps, type ReactElement, type ReactNode } from "react";
interface SidebarItemProps extends ComponentProps<"a"> {
    icon: LucideIcon;
    end?: ReactNode;
}
declare function SidebarItem({ icon, end, children, className, ref, "aria-current": current, ...rest }: SidebarItemProps): ReactElement;
export type { SidebarItemProps };
export { SidebarItem };
