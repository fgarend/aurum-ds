# How the artifact works

What the port needs to know about the Design System artifact the snapshot
came from. Each part names its source: the artifact type's own format
reference (`artifact-type/reference/format.md`, read on 2026-11-01, not
copied here), the artifact's app, or a file of the snapshot.

## Tokens: from `tokens.json` to `tokens.css`

Source: the format reference, "tokens.json grammar".

- **Every family is a list** of `{name, value, usage}`, except `type`, which
  holds `fonts`, `families` and `groups` of text styles. Colors also list
  their `themes`. Aurum has one theme, `light`, and the families `color`,
  `type`, `spacing`, `radius`, `shadow`, `size` and `layout`.
- **Compiled CSS**, in this order:
  1. `:root, [data-theme="<first theme>"]` with every color and shadow;
  2. one `[data-theme="<id>"]` block per further theme (Aurum has none);
  3. `:root` with every other list family, plus each `type.families` entry
     as `--font-<key>`;
  4. a `.<style name>` class per text style;
  5. an `@font-face` per entry of `type.fonts` (Aurum has none: its fonts
     come from Google Fonts, imported by `bundle.css`).
- **Names** keep their case. A `.` in a name is escaped (`--space-1\.5`). All
  families but `type` share one namespace of custom properties.
- **Aliases:** a color value `"{other}"` becomes `var(--other)`.
- **Per-theme values:** a color or shadow may hold one value per theme; a
  theme without one takes the first theme's.
- **Not served here:** the format reference says a published system serves
  its compiled `tokens.css`, but this artifact does not (reading it fails), so
  the port compiles it from `tokens.json`.

### The exact output

Source: the artifact type's app (`artifact-type/app.js`, read on
2026-11-01), whose compiler writes `tokens.css` line by line.

- **Layout:** a selector line ending in ` {`, one declaration per line
  indented by two spaces, a closing `}`, lines joined by a newline, and a
  final newline.
- **The theme block** lists the colors in file order, then the shadows.
- **The root block** lists spacing, then radius, then every other family in
  file order, then the font families. It is left out when empty.
- **A text style class** holds, in order: `font-family: var(--font-<key>)`
  (the style's own family, else its group's), `font-size`, `line-height`,
  `font-weight`, `letter-spacing`, then `font-style` only when italic and
  `font-variation-settings: 'opsz' N` only with an optical size.
- **Defaults** read in for a style: `line-height` 1.4, `font-weight` 400
  (`normal` and `bold` read as 400 and 700), `letter-spacing` 0, `font-style`
  normal. A number for a length gets `px`, and a hex color is lowercased.
- **Escaping:** besides the `.`, a name starting with a digit has that digit
  escaped as `\3<digit> ` (`2x` becomes `\32 x`).
- **Usage notes** become comments only when asked for, which is not the
  default.

## Rendering a preview outside the artifact

Sources: the format reference, "The preview.html contract"; the artifact's
app, for the React version.

- **Inside the artifact**, a preview runs in a frame that has already loaded,
  in order: the compiled tokens CSS, `components/bundle.css`, React and
  ReactDOM 18.3.1 as UMD scripts from jsDelivr, and `components/bundle.js`.
  The frame sets `<html data-theme="light">`.
- **Outside it**, the same must be loaded, in the same order, before the
  preview's own root element and script run.
- **Line 1 of every preview is a marker**, `<!-- @dsCard … -->`: `group`
  sections the components, `height` is the card height in pixels (40 to
  4000, 120 when absent, growing to fit). It may also carry `subtitle`,
  `width`, `floor` or `page`.
- **A preview renders one component**, in a few states.

## The components bundle

Sources: the format reference, the file table; `components/bundle.js`.

- **`components/bundle.js` is one classic script:** no imports and no
  network. It reads `window.React` and `window.ReactDOM` and assigns
  `window.Aurum`.
- **Its line 1 is a header**, `/* @ds-bundle: {…} */`, with the namespace
  (`Aurum`) and the order of the components.
- **It must not contain** a literal `</script` or `<!--`, because it may be
  inlined into a page.
- **`components/index.d.ts`** is documentation: the props of each component
  as `<Name>Props`, not type-checked by the artifact.
- **`components/<Name>/README.md`** holds the guidelines; its first sentence
  is the component's summary.

## File layout

Sources: the format reference, the file table; the snapshot itself.

- **The artifact keeps its content under `project/`:** `README.md` (the brand
  book), `tokens.json`, `components/` and `assets/<Group>/`.
- **Assets are grouped by their first folder:** Aurum has one group,
  `Icons`.
- **This artifact uses an older layout** than the format reference
  describes: it has a `design-system.json` with the icon group and the
  libraries, where the reference describes a generated `manifest.json`.
