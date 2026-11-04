import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, } from "react";
// A group of a navigation's items under a title (decision 0086). With no items, it draws nothing.
function NavSection({ label, children, className, ...rest }) {
    const id = useId();
    return (_jsxs("li", { ...rest, className: className === undefined
            ? "au-nav-section"
            : `au-nav-section ${className}`, children: [_jsx("span", { className: "au-nav-section-label au-text-overline", id: id, children: label }), _jsx("ul", { "aria-labelledby": id, className: "au-nav-list-items", children: children })] }));
}
export { NavSection };
