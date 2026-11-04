import { jsx as _jsx } from "react/jsx-runtime";
import "./Icon.css";
// Aurum's stroke, the original design's: every icon is drawn with it (decision 0056).
const stroke = 1.5;
const defaultSize = 20;
// A Lucide drawing, in Aurum's stroke and the colour of the text around it (decision 0056).
function Icon({ icon: Drawing, size = defaultSize, className, ...rest }) {
    // Named with aria-label or aria-labelledby, it stands alone and is an image; without a name, it is hidden.
    const named = rest["aria-label"] === undefined && rest["aria-labelledby"] === undefined
        ? { "aria-hidden": true }
        : { role: "img" };
    return (_jsx(Drawing, { ...named, ...rest, className: className === undefined ? "au-icon" : `au-icon ${className}`, size: size, strokeWidth: stroke }));
}
export { Icon };
