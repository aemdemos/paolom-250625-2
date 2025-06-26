/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: one cell with block name
  const cells = [['Accordion (accordion8)']];

  // Each accordion item: two columns (title, content). Extract from <select> options.
  const select = element.querySelector('select');
  if (select) {
    select.querySelectorAll('option').forEach((opt) => {
      const title = opt.textContent.trim();
      // Even if content is empty, include a second empty column
      cells.push([title, '']);
    });
  }

  // Create and replace the original element with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
