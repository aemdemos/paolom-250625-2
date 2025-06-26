/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children that are columns with a deck-group containing content
  const columns = Array.from(element.querySelectorAll(':scope > div')).filter(col => {
    const deckGroup = col.querySelector('.deck-group');
    return deckGroup && deckGroup.children.length > 0;
  });

  if (columns.length === 0) return;

  // Gather each column's content into a fragment
  const colCells = columns.map(col => {
    const deckGroup = col.querySelector('.deck-group');
    const frag = document.createDocumentFragment();
    Array.from(deckGroup.children).forEach(child => {
      frag.appendChild(child);
    });
    return frag;
  });

  // The header row must be a single cell array, even for multiple columns
  const headerRow = ['Columns (columns16)'];
  const rows = [headerRow, colCells];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
