import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useImperativeHandle, useRef, useState, } from "react";
import "./Tooltip.css";
// The guidelines' duration, so passing over a control does not open it. Keyboard focus opens at once.
const hoverDelay = 150;
// Time for the pointer to cross the gap onto the tooltip, which then stays open (WCAG 1.4.13).
const closeDelay = 100;
const opposite = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
};
// Where the tooltip's corner goes, on a side of the control.
function spot(side, control, popup, gap) {
    const centredLeft = control.left + (control.width - popup.width) / 2;
    const centredTop = control.top + (control.height - popup.height) / 2;
    switch (side) {
        case "right":
            return { left: control.right + gap, top: centredTop };
        case "bottom":
            return { left: centredLeft, top: control.bottom + gap };
        case "left":
            return { left: control.left - gap - popup.width, top: centredTop };
        default:
            return { left: centredLeft, top: control.top - gap - popup.height };
    }
}
// Inside the screen, with the whole tooltip: a coordinate moved only as far as needed.
function within(start, length, limit) {
    return Math.max(0, Math.min(start, limit - length));
}
// Places the open tooltip by the control. A top-layer element has no anchor of its own in every browser yet.
function place(popup, control, wanted) {
    const target = control.getBoundingClientRect();
    const size = popup.getBoundingClientRect();
    const { clientWidth, clientHeight } = document.documentElement;
    const gap = Number.parseFloat(getComputedStyle(popup).getPropertyValue("--au-space-2"));
    const first = spot(wanted, target, size, gap);
    const fits = wanted === "left" || wanted === "right"
        ? first.left === within(first.left, size.width, clientWidth)
        : first.top === within(first.top, size.height, clientHeight);
    const side = fits ? wanted : opposite[wanted];
    const final = spot(side, target, size, gap);
    popup.dataset["side"] = side;
    popup.style.left = `${within(final.left, size.width, clientWidth)}px`;
    popup.style.top = `${within(final.top, size.height, clientHeight)}px`;
}
// The name of a control with no text of its own, on the screen, on hover and on keyboard focus (decision 0078). It is
// only shown: the control keeps its own name, so it reads the same to a screen reader, and on touch, without it. With no
// text it never opens, and the control stays where it is if the text comes and goes.
function Tooltip({ text, side = "top", children, className, ref, ...rest }) {
    const anchor = useRef(null);
    const popup = useRef(null);
    const timer = useRef(undefined);
    const [open, setOpen] = useState(false);
    useImperativeHandle(ref, () => popup.current);
    useEffect(() => () => clearTimeout(timer.current), []);
    useEffect(() => {
        const element = popup.current;
        // Every browser that runs the tests has popovers. Without them the control has no tooltip, and needs none for its name.
        /* istanbul ignore next -- @preserve: only a browser without popovers takes the other way. */
        if (!(open && text !== "" && "showPopover" in element)) {
            return;
        }
        element.showPopover();
        place(element, anchor.current?.firstElementChild, side);
        const close = () => setOpen(false);
        const onKey = (event) => {
            if (event.key === "Escape") {
                close();
            }
        };
        document.addEventListener("keydown", onKey);
        // Anything scrolling, in capture since a scroll does not bubble, would leave it floating apart from the control.
        window.addEventListener("scroll", close, { capture: true, passive: true });
        window.addEventListener("resize", close);
        return () => {
            document.removeEventListener("keydown", onKey);
            window.removeEventListener("scroll", close, { capture: true });
            window.removeEventListener("resize", close);
            element.hidePopover();
        };
    }, [open, side, text]);
    function later(next, delay) {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setOpen(next), delay);
    }
    function now(next) {
        clearTimeout(timer.current);
        setOpen(next);
    }
    return (_jsxs("span", { className: "au-tooltip-anchor", onBlur: () => now(false), onClick: () => now(false), onFocus: (event) => {
            if (event.target.matches(":focus-visible")) {
                now(true);
            }
        }, onPointerEnter: (event) => {
            if (event.pointerType !== "touch") {
                later(true, hoverDelay);
            }
        }, onPointerLeave: () => {
            // While the control has keyboard focus, the tooltip stays (WCAG 1.4.13).
            if (anchor.current?.querySelector(":focus-visible") === null) {
                later(false, closeDelay);
            }
        }, ref: anchor, children: [children, _jsx("span", { ...rest, "aria-hidden": "true", className: className === undefined
                    ? "au-tooltip au-text-label"
                    : `au-tooltip au-text-label ${className}`, popover: "manual", ref: popup, children: text })] }));
}
export { Tooltip };
