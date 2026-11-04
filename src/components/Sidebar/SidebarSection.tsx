import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  useId,
} from "react";

interface SidebarSectionProps extends ComponentProps<"li"> {
  // The section's title, which also names its list for screen readers.
  label: ReactNode;
}

// A group of the Sidebar's items under a title (decision 0075). With no items, it draws nothing.
function SidebarSection({
  label,
  children,
  className,
  ...rest
}: SidebarSectionProps): ReactElement {
  const id = useId();
  return (
    <li
      {...rest}
      className={
        className === undefined
          ? "au-sidebar-section"
          : `au-sidebar-section ${className}`
      }
    >
      <span className="au-sidebar-section-label au-text-overline" id={id}>
        {label}
      </span>
      <ul aria-labelledby={id} className="au-sidebar-list">
        {children}
      </ul>
    </li>
  );
}

export type { SidebarSectionProps };
export { SidebarSection };
