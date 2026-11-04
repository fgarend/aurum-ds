import type { ComponentProps, ReactElement, ReactNode } from "react";
import "./Sidebar.css";
import { SidebarItem, type SidebarItemProps } from "./SidebarItem.js";
import { SidebarSection, type SidebarSectionProps } from "./SidebarSection.js";

interface SidebarProps extends ComponentProps<"nav"> {
  // What this navigation is, for screen readers, among the others on the page.
  "aria-label": string;
  // The look: graphite, white with a border, or no panel over the page's ground.
  variant?: "inverse" | "surface" | "canvas";
  // What stays at the top, such as the app's brand; without it, no area is drawn.
  header?: ReactNode;
  // What stays at the bottom, such as a profile; without it, no area or line is drawn.
  footer?: ReactNode;
}

// The app's navigation (decision 0075), in AppLayout's navigation: a rail as tall as its parent, whose middle scrolls,
// and a strip across the top on a small screen. Its children are SidebarSection and SidebarItem.
function Sidebar({
  variant = "inverse",
  header,
  footer,
  children,
  className,
  ...rest
}: SidebarProps): ReactElement {
  return (
    <nav
      {...rest}
      className={
        className === undefined ? "au-sidebar" : `au-sidebar ${className}`
      }
      data-variant={variant}
    >
      {header === undefined ? null : (
        <div className="au-sidebar-header">{header}</div>
      )}
      <div className="au-sidebar-items">
        <ul className="au-sidebar-list">{children}</ul>
      </div>
      {footer === undefined ? null : (
        <div className="au-sidebar-footer">{footer}</div>
      )}
    </nav>
  );
}

export type { SidebarItemProps, SidebarProps, SidebarSectionProps };
export { Sidebar, SidebarItem, SidebarSection };
