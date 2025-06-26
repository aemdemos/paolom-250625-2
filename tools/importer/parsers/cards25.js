/* global WebImporter */
export default function parse(element, { document }) {
  // Table header: block name as in the instructions
  const cells = [['Cards (cards25)']];

  // Helper to normalize whitespace
  function cleanText(str) {
    if (!str) return '';
    return str.replace(/\s+/g, ' ').trim();
  }

  // For each cp-group, build a card row
  const groups = element.querySelectorAll(':scope > .cp-group');
  groups.forEach(group => {
    // Get card title
    const titleDiv = group.querySelector('.cp-title');
    const titleText = cleanText(titleDiv ? titleDiv.textContent : '');
    // Get card main content
    const contentDiv = group.querySelector('.cp-content');
    // Compose content cell
    const contentCell = document.createElement('div');
    if (titleText) {
      // Use strong for title for semantic bold, on one line
      const heading = document.createElement('strong');
      heading.textContent = titleText;
      contentCell.appendChild(heading);
      contentCell.appendChild(document.createElement('br'));
    }
    // Insert all children from contentDiv (including <br>s and text)
    if (contentDiv) {
      Array.from(contentDiv.childNodes).forEach(n => {
        contentCell.appendChild(n.cloneNode(true));
      });
    }
    cells.push(['', contentCell]); // No image/icon, so empty string in first column
  });

  // Check and insert trailing notes (e.g. "* Closed on Public Holidays")
  // Looks for text nodes or elements outside .cp-group
  let afterLastGroup = groups[groups.length-1]?.nextSibling;
  while (afterLastGroup) {
    // If it's a text node and has visible text, insert as a note row
    if (afterLastGroup.nodeType === Node.TEXT_NODE && /Closed on Public Holidays/i.test(afterLastGroup.textContent)) {
      const noteDiv = document.createElement('div');
      noteDiv.textContent = cleanText(afterLastGroup.textContent);
      cells.push(['', noteDiv]);
      break;
    }
    // Also check element siblings
    if (afterLastGroup.nodeType === Node.ELEMENT_NODE && /Closed on Public Holidays/i.test(afterLastGroup.textContent)) {
      const noteDiv = document.createElement('div');
      noteDiv.textContent = cleanText(afterLastGroup.textContent);
      cells.push(['', noteDiv]);
      break;
    }
    afterLastGroup = afterLastGroup.nextSibling;
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
