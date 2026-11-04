import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, } from "react";
// A group of the Sidebar's items under a title (decision 0075). With no items, it draws nothing.
function SidebarSection({ label, children, className, ...rest }) {
    const id = useId();
    return (_jsxs("li", { ...rest, className: className === undefined
            ? "au-sidebar-section"
            : `au-sidebar-section ${className}`, children: [_jsx("span", { className: "au-sidebar-section-label au-text-overline", id: id, children: label }), _jsx("ul", { "aria-labelledby": id, className: "au-sidebar-list", children: children })] }));
}
export { SidebarSection };
