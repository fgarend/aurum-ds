import type { ComponentProps, ReactElement, ReactNode } from "react";
import "./AppLayout.css";

interface AppLayoutProps extends ComponentProps<"div"> {
  // The app's navigation, at the side, as wide as it draws itself; at the top on a small screen.
  navigation?: ReactNode;
  // What opens the content, such as the page's path and filters; without it, no bar is drawn.
  topBar?: ReactNode;
}

// The frame of the app's pages (decision 0073): the canvas, the areas in their places and the content up to the
// tokens' content-max, centred. What goes in each area is the app's.
function AppLayout({
  navigation,
  topBar,
  children,
  className,
  ...rest
}: AppLayoutProps): ReactElement {
  return (
    <div
      {...rest}
      className={
        className === undefined ? "au-app-layout" : `au-app-layout ${className}`
      }
    >
      {navigation === undefined ? null : (
        <div className="au-app-layout-navigation">{navigation}</div>
      )}
      <div className="au-app-layout-column">
        {topBar === undefined ? null : (
          <header className="au-app-layout-top-bar">{topBar}</header>
        )}
        <main className="au-app-layout-content">{children}</main>
      </div>
    </div>
  );
}

export type { AppLayoutProps };
export { AppLayout };
