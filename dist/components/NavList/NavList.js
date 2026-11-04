import { jsx as _jsx } from "react/jsx-runtime";
import { NavItem } from "./NavItem.js";
import "./NavList.css";
import { NavSection } from "./NavSection.js";
// The pieces of a navigation (decision 0086): a list of NavItem and NavSection, which the app puts where it wants, with
// its room, its scrolling and whatever else goes around it.
function NavList({ orientation = "vertical", children, className, ...rest }) {
    return (_jsx("nav", { ...rest, className: className === undefined ? "au-nav-list" : `au-nav-list ${className}`, "data-orientation": orientation, children: _jsx("ul", { className: "au-nav-list-items", children: children }) }));
}
export { NavItem, NavList, NavSection };
