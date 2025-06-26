/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row as per example (exact match)
  const headerRow = ['Search'];

  // Collect all visible content (excluding .sr-only) in a single container
  const visibleContent = [];
  // We'll walk the element and include all children that are not screen-reader-only
  Array.from(element.childNodes).forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE && child.classList.contains('sr-only')) {
      return;
    }
    // For direct children that are wrappers (like div.container), descend one level deeper
    if (child.nodeType === Node.ELEMENT_NODE && child.childNodes.length && child.childNodes.length < 5 && child.childNodes.length > 0) {
      Array.from(child.childNodes).forEach((grandchild) => {
        if (!(grandchild.nodeType === Node.ELEMENT_NODE && grandchild.classList.contains('sr-only'))) {
          visibleContent.push(grandchild);
        }
      });
    } else {
      visibleContent.push(child);
    }
  });

  // Remove empty text nodes and whitespace-only nodes
  const filteredContent = visibleContent.filter((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent.trim().length > 0;
    }
    return true;
  });

  // If nothing found, fallback to full element content
  const cellContent = filteredContent.length ? filteredContent : [element];

  // Compose table matching the markdown structure: one header, one cell with all visible content
  const cells = [
    headerRow,
    [cellContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
