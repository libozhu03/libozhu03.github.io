# Personal homepage design

Build Libo Zhu's academic homepage, inspired by https://www.chiaofang.tw/.
The user selected this reference, supplied a CV for profile information, and explicitly requested a framework with publication/project content to follow. Deploy to `libozhu03.github.io` after authenticating the requested account.

## Structure and appearance
- English homepage with Chinese name alongside the English name.
- White background, alternating #f7f7f7 sections, blue #1565c0 links, dark readable text.
- Reference-style About layout: circular portrait and identity left, biography and education right. Lower sections use a left heading column and a right content column.
- Sections: About, Publications, Projects, Contact. Modest sticky navigation, keyboard-accessible mobile menu.
- Publication rows support image, title, authors, venue, year and resource links. Projects support images, descriptions, categories and resource links, with working category filtering when content exists.
- Empty lists show brief honest copy, without fabricated work, fake links or dummy paper cards.
- At narrow widths all content stacks; no horizontal scrolling. Respect reduced-motion preferences.

## Profile content
Use name, portrait, professional email, degree and university from the supplied resume. Infer only broad research interests from its described work; do not claim a PhD supervisor from project-supervisor fields. Do not publish the full PDF, phone, date of birth, grades or unpublished work. Academic GitHub link and deployment owner: libozhu03.

## Approaches
The reference uses Hugo/Wowchemy. A full theme would add tooling beyond this initial framework; React would require a client app for mostly static text. Builder choice: dependency-free static rendering with Node.js, JSON content, plain CSS, and small progressive-enhancement JavaScript. This preserves the reference's layout while keeping content edits simple.

## Delivery
Source in E:/Labor_workspace/libozhu03.github.io. Build into dist; publish only dist through GitHub Pages. Provide reproducible build/test/deploy instructions and content examples kept outside published assets. User has authorized construction and deployment; no separate design approval loop is required. Actual deployment depends on owner authentication.
