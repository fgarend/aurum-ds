import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactElement, ReactNode } from "react";
import { Icon } from "../Icon/Icon.js";

interface NavItemProps extends Omit<ComponentProps<"a">, "children"> {
  // The drawing, from Lucide: every item has one, so names line up.
  icon: LucideIcon;
  // The name, in text.
  children: string;
  // What stays at the end of the item, such as a count; it keeps its width and the name gives way.
  end?: ReactNode;
}

// A link of a navigation (decision 0086), which takes everything an anchor does, so a router wraps it as any link of its
// own (decision 0077). The page it opens is marked by aria-current="page", which such a link sets.
function NavItem({
  icon,
  end,
  children,
  className,
  ...rest
}: NavItemProps): ReactElement {
  return (
    <li>
      <a
        {...rest}
        className={
          className === undefined
            ? "au-nav-item au-text-body"
            : `au-nav-item au-text-body ${className}`
        }
      >
        <Icon icon={icon} />
        <span className="au-nav-item-name">{children}</span>
        {end === undefined ? null : (
          <span className="au-nav-item-end">{end}</span>
        )}
      </a>
    </li>
  );
}

export type { NavItemProps };
export { NavItem };
