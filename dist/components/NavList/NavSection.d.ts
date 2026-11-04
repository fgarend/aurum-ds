import { type ComponentProps, type ReactElement, type ReactNode } from "react";
interface NavSectionProps extends ComponentProps<"li"> {
    label: ReactNode;
}
declare function NavSection({ label, children, className, ...rest }: NavSectionProps): ReactElement;
export type { NavSectionProps };
export { NavSection };
