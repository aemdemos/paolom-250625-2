/* global WebImporter */
export default function parse(element, { document }) {
  // Compose the table header as required
  const headerRow = ['Cards (cards20)'];
  const rows = [];

  // 1. Facebook Card
  const fbSection = element.querySelector('.news-guide__left .news-guide__fb');
  if (fbSection) {
    // Left cell: Facebook iframe as a link (not image)
    const fbIframe = fbSection.querySelector('iframe[src]');
    let leftCell = null;
    if (fbIframe) {
      const fbLink = document.createElement('a');
      fbLink.href = fbIframe.src;
      fbLink.textContent = 'Facebook Feed';
      fbLink.target = '_blank';
      leftCell = fbLink;
    } else {
      leftCell = document.createTextNode('Facebook Feed');
    }
    // Right cell: Use the existing header element for maximal robustness
    let rightCell = null;
    const fbHeader = fbSection.querySelector('.news-guide__fb__header') || fbSection.querySelector('h3');
    if (fbHeader) {
      rightCell = fbHeader;
    } else {
      // fallback
      const fallbackDiv = document.createElement('div');
      fallbackDiv.textContent = 'Facebook';
      rightCell = fallbackDiv;
    }
    rows.push([leftCell, rightCell]);
  }

  // 2. News Cards
  const newsCards = element.querySelectorAll('.news-cards .news-article-card');
  newsCards.forEach(card => {
    // First cell: the image
    const img = card.querySelector('img');
    // Second cell: all the text content (date, title)
    const textDiv = document.createElement('div');
    // Get all children from card .news-article-card__text
    const cardText = card.querySelector('.news-article-card__text');
    if (cardText) {
      Array.from(cardText.childNodes).forEach(node => {
        if (
          (node.nodeType === 1 && node.textContent.trim()) ||
          (node.nodeType === 3 && node.textContent.trim())
        ) {
          textDiv.appendChild(node.cloneNode(true));
        }
      });
    }
    rows.push([img, textDiv]);
  });

  // 3. Traffic card
  const traffic = element.querySelector('.news-guide__traffic');
  if (traffic) {
    // Left cell: the image (if present)
    const img = traffic.querySelector('.news-guide__link__image img');
    // Right cell: include both the CTA and any text paragraphs
    const rightDiv = document.createElement('div');
    // CTA (strong, with only text content from .news-guide__link__text)
    const cta = traffic.querySelector('.news-guide__link__text');
    if (cta) {
      const strong = document.createElement('strong');
      strong.textContent = cta.textContent.trim();
      rightDiv.appendChild(strong);
    }
    // All paragraphs (for hotline, etc.)
    const paragraphs = traffic.querySelectorAll('p');
    paragraphs.forEach(p => {
      if (p.textContent.trim()) {
        rightDiv.appendChild(p);
      }
    });
    rows.push([img, rightDiv]);
  }

  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
