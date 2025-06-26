/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Define the exact block header as in the requirements.
  const headerRow = ['Columns (columns9)'];

  // 2. Get the image in the block (the only visible content in this specific panel).
  const img = element.querySelector('img');
  // If no image present, fallback to an empty cell.
  const cell = img ? img : '';

  // 3. Build the table as a 2D array: header and content row, one column per the only content present.
  const cells = [
    headerRow,
    [cell],
  ];

  // 4. Create the table and replace the original element.
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}