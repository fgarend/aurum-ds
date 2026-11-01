# 0029. Icons

- Status: Accepted
- Date: 2026-11-01

## Context

The artifact draws 41 line icons of its own: a 24 px grid, a 1.5 px stroke,
round caps and joins, no fills. It keeps them twice, as SVG files with the ink
color baked in, for `<img>`, and as a table in its `Icon` component, drawn
with `currentColor`, both with the same shapes. Its guidelines forbid mixing
icon families. The app this package serves already draws its icons from
Lucide, by concept. Lucide is in the same family of style, with about 2,300
icons under the ISC license, and has 38 of the 41 names, plus equivalents for
the other three.

## Decision

- **Lucide is Aurum's only icon family**, in place of the artifact's 41
  drawings, which stay in `reference/` as where the design began.
- **The package ships no icon files.** The icons arrive through Lucide's
  package, drawn by the `Icon` component.
- **How the package depends on Lucide, the stroke width and the icon names
  are decided with the `Icon` component**, when code first uses them.

## Alternatives considered

- **The artifact's 41 icons, as SVG files or a table.** Exactly the
  artifact's look, but every new icon drawn by hand, and the app would give up
  the icons it already uses.
- **Another library, such as Tabler or Phosphor.** As complete, but the app
  would change libraries too.

## Consequences

- Icons differ slightly from the artifact's previews, which the visual tests
  must allow for.
- A screen that needs a new icon finds it in Lucide, without drawing.
- The guidelines' section on icons, and the artifact mirror, follow Lucide.
