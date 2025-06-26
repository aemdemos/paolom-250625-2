/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Compose header row as in the example (EXACT TEXT: "Hero", no markdown, no styling)
  const headerRow = ['Hero'];

  // 2. Find the image for the background (as in example, 2nd row)
  // Try to find an <img> in the block, or a background-image url
  let bgImg = null;
  let foundImg = element.querySelector('img');
  if (foundImg) {
    bgImg = foundImg;
  } else {
    // If no <img>, try to get from style="background-image:url..."
    const bgDiv = element.querySelector('[style*="background-image"]');
    if (bgDiv && bgDiv.style.backgroundImage) {
      const match = bgDiv.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        const imgEl = document.createElement('img');
        imgEl.src = match[1];
        imgEl.alt = '';
        bgImg = imgEl;
      }
    }
  }

  // 3. Gather all visible text and CTA for the third row
  // - This should include headings, paragraphs, and any visible link/cta
  // - Keep the semantic structure: references to existing elements, not clones or strings
  // - If multiple elements, combine all into a single cell (array)
  // - If nothing, cell must be blank string

  // (a) Gather all heading and paragraph elements in order of appearance
  let contentEls = [];
  // Include all heading and paragraph elements that are descendants of the block
  element.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((el) => {
    if (el.textContent.trim().length > 0) {
      contentEls.push(el);
    }
  });
  
  // (b) If no heading found, try to generate from aria-label of CTA link or alt of image (like in this example)
  if (contentEls.length === 0) {
    // Try link aria-label
    const mainLink = element.querySelector('a[aria-label]');
    if (mainLink && mainLink.getAttribute('aria-label')) {
      const h1 = document.createElement('h1');
      h1.textContent = mainLink.getAttribute('aria-label');
      contentEls.push(h1);
    } else if (bgImg && bgImg.alt) {
      const h1 = document.createElement('h1');
      h1.textContent = bgImg.alt;
      contentEls.push(h1);
    }
  }

  // (c) Add any call-to-action link (if not already included above)
  // If the link is visible and has text or if it's the main CTA
  const mainLink = element.querySelector('a');
  if (mainLink && mainLink.innerText && mainLink.innerText.trim().length > 0) {
    if (!contentEls.includes(mainLink)) {
      contentEls.push(mainLink);
    }
  }

  // (d) If no content at all, cell must be blank string
  if (contentEls.length === 0) contentEls = [''];
  
  // 4. Compose the 3-row, 1-column table
  const rows = [
    headerRow,
    [bgImg ? bgImg : ''],
    [contentEls]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  
  // 5. Replace the original element with the new table (no return)
  element.replaceWith(table);
}
