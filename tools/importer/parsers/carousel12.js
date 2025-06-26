/* global WebImporter */
export default function parse(element, { document }) {
  // Get the carousel track (contains slides)
  const track = element.querySelector('.slick-track');
  if (!track) return;
  const slides = Array.from(track.children).filter(slide => slide.classList.contains('slick-slide'));
  if (!slides.length) return;

  const rows = [['Carousel']];

  slides.forEach((slide) => {
    // Each slide has .info-panel__card-item-content-container
    const contentContainer = slide.querySelector('.info-panel__card-item-content-container');
    if (!contentContainer) return;
    // 1. Image: '.poster-container img' (first cell)
    let imageEl = null;
    const posterContainer = contentContainer.querySelector('.poster-container');
    if (posterContainer) {
      imageEl = posterContainer.querySelector('img');
    }
    // 2. Text:
    //   - Caption: '.desc' (p.desc) under image (optional)
    //   - Description: '.info-panel__card-desc'
    let textContent = [];
    const caption = contentContainer.querySelector('.info-panel__card-img .desc');
    const desc = contentContainer.querySelector('.info-panel__card-desc');
    if (caption) {
      textContent.push(caption);
    }
    if (desc) {
      if (textContent.length > 0) {
        // add spacing between caption and desc
        textContent.push(document.createElement('br'));
        textContent.push(document.createElement('br'));
      }
      textContent.push(desc);
    }
    if (!imageEl && textContent.length === 0) {
      // skip empty slide
      return;
    }
    if (!imageEl) imageEl = '';
    if (textContent.length === 0) textContent = [''];
    rows.push([
      imageEl,
      textContent.length === 1 ? textContent[0] : textContent,
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
