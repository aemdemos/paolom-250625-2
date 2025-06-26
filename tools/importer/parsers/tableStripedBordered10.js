/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row (matches block name exactly)
  const headerRow = ['Table (striped, bordered, tableStripedBordered10)'];

  // The block should contain the existing logo link (including images) as a single cell
  // This ensures all logo representations are carried into the table
  const logoLink = element.querySelector('a');

  // If there's no logo link, fallback to the element's content (edge case handling)
  const contentRow = [logoLink ? logoLink : element];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original block with the table
  element.replaceWith(table);
}
