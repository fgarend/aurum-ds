import type { ComponentProps, ReactElement } from "react";
import { NavItem, type NavItemProps } from "./NavItem.js";
import "./NavList.css";
import { NavSection, type NavSectionProps } from "./NavSection.js";

interface NavListProps extends ComponentProps<"nav"> {
  // What this navigation is, for screen readers, among the others on the page.
  "aria-label": string;
  // A column, one line, or one line below breakpoint-md and a column from there up, with nothing to measure.
  orientation?: "vertical" | "horizontal" | "responsive";
}

// The pieces of a navigation (decision 0086): a list of NavItem and NavSection, which the app puts where it wants, with
// its room, its scrolling and whatever else goes around it.
function NavList({
  orientation = "vertical",
  children,
  className,
  ...rest
}: NavListProps): ReactElement {
  return (
    <nav
      {...rest}
      className={
        className === undefined ? "au-nav-list" : `au-nav-list ${className}`
      }
      data-orientation={orientation}
    >
      <ul className="au-nav-list-items">{children}</ul>
    </nav>
  );
}

export type { NavItemProps, NavListProps, NavSectionProps };
export { NavItem, NavList, NavSection };
