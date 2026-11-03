import type { ComponentProps, ReactElement, ReactNode } from "react";
interface AppLayoutProps extends ComponentProps<"div"> {
    navigation?: ReactNode;
    topBar?: ReactNode;
}
declare function AppLayout({ navigation, topBar, children, className, ...rest }: AppLayoutProps): ReactElement;
export type { AppLayoutProps };
export { AppLayout };
