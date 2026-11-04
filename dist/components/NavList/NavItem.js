import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon } from "../Icon/Icon.js";
// A link of a navigation (decision 0086), which takes everything an anchor does, so a router wraps it as any link of its
// own (decision 0077). The page it opens is marked by aria-current="page", which such a link sets.
function NavItem({ icon, end, children, className, "aria-current": current, ...rest }) {
    const text = current === "page" ? "au-text-body-strong" : "au-text-body";
    return (_jsx("li", { className: "au-nav-entry", children: _jsxs("a", { ...rest, "aria-current": current, className: className === undefined
                ? `au-nav-item ${text}`
                : `au-nav-item ${text} ${className}`, children: [_jsx(Icon, { icon: icon }), _jsx("span", { className: "au-nav-item-name", children: children }), end === undefined ? null : (_jsx("span", { className: "au-nav-item-end", children: end }))] }) }));
}
export { NavItem };
