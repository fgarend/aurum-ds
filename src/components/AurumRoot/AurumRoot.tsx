import type { ComponentProps, ReactElement } from "react";
import "./fonts.css";
import "../../tokens/tokens.css";
import "./AurumRoot.css";

interface AurumRootProps extends ComponentProps<"div"> {}

// Where Aurum begins (decision 0070): it brings the fonts, the tokens and the base styles, and its children take
// Aurum's font and colour, laid out as if it were not there.
function AurumRoot({ className, ...rest }: AurumRootProps): ReactElement {
  return (
    <div
      {...rest}
      className={className === undefined ? "au-root" : `au-root ${className}`}
      data-au-root=""
    />
  );
}

export type { AurumRootProps };
export { AurumRoot };
