/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per spec
  const headerRow = ['Cards (cards13)'];
  const rows = [headerRow];

  const cardLinks = element.querySelectorAll('.explore-more__listing > .explore-more__item');

  cardLinks.forEach((card) => {
    // 1. IMAGE CELL: get the main card image from inside picture
    let imageEl = null;
    const picture = card.querySelector('picture');
    if (picture) {
      imageEl = picture.querySelector('img');
    }

    // 2. TEXT CELL: use the <p> element's text as the card heading
    // In this source, the <p> contains just a single line (the 'title'), so we will wrap it in a <strong> for strong heading semantics
    let textCell;
    const p = card.querySelector('p');
    if (p && p.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = p.textContent.trim();
      textCell = strong;
    } else {
      textCell = '';
    }

    // Build row: [image, text cell]
    rows.push([imageEl, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
