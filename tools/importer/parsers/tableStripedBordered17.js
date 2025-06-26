/* global WebImporter */
export default function parse(element, { document }) {
  // 1. The header row: block name as a single cell
  const headerRow = ['Table (striped, bordered, tableStripedBordered17)'];
  // 2. The table header row: matches example markdown
  const tableHeaderRow = ['Product Name', 'Website'];

  // 3. Find the menu <ul> (should be present in all expected input variants)
  const ul = element.querySelector('ul');
  const rows = [];
  if (ul) {
    ul.querySelectorAll(':scope > li').forEach(li => {
      // a. Get anchor (menu link)
      const a = li.querySelector('a');
      if (!a) return;
      // b. Get label text: prefer .label, fallback to meaningful text in <a>
      let label = '';
      const labelSpan = a.querySelector('.label');
      if (labelSpan && labelSpan.textContent.trim()) {
        label = labelSpan.textContent.trim();
      } else {
        // Fallback: join all non-empty text nodes in the anchor
        label = Array.from(a.childNodes)
          .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim())
          .map(node => node.textContent.trim()).join(' ');
        if (!label) {
          label = a.textContent.trim();
        }
      }
      // c. Reference a new <a> element for the cell, but use href from DOM
      const linkEl = document.createElement('a');
      linkEl.href = a.href;
      linkEl.textContent = a.href;
      rows.push([label, linkEl]);
    });
  }

  // 4. Compose all rows for createTable
  const cells = [
    headerRow,         // ['Table (striped, bordered, tableStripedBordered17)']
    tableHeaderRow,    // ['Product Name', 'Website']
    ...rows            // each: [label, linkEl]
  ];

  // 5. Create the table using WebImporter API
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace original element with new block
  element.replaceWith(block);
}
