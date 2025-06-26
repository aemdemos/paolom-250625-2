/* global WebImporter */
export default function parse(element, { document }) {
  // Find the info-panels for the four display columns. Use the known IDs/order.
  const panelIds = ['item3', 'item1', 'item4', 'item2'];
  const panels = panelIds.map(id => element.querySelector(`.info-panel[id="${id}"]`));

  // Defensive: ensure at least one panel is present
  if (!panels.some(Boolean)) return;

  // For each panel, reference its main content container if it exists, else an empty div
  const columns = panels.map(panel => {
    if (!panel) return document.createElement('div');
    const content = panel.querySelector('.info-panel__content-container');
    return content || document.createElement('div');
  });

  const headerRow = ['Columns (columns1)'];
  const tableRows = [headerRow, columns];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
