/* global WebImporter */
export default function parse(element, { document }) {
  // The Embed block expects a single table: header row is 'Embed',
  // and content row has all images being embedded, in order.
  const headerRow = ['Embed'];
  let images = [];

  // Find all images in the carousel
  const carousel = element.querySelector('.photo-panel-carousel');
  if (carousel) {
    // Only take images with a valid src (skip empty src)
    images = Array.from(carousel.querySelectorAll('img')).filter(img => img.src && img.src.startsWith('http'));
  }

  // Guard against empty: if no images, leave cell empty
  const cellContent = images.length > 0 ? images : '';
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContent]
  ], document);
  element.replaceWith(table);
}
