/* global WebImporter */
export default function parse(element, { document }) {
  // The header row should be EXACTLY one column with the correct label
  const cells = [['Accordion (accordion5)']];

  // Each direct child div with the correct classes is an accordion item
  const childDivs = element.querySelectorAll(':scope > div');
  childDivs.forEach((div) => {
    if (div.classList.contains('collapse-title') && div.classList.contains('accordion')) {
      // Title in column 1, content in column 2 (empty here)
      cells.push([div, '']);
    }
  });

  // Only create and replace if there's at least one accordion item
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
