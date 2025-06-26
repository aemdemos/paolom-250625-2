/* global WebImporter */
export default function parse(element, { document }) {
  // Find the image element in the carousel
  let imgEl = null;
  const carousel = element.querySelector('.carousel');
  if (carousel) {
    // Prefer direct <img> inside the <picture>
    const img = carousel.querySelector('img');
    if (img) {
      imgEl = img;
    } else if (carousel.style.backgroundImage) {
      // Fallback: create img from background-image
      const urlMatch = carousel.style.backgroundImage.match(/url\((['"]?)(.*?)\1\)/);
      if (urlMatch && urlMatch[2]) {
        imgEl = document.createElement('img');
        imgEl.src = urlMatch[2];
      }
    }
  }
  // If there is an <a> tag, prefer the link as the main cell content
  let mainContent = null;
  if (carousel) {
    const a = carousel.querySelector('a.slide-wrapper');
    if (a && imgEl) {
      mainContent = a;
    } else if (imgEl) {
      mainContent = imgEl;
    } else {
      mainContent = carousel;
    }
  } else {
    mainContent = element;
  }

  // Build the table as described
  const cells = [
    ['Columns (columns24)'],
    [mainContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
