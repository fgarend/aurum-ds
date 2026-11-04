import { type ComponentProps, type ReactElement, type ReactNode } from "react";
interface AppLayoutBaseProps extends ComponentProps<"div"> {
    topBar?: ReactNode;
}
type AppLayoutProps = AppLayoutBaseProps & ({
    navigation: ReactNode;
    skipLabel: string;
} | {
    navigation?: undefined;
    skipLabel?: undefined;
});
declare function AppLayout({ navigation, skipLabel, topBar, children, className, ...rest }: AppLayoutProps): ReactElement;
export type { AppLayoutProps };
export { AppLayout };
