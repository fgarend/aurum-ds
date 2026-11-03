import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./AppLayout.css";
// The frame of the app's pages (decision 0073): the canvas, the areas in their places and the content up to the
// tokens' content-max, centred. What goes in each area is the app's.
function AppLayout({ navigation, topBar, children, className, ...rest }) {
    return (_jsxs("div", { ...rest, className: className === undefined ? "au-app-layout" : `au-app-layout ${className}`, children: [navigation === undefined ? null : (_jsx("div", { className: "au-app-layout-navigation", children: navigation })), _jsxs("div", { className: "au-app-layout-column", children: [topBar === undefined ? null : (_jsx("header", { className: "au-app-layout-top-bar", children: topBar })), _jsx("main", { className: "au-app-layout-content", children: children })] })] }));
}
export { AppLayout };
