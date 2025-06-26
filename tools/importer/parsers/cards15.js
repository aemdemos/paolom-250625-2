/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row: must exactly match example
  const cells = [['Cards (cards15)']];

  // Find cards container
  const personaCards = element.querySelector('.persona-cards');
  if (!personaCards) return;

  // Select all card elements
  const cards = personaCards.querySelectorAll('.persona-card');
  cards.forEach((card) => {
    // Get image from <img> inside .persona-card__img-wrapper
    let img = null;
    const imgWrapper = card.querySelector('.persona-card__img-wrapper');
    if (imgWrapper) {
      img = imgWrapper.querySelector('img');
    }

    // Get the card title
    let titleElem = null;
    const content = card.querySelector('.persona-card__content');
    if (content) {
      const title = content.querySelector('.persona-card__title');
      if (title) {
        // Use <strong> for card heading as in example screenshot
        titleElem = document.createElement('strong');
        titleElem.textContent = title.textContent.trim();
      }
    }
    // Each row: image in column 1, title in column 2
    // Only add row if there is at least an image or a title
    if (img || titleElem) {
      const col1 = img;
      const col2 = titleElem ? [titleElem] : [];
      cells.push([col1, col2]);
    }
  });

  // Create and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
