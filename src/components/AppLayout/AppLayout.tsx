import {
  type ComponentProps,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useId,
  useRef,
} from "react";
import "./AppLayout.css";

interface AppLayoutBaseProps extends ComponentProps<"div"> {
  // What opens the content, such as the page's path and filters; without it, no bar is drawn.
  topBar?: ReactNode;
}

type AppLayoutProps = AppLayoutBaseProps &
  (
    | {
        // The app's navigation, at the side, as wide as it draws itself; at the top on a small screen.
        navigation: ReactNode;
        // The text of the link that skips it, in the app's language, for who moves by keyboard (WCAG 2.4.1).
        skipLabel: string;
      }
    | { navigation?: undefined; skipLabel?: undefined }
  );

// The frame of the app's pages (decision 0073): the canvas, the areas in their places and the content up to the
// tokens' content-max, centred. What goes in each area is the app's.
function AppLayout({
  navigation,
  skipLabel,
  topBar,
  children,
  className,
  ...rest
}: AppLayoutProps): ReactElement {
  const contentId = useId();
  const content = useRef<HTMLElement>(null);
  // By focus and not the address, so the app's router and the browser's history see nothing.
  function skip(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    content.current?.focus();
  }
  return (
    <div
      {...rest}
      className={
        className === undefined ? "au-app-layout" : `au-app-layout ${className}`
      }
    >
      {navigation === undefined ? null : (
        <>
          <a
            className="au-app-layout-skip au-text-body-strong"
            href={`#${contentId}`}
            onClick={skip}
          >
            {skipLabel}
          </a>
          <div className="au-app-layout-navigation">{navigation}</div>
        </>
      )}
      <div className="au-app-layout-column">
        {topBar === undefined ? null : (
          <header className="au-app-layout-top-bar">{topBar}</header>
        )}
        <main
          className="au-app-layout-content"
          id={contentId}
          ref={content}
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export type { AppLayoutProps };
export { AppLayout };
