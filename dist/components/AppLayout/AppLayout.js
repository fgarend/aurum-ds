import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useRef, } from "react";
import "./AppLayout.css";
// The frame of the app's pages (decision 0073): the canvas, the areas in their places and the content up to the
// tokens' content-max, centred. What goes in each area is the app's.
function AppLayout({ navigation, skipLabel, topBar, children, className, ...rest }) {
    const contentId = useId();
    const content = useRef(null);
    // By focus and not the address, so the app's router and the browser's history see nothing.
    function skip(event) {
        event.preventDefault();
        content.current?.focus();
    }
    return (_jsxs("div", { ...rest, className: className === undefined ? "au-app-layout" : `au-app-layout ${className}`, children: [navigation === undefined ? null : (_jsxs(_Fragment, { children: [_jsx("a", { className: "au-app-layout-skip au-text-body-strong", href: `#${contentId}`, onClick: skip, children: skipLabel }), _jsx("aside", { className: "au-app-layout-navigation", children: navigation })] })), _jsxs("main", { className: "au-app-layout-main", id: contentId, ref: content, tabIndex: -1, children: [topBar === undefined ? null : (_jsx("header", { className: "au-app-layout-top-bar", children: topBar })), _jsx("div", { className: "au-app-layout-content", children: children })] })] }));
}
export { AppLayout };
