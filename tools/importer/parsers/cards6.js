/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards6) block header
  const header = ['Cards (cards6)'];
  const cells = [header];

  // Find all card containers
  const cardContainers = element.querySelectorAll('.info-panel__card-item-content-container');

  cardContainers.forEach((card) => {
    // --- IMAGE CELL ---
    // Find image element (first <img> inside .poster-container)
    let img = card.querySelector('.poster-container img');

    // --- TEXT CELL ---
    // Subtitle (below image), acted as heading
    let subtitle = card.querySelector('.info-panel__card-img .desc');
    // Main card description
    let desc = card.querySelector('.info-panel__card-desc');

    // Compose text cell
    const textDiv = document.createElement('div');
    // Add subtitle as heading (bold)
    if (subtitle && subtitle.textContent.trim()) {
      const strong = document.createElement('strong');
      strong.textContent = subtitle.textContent;
      textDiv.appendChild(strong);
      textDiv.appendChild(document.createElement('br'));
    }
    if (desc && desc.childNodes.length) {
      desc.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'STRONG') {
          // Add bold span for years
          const strong = document.createElement('strong');
          strong.textContent = node.textContent;
          textDiv.appendChild(strong);
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textDiv.appendChild(document.createTextNode(node.textContent));
        }
      });
    }

    // Compose row
    cells.push([
      img || '',
      textDiv.childNodes.length ? textDiv : '',
    ]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
