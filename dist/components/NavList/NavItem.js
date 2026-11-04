import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { hasContent } from "../../internal/hasContent.js";
import { Icon } from "../Icon/Icon.js";
// A link of a navigation (decision 0086), which takes everything an anchor does, so a router wraps it as any link of its
// own (decision 0077). The page it opens is marked by aria-current="page", which such a link sets.
function NavItem({ icon, end, children, className, ...rest }) {
    return (_jsx("li", { children: _jsxs("a", { ...rest, className: className === undefined
                ? "au-nav-item au-text-body"
                : `au-nav-item au-text-body ${className}`, children: [icon === undefined ? null : _jsx(Icon, { icon: icon }), _jsx("span", { className: "au-nav-item-name", children: children }), hasContent(end) ? (_jsx("span", { className: "au-nav-item-end", children: end })) : null] }) }));
}
export { NavItem };
