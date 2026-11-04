import { type ComponentProps, type ReactElement } from "react";
type Side = "top" | "right" | "bottom" | "left";
interface TooltipProps extends Omit<ComponentProps<"span">, "children"> {
    text: string;
    side?: Side;
    children: ReactElement;
}
declare function Tooltip({ text, children, ...rest }: TooltipProps): ReactElement;
export type { TooltipProps };
export { Tooltip };
