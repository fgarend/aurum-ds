// Whether React would draw anything for an optional area, so a component draws no empty box around nothing.
function hasContent(node) {
    return (node !== undefined &&
        node !== null &&
        typeof node !== "boolean" &&
        node !== "");
}
export { hasContent };
