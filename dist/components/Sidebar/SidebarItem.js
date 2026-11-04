import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useImperativeHandle, useRef, } from "react";
import { Icon } from "../Icon/Icon.js";
// How far an item is past an area's edges on one axis, to scroll by; nothing when it is inside them.
function pastEdges(start, end, areaStart, areaEnd) {
    if (start < areaStart) {
        return start - areaStart;
    }
    return end > areaEnd ? end - areaEnd : 0;
}
// Brings an item into view with the least movement, scrolling only what is the Sidebar's, never the page: the area of
// items, then the whole rail, which scrolls on a small or very short screen.
function reveal(link) {
    const areas = [
        link.closest(".au-sidebar-items"),
        link.closest(".au-sidebar"),
    ].filter((area) => area !== null);
    for (const area of areas) {
        const item = link.getBoundingClientRect();
        const box = area.getBoundingClientRect();
        area.scrollBy({
            left: pastEdges(item.left, item.right, box.left, box.right),
            top: pastEdges(item.top, item.bottom, box.top, box.bottom),
        });
    }
}
// A link of the Sidebar (decision 0075), which takes everything an anchor does, so a router wraps it as any link of its
// own, as TanStack Router's createLink. The page it opens is marked by aria-current="page", which such a link sets.
function SidebarItem({ icon, end, children, className, ref, "aria-current": current, ...rest }) {
    const link = useRef(null);
    useImperativeHandle(ref, () => link.current);
    useEffect(() => {
        if (current === "page") {
            reveal(link.current);
        }
    }, [current]);
    const text = current === "page" ? "au-text-body-strong" : "au-text-body";
    return (_jsx("li", { className: "au-sidebar-entry", children: _jsxs("a", { ...rest, "aria-current": current, className: className === undefined
                ? `au-sidebar-item ${text}`
                : `au-sidebar-item ${text} ${className}`, ref: link, children: [_jsx(Icon, { icon: icon }), _jsx("span", { className: "au-sidebar-item-name", children: children }), end === undefined ? null : (_jsx("span", { className: "au-sidebar-item-end", children: end }))] }) }));
}
export { SidebarItem };
