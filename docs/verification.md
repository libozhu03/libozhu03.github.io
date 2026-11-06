# Verification — 2026-11-06

## Content and behavior
- Profile data and portrait extracted from the user-provided resume. Only professional profile information is included. Full PDF and unrelated personal information are absent.
- Publications and projects are intentionally empty, as requested; populated-content filtering is verified with test-only fixtures.
- Node render suite: 4 passing checks. Browser suite: 7 passing checks in headless Microsoft Edge.
- Browser checks cover working mobile navigation, Escape/focus, project filters, image/font loading, no JavaScript fallback, fragment targets, and absence of horizontal overflow at 320/390/768/1024/1440px.

## Visual comparison
The user-selected reference is https://www.chiaofang.tw/. `design-concept.png` is a generated implementation aid, not an independently approved redesign. Where they differ, the user's reference takes precedence.

IAB was unavailable. Reference and implementation were rendered in Playwright using installed Microsoft Edge and inspected through `view_image`. Desktop screenshots use 1440px width, mobile 390px. The concept is 1024px wide; an additional full-page screenshot at 1024px was captured and inspected for responsive fit.

| Element | Reference / concept | Implementation and intentional differences |
|---|---|---|
| Structure | Portrait left, About right; section headings left | Retained on desktop, stacked on mobile |
| Typography | Reference uses light Montserrat headings and Roboto body | Local font files; lighter headings intentionally follow original reference rather than generated bold headings |
| Profile | Circle portrait; generated concept uses LZ placeholder | Replaced with the user's real resume photograph, centered circular crop |
| Colors | White, blue links, subtle cool/warm background | #1565c0 links, pale blue Publications and gray Contact; soft About wash, no copied landscape asset |
| Content | About, Publications, Projects, Contact | Exact section order and honest empty-state copy; no fabricated papers or projects |
| Navigation | Reference navigation plus CV/theme controls | Four working anchors and a mobile menu; CV omitted until a public CV is supplied; back-to-top link included |
| Contact | Readable resource links | Verified email and academic GitHub, no contact form backend |

Above-the-fold copy reviewed: name, Chinese name, doctoral role, university, biography, interests and education are present. No marketing headings, badges or invented academic claims were added. Back-to-top text is an intentional navigation utility. No clipping or image-loading mismatches were observed.

## Delivery boundary
Only `dist/` is deployed; tests, docs, design concept and source content are outside the Pages artifact. Font license files accompany the deployed fonts. Source documentation explains how to add future papers, project images and an optional public CV.

## Independent review
No Critical or Important findings. A minor navigation-highlight issue was reproduced: the same position selected different links when scrolling down and up. A new browser regression test failed before the fix. The navigation now determines the active section from current section positions, with animation-frame throttling; the full suite passed after the fix.
