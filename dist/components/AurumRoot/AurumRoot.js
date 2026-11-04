import { jsx as _jsx } from "react/jsx-runtime";
import "./fonts.css";
import "../../tokens/tokens.css";
import "./AurumRoot.css";
// Where Aurum begins (decision 0070): it brings the fonts, the tokens and the base styles, and its children take
// Aurum's font and colour, laid out as if it were not there.
function AurumRoot({ className, ...rest }) {
    return (_jsx("div", { ...rest, className: className === undefined
            ? "au-root au-text-body"
            : `au-root au-text-body ${className}`, "data-au-root": "" }));
}
export { AurumRoot };
