import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
      if (block.classList.contains('staff-picks')) {
        const heading = div.querySelector('h2, h3');
        const category = heading?.previousElementSibling;
        if (category?.matches('p') && !category.querySelector('picture')) {
          category.classList.add('staff-picks-category');
        }
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    const optimized = picture.querySelector('img');
    ['width', 'height'].forEach((attribute) => {
      if (img.hasAttribute(attribute)) {
        optimized.setAttribute(attribute, img.getAttribute(attribute));
      }
    });
    img.closest('picture').replaceWith(picture);
  });
  block.replaceChildren(ul);
}
