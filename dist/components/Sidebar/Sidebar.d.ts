import type { ComponentProps, ReactElement, ReactNode } from "react";
import { SidebarItem, type SidebarItemProps } from "./SidebarItem.js";
import { SidebarSection, type SidebarSectionProps } from "./SidebarSection.js";
interface SidebarProps extends ComponentProps<"nav"> {
    "aria-label": string;
    variant?: "inverse" | "surface" | "canvas";
    header?: ReactNode;
    footer?: ReactNode;
}
declare function Sidebar({ variant, header, footer, children, className, ...rest }: SidebarProps): ReactElement;
export type { SidebarItemProps, SidebarProps, SidebarSectionProps };
export { Sidebar, SidebarItem, SidebarSection };
