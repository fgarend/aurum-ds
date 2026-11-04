import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./Sidebar.css";
import { SidebarItem } from "./SidebarItem.js";
import { SidebarSection } from "./SidebarSection.js";
// The app's navigation (decision 0075), in AppLayout's navigation: a rail as tall as its parent, whose middle scrolls,
// and a strip across the top on a small screen. Its children are SidebarSection and SidebarItem.
function Sidebar({ variant = "inverse", header, footer, children, className, ...rest }) {
    return (_jsxs("nav", { ...rest, className: className === undefined ? "au-sidebar" : `au-sidebar ${className}`, "data-variant": variant, children: [header === undefined ? null : (_jsx("div", { className: "au-sidebar-header", children: header })), _jsx("div", { className: "au-sidebar-items", children: _jsx("ul", { className: "au-sidebar-list", children: children }) }), footer === undefined ? null : (_jsx("div", { className: "au-sidebar-footer", children: footer }))] }));
}
export { Sidebar, SidebarItem, SidebarSection };
