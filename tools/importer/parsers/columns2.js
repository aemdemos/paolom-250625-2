/* global WebImporter */
export default function parse(element, { document }) {
  // Get all immediate .cp-group children (each is a column)
  const groups = Array.from(element.querySelectorAll(':scope > .cp-group'));
  if (!groups.length) return;

  // Find any trailing notes or footnote siblings after the last cp-group
  const columnCells = [];
  groups.forEach((group) => {
    columnCells.push(group);
  });
  // Check for footnote after last cp-group
  let afterNodes = [];
  let last = groups[groups.length-1];
  let node = last.nextSibling;
  while (node) {
    // Only include non-empty text or elements
    if (
      (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) ||
      (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim())
    ) {
      afterNodes.push(node);
    }
    node = node.nextSibling;
  }
  if (afterNodes.length) {
    columnCells.push(afterNodes);
  }

  // Header: single cell, not multiple columns!
  const cells = [
    ['Columns (columns2)'],
    columnCells
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
