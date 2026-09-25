---
name: Thiago Diniz Portfolio
description: A one-page portfolio drawn as a utility-patent application sheet, India ink on bond with carmine only on the part under examination.
colors:
  carmine: "#b11e2b"
  ink: "#141414"
  ink-2: "#3b3b38"
  ink-3: "#5f5f5a"
  bond: "#fbfbf8"
typography:
  display:
    fontFamily: "Old Standard TT, Times New Roman, Times, serif"
    fontSize: "clamp(3.1rem, 7.6vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "0.055em"
  headline:
    fontFamily: "Old Standard TT, Times New Roman, Times, serif"
    fontSize: "clamp(1.7rem, 2.9vw, 2.55rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "0.07em"
  title:
    fontFamily: "Old Standard TT, Times New Roman, Times, serif"
    fontSize: "clamp(1.45rem, 2.1vw, 1.9rem)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0.01em"
  tagline:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "clamp(1.1rem, 1.55vw, 1.4rem)"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Source Serif 4, Georgia, Times New Roman, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Old Standard TT, Times New Roman, Times, serif"
    fontSize: "0.72rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.18em"
  control:
    fontFamily: "Old Standard TT, Times New Roman, Times, serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.15em"
  numeral:
    fontFamily: "Old Standard TT, Times New Roman, Times, serif"
    fontSize: "0.92em"
    fontWeight: 700
    letterSpacing: "0.02em"
  mono:
    fontFamily: "Courier Prime, Courier New, Courier, monospace"
    fontSize: "0.82rem"
    fontWeight: 400
    lineHeight: 1.45
rounded:
  none: "0px"
spacing:
  inset: "clamp(6px, 1vw, 14px)"
  in: "calc(clamp(6px, 1vw, 14px) + 6px)"
  pad: "clamp(18px, 3vw, 44px)"
  strip-h: "52px"
  section: "clamp(56px, 11vh, 120px)"
  stack: "22px"
  actions: "12px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bond}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    padding: "0.85em 1.35em"
    height: "46px"
  button-secondary:
    backgroundColor: "{colors.bond}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    padding: "0.85em 1.35em"
    height: "46px"
  button-small:
    backgroundColor: "{colors.bond}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.65em 1em"
    height: "38px"
  title-block-strip:
    backgroundColor: "{colors.bond}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "{spacing.strip-h}"
  strip-cv:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bond}"
    padding: "0 16px"
    height: "{spacing.strip-h}"
  sheet-mark:
    backgroundColor: "{colors.bond}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.none}"
    padding: "7px 14px"
  reference-numeral:
    textColor: "{colors.ink}"
    typography: "{typography.numeral}"
  reference-numeral-exam:
    textColor: "{colors.carmine}"
    typography: "{typography.numeral}"
  link:
    textColor: "{colors.ink}"
  link-hover:
    textColor: "{colors.carmine}"
  seal:
    textColor: "{colors.carmine}"
    width: "min(260px, 60vw)"
---

# Design System: Thiago Diniz Portfolio

## Overview

**Creative North Star: "The Patent Drawing Sheet"**

The site is a patent application for an invention, with the developer as its inventor. Every screen is a drawing sheet: a fixed double-ruled frame with registration marks at its corners, a title-block strip across the top that counts the sheet in view, and sheets stacked one after another, each closed by a heavy rule and a boxed sheet number in its bottom-right corner. The build ships ten sheets (the direction contract planned nine); the strip and every sheet mark count ten.

The material is India ink on bond paper. Drawings are line work with exact geometry: isometric cylinders, curved leader lines running to reference numerals, dashed hidden lines, chain-line axes, and 45° hatching as the only tone. Colour is a single carmine, held back for whatever is under examination. The density is that of a technical document: ruled cells instead of cards, a comfortable measure for the descriptive text, small tracked capitals for every label.

Motion follows the drafting tools. A plotter draws lines, parts slide along their axis with a damped follow, stamps press into the paper. The confirmed rejection is the category default: a dark hero with neon and a grid of project cards.

