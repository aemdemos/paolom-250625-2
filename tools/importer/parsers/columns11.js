/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main list wrapper
  const container = element.querySelector('.container');
  if (!container) return;
  const list = container.querySelector('.eservice-sidebar__list');
  if (!list) return;
  const items = Array.from(list.children).filter(li => li.tagName === 'LI');

  // Build columns: one per li
  const columns = items.map(li => {
    const a = li.querySelector('a');
    if (!a) return '';

    // Find the normal icon
    const normalImg = a.querySelector('img.normal');
    // Use the .label span for text
    const label = a.querySelector('.label');

    const children = [];
    if (normalImg) children.push(normalImg);
    if (label) {
      // Reference existing label element's text in a <div> for clarity
      const labelDiv = document.createElement('div');
      labelDiv.textContent = label.textContent;
      children.push(labelDiv);
    }
    return children;
  });

  const headerRow = ['Columns (columns11)']; // exactly one cell in the header row
  const tableCells = [headerRow, columns]; // second row is the array of columns

  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
