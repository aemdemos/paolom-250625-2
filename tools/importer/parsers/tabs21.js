/* global WebImporter */
export default function parse(element, { document }) {
  // Find the active Our Commissioners panel
  const commissionersPanel = element.querySelector('.info-panel.right.active#item1');
  if (!commissionersPanel) return;

  // Find the cards container within this panel
  const cardsContainer = commissionersPanel.querySelector('.content-container__cards');
  if (!cardsContainer) return;

  // Get all tab labels (periods at top, e.g., '2018 to Present', etc.)
  // These are in .sub-category .sub-category__item span
  const tabLabelEls = commissionersPanel.querySelectorAll('.sub-category .sub-category__item span');
  // Get all available card containers, which are for each tab
  const cardContainers = cardsContainer.querySelectorAll('.info-panel__card-container');

  // Safety check: number of labels and cards should match
  if (tabLabelEls.length !== cardContainers.length) {
    // Some tabs may not have content loaded, fallback to those that exist
    const minLength = Math.min(tabLabelEls.length, cardContainers.length);
    // Truncate to the min
    const tabLabelElsArr = Array.from(tabLabelEls).slice(0, minLength);
    const cardContainersArr = Array.from(cardContainers).slice(0, minLength);
    return insertCommissionersTabsTable(document, commissionersPanel, tabLabelElsArr, cardContainersArr);
  } else {
    return insertCommissionersTabsTable(document, commissionersPanel, Array.from(tabLabelEls), Array.from(cardContainers));
  }

  // Helper function
  function insertCommissionersTabsTable(document, commissionersPanel, tabLabelEls, cardContainers) {
    // Table header
    const headerRow = ['Tabs (tabs21)'];
    // Tab label row - each tab label is a <span>, preserve it as an element
    const labelRow = tabLabelEls.map(el => el);
    // Tab content row - each is the card's main content container
    const contentRow = cardContainers.map(card => {
      // Only include the main card content; reference the DOM node
      // The content is in .info-panel__card inside each cardContainer
      const cardContent = card.querySelector(':scope > .info-panel__card');
      return cardContent || '';
    });

    const table = WebImporter.DOMUtils.createTable([
      headerRow,
      labelRow,
      contentRow
    ], document);
    commissionersPanel.replaceWith(table);
  }
}