**Key Characteristics:**
- Light only: India Ink on Bond, with no page dark theme.
- Three typefaces, three voices: drawing lettering, descriptive report, machine output.
- Ruled cells, square corners, no elevation.
- Carmine only on the part under examination and on the examiner's marks.
- Figures are generated SVG with a fixed vocabulary of line weights, dashes and hatch densities.
- Every continuous motion pauses from the strip and stops under reduced motion.

## Colors

One ink in three dilutions on one paper, plus one examiner's red.

### Primary
- **Examiner's Carmine** (#b11e2b): the state colour. It marks whatever is under examination: a pointed-at reference numeral and every element sharing its number, the specification paragraph in reading position, the active nav underline, the button ring on hover or when pressed, the focus outline, text selection and the caret. It is also the examiner's hand: the DEFERIDO seal, the "now" marker on the timeline, the live return path in Fig. 2, the "DADOS FICTÍCIOS" stamp and the last line of the boot log. 6.56:1 on Bond.

### Neutral
- **India Ink** (#141414): all line work, headings and body text, every rule, the fill of the primary button and the CV cell, the scrollbar thumb. 17.77:1 on Bond.
- **Diluted Ink** (#3b3b38): secondary text: the abstract, figure captions, lead paragraphs, sheet marks, table headers, h4 subheads, readouts, materials lines. 10.84:1 on Bond.
- **Wash Ink** (#5f5f5a): tertiary marks: field labels in the inventor column, the dotted underline of inline numerals, dash bullets, scramble glyphs mid-flight, the ASCII eggs, the boot hint. 6.19:1 on Bond.
- **Bond** (#fbfbf8): the paper. Page background, the occluding fill of every drawn solid, text on ink. The two greys carry the paper's faint warm cast; India Ink itself is neutral.

Fig. 6 re-maps the paper and ink roles inside its own SVG (#16181b paper, #ecebe4 ink, #bdbcb4 diluted ink) to demonstrate a dark theme. That inversion belongs to the figure; the page declares `color-scheme: light`.

### Named Rules
**The Examiner's Red Rule.** Carmine appears only on what is under examination (a state) or as an examiner's mark (seal, stamp, now-line). It is never a background area, never decoration, never a second brand colour.

**The One Ink Rule.** Everything else is ink on bond in three dilutions. No other hues, no gradients, no tinted panels. Lighter tone inside a figure comes from hatch density or from opacity on grid, ghost and projection lines, never from a new grey.

## Typography

**Display Font:** Old Standard TT (with Times New Roman, Times, serif), 400 and 700
**Body Font:** Source Serif 4 (with Georgia, Times New Roman, serif), variable 400 to 600, optical sizing on
**Label/Mono Font:** Courier Prime (with Courier New, Courier, monospace), 400 and 700

**Character:** Old Standard TT is the lettering on the drawing: titles, labels, numerals and controls, nearly always at 400 and in spaced capitals. Source Serif 4 writes the descriptive report beside the figures. Courier Prime is the machine talking: readouts, logs, dates, stamps and the ASCII eggs.

### Hierarchy
- **Display** (400, clamp(3.1rem, 7.6vw, 6rem), 0.9, 0.055em, uppercase): the inventor's name only, in two rows, pulled 0.04em left to align optically. On phones clamp(2.7rem, 15vw, 4.2rem).
- **Headline** (400, clamp(1.7rem, 2.9vw, 2.55rem), 1.08, 0.07em, uppercase, balanced): sheet titles.
- **Title** (400, clamp(1.45rem, 2.1vw, 1.9rem), 1.15, 0.01em, sentence case, balanced): case titles and specification paragraph heads, the latter prefixed by a bracketed paragraph number ([0010]) in Source Serif 600 at 0.72em.
- **Tagline** (Source Serif 4 600, clamp(1.1rem, 1.55vw, 1.4rem), 1.35, max 34ch): the role-and-stack line under the name.
- **Body** (Source Serif 4 400, 1.0625rem, 1.65): specification and case text at a 58 to 70ch measure. The abstract runs at clamp(1rem, 1.12vw, 1.1rem) in Diluted Ink, max 60ch, opened by a run-in label.
- **Label** (Old Standard TT 400, 0.72rem, 1.3, 0.18em, uppercase): field names, the reference-list heading, table headers, materials run-ins. Siblings sit between 0.68 and 0.76rem (sheet marks 0.68rem, h4 subheads 0.74rem in Diluted Ink, reference entries 0.76rem at 0.05em).
- **Control** (Old Standard TT 400, 0.8125rem, 1.1, 0.15em, uppercase): buttons. Strip links, the CV cell and small buttons use 0.75rem.
- **Numeral** (Old Standard TT 700, 0.92em, 0.02em): inline reference numerals in running text, underlined with a 0.75px dotted Wash Ink rule. Inside figures, numerals are 400 at 19 user units and "FIG. n" labels 400 at 22 units, 0.16em.
- **Mono** (Courier Prime 400, 0.82rem, 1.45): figure readouts. Case meta lines 0.8rem at 0.04em, revision dates 0.85rem, the boot log clamp(0.78rem, 1.3vw, 0.9rem); the fictitious-data stamp is 700 at 12 units, 0.16em.

### Named Rules
**The Three Voices Rule.** Old Standard TT letters the drawing (titles, labels, numerals, controls); Source Serif 4 writes the report (every paragraph); Courier Prime speaks for the machine (readouts, logs, dates, stamps). A paragraph is never set in the display or the mono face.

**The Tracked Capitals Rule.** Old Standard TT capitals are always letterspaced: 0.055em on the name, 0.07em on sheet titles, 0.15em on controls, up to 0.18em on the smallest field labels. Sentence-case titles stay near 0.01em. Running text is never set in capitals.

**The Tabular Figures Rule.** Numbers that count or align (the sheet counter, reference-list numbers, paragraph numbers, readouts, the boot percentage) use tabular figures.

## Layout

The page is one continuous drawing. A fixed frame sits inset from the viewport by `inset` (clamp(6px, 1vw, 14px)); the body is padded by `in` (inset plus 6px) so content lives inside the double rule. The title-block strip is sticky at the top, 52px tall (48px at 960px and below). Sheets stack vertically, each ending in a 1.5px rule and scrolling to a margin just under the strip. Inside a sheet, regions are grid cells divided by 0.75px rules. Horizontal padding is `pad` (clamp(18px, 3vw, 44px), 18px on phones); section heads start `section` (clamp(56px, 11vh, 120px)) below the top rule.

Sheet grids as built:
- **Sheet 1** fills the first viewport below the strip in four columns: inventor fields (min 176px, 0.2fr), name and actions (1.1fr), Fig. 1 (0.92fr), reference list (min 186px, 0.2fr).
- **Specification sheet**: two equal columns, the figure sticky beside paragraphs tall enough (about 62vh each) for the scroll to drive the explosion.
- **Case sheets**: figure 1.3fr and text 1fr, swapping sides sheet by sheet; case text capped at 66ch.
- **History**: a timeline drawing over a fully ruled revision table, both capped at 1100px.
- **Claims**: 1.4fr text and 0.6fr seal.
- **Colophon**: a closing title block of ruled cells (auto, 1fr, 2fr, 1.2fr).

Responsive behaviour:
- At 1400px and below the invention title leaves the strip.
- At 1240px sheet 1 becomes two columns (name beside figure), the inventor fields fall under the name in two columns and the reference list spans the width in five.
- At 960px everything is one column. The strip nav hides; on the specification sheet the figure pins to the top at 50svh while paragraphs scroll beneath; case figures stack above their text; the colophon folds to two columns.
- At 640px pad drops to 18px, buttons go full width (figure controls excepted), registration marks hide, the reference list takes two columns and each revision-table row reflows into a two-column grid.

Rhythm: 12px between buttons (`actions`), 22px between the blocks of sheet 1 (`stack`), 16 to 20px inside narrow field columns, 0.7em between paragraphs.

### Named Rules
**The Ruled Cell Rule.** Regions are separated by rules, never by gaps, cards or tinted panels: 0.75px between cells inside a sheet, 1.5px between sheets. A new region is a new cell of the same sheet.

## Elevation & Depth

Flat paper. No shadow expresses hierarchy. Depth is drawn: inside figures, parts are painted back to front and filled with Bond so nearer parts hide farther ones, while 0.34-ratio ellipses and right-weighted shading lines give volume. In the interface, box-shadow only draws lines. Stacking order is structural: the frame (z 70) sits over the strip (60), which sits over the sheets; the boot curtain and the skip link sit above everything.

### Shadow Vocabulary
- **Inner rule** (`box-shadow: inset 0 0 0 3px var(--bond), inset 0 0 0 3.75px var(--ring)`): the second rule inside outline buttons; `--ring` is ink at rest and carmine on hover or when pressed.
- **Inner rule on ink** (`box-shadow: inset 0 0 0 3px var(--ink), inset 0 0 0 3.75px var(--bond)`): the same rule on the primary button and the CV cell; the ring turns carmine on hover.
- **Frame mask** (`box-shadow: 0 0 0 calc(var(--inset) + 2px) var(--bond), inset 0 0 0 4px var(--bond)`): paints the paper margin outside the frame and a clear band inside it, so scrolled content never touches the rule.

### Named Rules
**The Flat Paper Rule.** Nothing floats. box-shadow draws rules, never elevation; depth inside a figure comes from occlusion order and shading lines.

## Shapes

Square corners throughout the interface: buttons, strip cells, sheet marks, tables, the frame. Circles appear only as drawn objects: registration marks (22px, with a crosshair that overshoots 6px), the seal's three rings, the request sphere, timeline revision nodes, status lamps. Rounded rectangles exist only inside drawings, where the depicted object is itself rounded.

Interface rules: 0.75px India Ink for cell dividers, the inner frame line, the strip's bottom edge and link underlines; 1.5px for the outer frame, sheet separators, the revision table's top and bottom, and the scroll-progress line. Buttons combine a 1px border with a 0.75px inner ring.

Figure strokes (all non-scaling):
- Visible outline 1.4, thickened to 2.1 to 2.2 under examination.
- Thin detail 0.85, shading 0.6, hatch line 0.55, fine grid 0.4.
- Leader 0.8 (1.3 carmine under examination), ending in a 2.4-radius dot that shows only under examination.
- Axis 0.7, chain dash 18 5 3 5; target line 0.8, chain 14 4 2 4.
- Return path 0.8, dash 4 4; hidden box 0.8, dash 4 3; ghost 0.8, dash 3 3 at 0.55 opacity; projection 0.6, dash 6 4 at 0.8; boundary 0.9, dash 8 4; dotted grid 0.4, dash 2 3 at 0.7; prior series 1.1, dash 1.5 3.2.
- Hatching at 45° in three densities: dense (2.8 units), standard (5), sparse (9).
- Arrowheads are small solid ink triangles.

### Named Rules
**The Square Corner Rule.** Interface shapes have square corners. A curve on screen is either a drawn object or a leader line.

**The Line Convention Rule.** Continuous lines are visible edges. Dashed lines are hidden, returning or ghosted things. Chain lines (long, short) are axes and targets. Dotted lines are grids and prior series. A new figure keeps these meanings.

**The Hatch Rule.** Inside a figure, tone comes only from 45° hatching at the three densities. Solid fills are Bond (to occlude) or ink and carmine at dot scale (arrowheads, end dots, the "today" point).

## Components

### Buttons
Engraved plates: a hairline border with a second rule inside, like a boxed entry in a title block.
- **Shape:** square (0px), 1px India Ink border, 0.75px inner ring at a 3px inset.
- **Primary:** India Ink fill, Bond text, Bond inner ring. One per action group (download the CV, send an e-mail). Minimum height 46px, padding 0.85em 1.35em, Control type, 0.7em icon gap.
- **Secondary:** Bond fill, India Ink text, ink ring.
- **Hover / Focus:** the ring turns carmine over 0.18s on the settle ease; a trailing arrow icon nudges 3px right. Fill and text colour stay put. Pressing an outline button pulls the ring in to 4px and 5px. Focus is a 1.5px dashed carmine outline at a 3px offset. `aria-pressed="true"` keeps the carmine ring.
- **Small (figure controls):** minimum height 38px, padding 0.65em 1em, 0.75rem. Toggles swap their label between the two states.
- **Mobile:** at 640px and below, buttons fill the width with centred content; figure controls keep their natural width.
- **Icons:** inline 16-unit SVG at 1.05em in currentColor, stroked at 1.25 with square caps and miter joins; the play triangle is the one solid icon.

### Navigation
The title-block strip.
- **Style:** sticky under the top of the frame, 52px (48px at 960px and below), Bond ground, 0.75px bottom rule. Cells are divided by 0.75px vertical rules with 16px side padding.
- **Cells, in order:** the TD monogram; the invention title (hidden at 1400px and below); the sheet counter "FOLHA n DE 10" with the current number bold and tabular, updated as each sheet crosses the middle of the viewport; section links; the language switch; the pause toggle (a 52px square); the CV cell in ink with a Bond inner ring.
- **Links:** Old Standard TT 0.75rem, 0.15em, uppercase, no underline; hover turns them carmine; the active section gets a 1.5px carmine underline at a 0.5em offset.
- **Progress:** a 1.5px ink line along the strip's bottom edge, scaled from the left by page progress.
- **Mobile:** at 960px the links hide and the counter moves right; at 640px the counter drops the word "Folha" and the CV cell shows only its icon.

### Cards / Containers
There are no cards. Content sits in ruled cells of a sheet (see Layout).
- **Corner Style:** square.
- **Background:** Bond, never tinted.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 0.75px India Ink between cells, 1.5px between sheets.
- **Internal Padding:** `pad` horizontally; 16 to 20px in the narrow field columns.
- **Sheet mark:** every sheet closes with a boxed cell in its bottom-right corner reading "FOLHA n DE 10", 0.68rem at 0.18em in Diluted Ink, padding 7px 14px, ruled on its top and left edges.
- **Revision table:** fully ruled, 1.5px top and bottom, 0.75px inside. Revision letters in Old Standard TT at 1.7rem, dates in Courier Prime, the place column in label capitals; the current revision's letter is carmine.
- **Colophon:** the page ends in a final title block of ruled cells (monogram, copyright, source link, drafting note) in Source Serif 4 at 0.85rem, Diluted Ink.

### Reference Numerals and the Exam State
The signature interaction: the text and the drawing point at each other.
- Every part the text names carries a number: tens per figure, sub-parts by units (10, 12; 20, 22, 24; 31 to 35 in Fig. 3; and so on).
- A number appears in up to three places: on the figure with its leader, in the reference list, and inline in running text.
- Pointing at any of them puts every element with that number in the same sheet under examination: outlines turn carmine and thicken, leaders thicken and show their end dot, list entries and numerals turn carmine.
- On the specification sheet, the paragraph in reading position puts its part group under examination on its own, and its bracketed number turns carmine.
- The reference list sets each entry in 0.76rem capitals at 0.05em, with its number in a 2.1em tabular column.

### Figures
Patent drawings generated as inline SVG with exact geometry; no raster imagery appears on the sheets.
- **Convention:** circles are drawn as ellipses at a 0.34 ratio; cylinders are shaded with vertical lines that crowd toward the right edge (light from the upper left); spheres take three concentric arcs in the shadow quadrant. Each drawing is labelled "FIG. n", centred beneath it.
- **Leaders:** S-curves from the numeral (with a 9-unit gap) to the part. Left numerals are end-anchored, right numerals start-anchored.
- **Text inside a figure:** only numerals, FIG. labels, tick values, short state words and stamps. Explanation lives in the specification beside it.
- **Interaction:** demonstration figures replay or toggle from small buttons beneath them, draggable parts also move with the arrow keys, and crosshair readouts print in Courier Prime under the drawing.
- **Fictitious data:** any metric-looking figure carries a carmine "DADOS FICTÍCIOS" stamp inside its plot.
- **Fig. 2, the exploded view:** the assembled apparatus separates along its dashed axis as the first paragraph rises. Parts follow the scroll with a damped follow (0.14 of the remaining distance per frame, no overshoot). The request sphere travels to the part being described, then rides the return path while a carmine line draws behind it, and at 90% of the return the sheet is stamped with the seal. Under reduced motion the figure is served already exploded.

### Seal
- Three concentric rings (strokes 3, 1.2, 1.2), the words set on the arc in Old Standard TT 700 at 0.12em, "200" large in the centre; carmine at 0.94 opacity, rotated −8°.
- **Stamp motion (0.46s, settle ease):** from invisible at scale 1.35 and −18°, pressing to 0.97 and −7°, settling at 1 and −8°. It fires when the claims seal comes into view, or when the request returns in Fig. 2. Without JS, and under reduced motion, it is shown already stamped.

### Boot, Name and ASCII Eggs
Motion commitments carried by the product, redrawn for this world.
- **Boot plotter** (first visit per session): the frame is drawn as four 1.5px strokes, clockwise from the top left, 0.3s each on the plot ease; a display-size percentage counts to 100 in tabular figures; four Courier Prime log lines appear, the last in carmine; then the paper curtain wipes upward. A click or any key skips it; reduced motion never shows it.
- **Name scramble:** each letter of the name cycles through drafting glyphs (digits, ±, §, ¶, °, ×, #) in Wash Ink before settling, staggered 48ms per letter.
- **ASCII eggs:** after a pause on sheet 1, small ASCII animations appear only in that sheet's empty areas, in Courier Prime 13px/1.16, Wash Ink at 0.42 opacity (some in full ink, with a carmine flash on hits), at most two at once and one on phones.
- **Pause:** the strip's pause toggle stops every continuous motion (Fig. 1's circulating request, the message queue, the eggs) and is remembered per visitor.

## Do's and Don'ts

### Do:
- **Do** draw every new illustration as an SVG patent figure with the shared primitives: 0.34 isometric ellipses, right-weighted shading, curved leaders to numerals, the line conventions and the three hatch densities.
- **Do** give every part the text mentions a reference numeral, and wire its figure numeral, list entry and inline numeral to the same exam state.
- **Do** separate regions with 0.75px ink rules and sheets with 1.5px rules, and close each sheet with its boxed "FOLHA n DE N" mark, counted to the same total as the strip.
- **Do** use the ink button for the single primary action in a group and outline buttons for the rest; hover turns the ring carmine, never the fill.
- **Do** keep paragraphs in Source Serif 4 at 1.0625rem/1.65 within 58 to 70ch, and letterspace every Old Standard TT capital.
- **Do** stamp any metric-looking figure "DADOS FICTÍCIOS" in carmine Courier Prime.
- **Do** drive scroll-linked figures from the native scroll position, and give every continuous animation a paused and a reduced-motion state that shows the finished drawing.

### Don't:
- **Don't** build the category default: a dark hero with neon, or a grid of project cards.
- **Don't** use carmine for areas, decoration or emphasis that is neither a state nor an examiner's mark.
- **Don't** add hues, gradients, tinted panels or a page dark theme; the Fig. 6 inversion stays inside that figure.
- **Don't** round interface corners or add drop shadows; box-shadow only draws rules.
- **Don't** fill figure areas with solid ink or grey; tone is 45° hatching. Solid ink stays correct for the primary button, the CV cell and arrowheads.
- **Don't** set paragraphs in Old Standard TT or Courier Prime, or running text in capitals.
- **Don't** use emoji or icon fonts; icons are inline 16-unit SVG stroked at 1.25 with square caps and miter joins.
- **Don't** hijack wheel or keyboard scrolling.
- **Don't** reveal sheets or content blocks with a standalone fade; entrances are drawn, slid or stamped, and opacity only accompanies them.
