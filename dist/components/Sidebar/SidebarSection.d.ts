import { type ComponentProps, type ReactElement, type ReactNode } from "react";
interface SidebarSectionProps extends ComponentProps<"li"> {
    label: ReactNode;
}
declare function SidebarSection({ label, children, className, ...rest }: SidebarSectionProps): ReactElement;
export type { SidebarSectionProps };
export { SidebarSection };
