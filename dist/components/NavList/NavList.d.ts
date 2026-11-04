import type { ComponentProps, ReactElement } from "react";
import { NavItem, type NavItemProps } from "./NavItem.js";
import { NavSection, type NavSectionProps } from "./NavSection.js";
interface NavListProps extends ComponentProps<"nav"> {
    "aria-label": string;
    orientation?: "vertical" | "horizontal" | "responsive";
}
declare function NavList({ orientation, children, className, ...rest }: NavListProps): ReactElement;
export type { NavItemProps, NavListProps, NavSectionProps };
export { NavItem, NavList, NavSection };
