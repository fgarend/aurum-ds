import {
  type ComponentProps,
  type ReactElement,
  type ReactNode,
  useId,
} from "react";

interface NavSectionProps extends ComponentProps<"li"> {
  // The section's title, which also names its list for screen readers.
  label: ReactNode;
}

// A group of a navigation's items under a title (decision 0086). With no items, it draws nothing.
function NavSection({
  label,
  children,
  className,
  ...rest
}: NavSectionProps): ReactElement {
  const id = useId();
  return (
    <li
      {...rest}
      className={
        className === undefined
          ? "au-nav-section"
          : `au-nav-section ${className}`
      }
    >
      <span className="au-nav-section-label au-text-overline" id={id}>
        {label}
      </span>
      <ul aria-labelledby={id} className="au-nav-list-items">
        {children}
      </ul>
    </li>
  );
}

export type { NavSectionProps };
export { NavSection };
