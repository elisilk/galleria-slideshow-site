// ----------------------------------------
// HTML elements to save
// ----------------------------------------

let gallery, galleryItems;
let details, detailsItems;

const slideshowButton = document.getElementById('slideshow-button');
const loader = document.querySelector('.loader');

// ----------------------------------------
// Gallery Data
// ----------------------------------------

var allGalleryData;

async function getData(file) {
  try {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
  }
}

const renderGalleryItem = (itemData, parent) => {
  const itemElement = document.createElement('div');
  itemElement.classList.add('card', 'item');
  parent.appendChild(itemElement);

  const cardImgElement = document.createElement('div');
  cardImgElement.classList.add('card__img');
  itemElement.appendChild(cardImgElement);

  const itemThumbnail = new Image();
  itemThumbnail.src = itemData.images.thumbnail;
  itemThumbnail.onload = function () {
    itemThumbnail.alt = itemData.name + ' thumbnail';
    itemThumbnail.width = itemThumbnail.naturalWidth;
    itemThumbnail.height = itemThumbnail.naturalHeight;
  };
  cardImgElement.appendChild(itemThumbnail);

  // TO DO: update the target URL with something that works for the gallery
  const cardTextHTML = `
    <div class="card__text">
      <h2 class="card__title heading2">
        <a href="#" class="card__link" data-name="${itemData.name}">${itemData.name}</a>
      </h2>
      <p class="card__subtitle">${itemData.artist.name}</p>
    </div>
    `;
  itemElement.insertAdjacentHTML('beforeend', cardTextHTML);
};

const renderGallery = (data, parent) => {
  const galleryElement = document.createElement('section');
  galleryElement.id = 'gallery';
  galleryElement.classList.add('masonry', 'hidden');
  data.forEach((item) => {
    renderGalleryItem(item, galleryElement);
  });
  parent.appendChild(galleryElement);
  return galleryElement;
};

// ----------------------------------------
// Details
// ----------------------------------------

const renderDetailsItem = (itemData, parent) => {
  const itemElement = document.createElement('article');
  itemElement.classList.add('detail', 'grid', 'hidden');
  itemElement.dataset.name = itemData.name;
  parent.appendChild(itemElement);

  const itemHeroElement = document.createElement('div');
  itemHeroElement.classList.add('detail__hero');
  itemElement.appendChild(itemHeroElement);

  const itemHeroImageElement = document.createElement('div');
  itemHeroImageElement.classList.add('detail__image');
  itemHeroElement.appendChild(itemHeroImageElement);

  const itemHeroPictureElement = document.createElement('picture');
  itemHeroImageElement.appendChild(itemHeroPictureElement);

  const itemHeroSourceElement = document.createElement('source');
  itemHeroSourceElement.srcset = itemData.images.hero.large;
  itemHeroSourceElement.media = '(min-width: 960px)';
  const itemHeroImgLarge = new Image();
  itemHeroImgLarge.src = itemData.images.hero.large;
  itemHeroImgLarge.onload = function () {
    itemHeroSourceElement.width = itemHeroImgLarge.naturalWidth;
    itemHeroSourceElement.height = itemHeroImgLarge.naturalHeight;
  };
  itemHeroPictureElement.appendChild(itemHeroSourceElement);

  const itemHeroImg = new Image();
  itemHeroImg.src = itemData.images.hero.small;
  itemHeroImg.onload = function () {
    itemHeroImg.alt = itemData.name + ' hero';
    itemHeroImg.width = itemHeroImg.naturalWidth;
    itemHeroImg.height = itemHeroImg.naturalHeight;
  };
  itemHeroPictureElement.appendChild(itemHeroImg);

  const itemHeroButtonHTML = `
    <button class="view-image-btn flex">
      <img src="assets/shared/icon-view-image.svg" alt="View image" width="12" height="12">
      <span>View image</span>
    </button>
    `;

  itemHeroImageElement.insertAdjacentHTML('beforeend', itemHeroButtonHTML);

  const itemHeadingHTML = `
    <div class="detail__heading">
      <h1 class="heading1">${itemData.name}</h1>
      <p class="subhead1">${itemData.artist.name}</p>
    </div>
  `;
  itemHeroElement.insertAdjacentHTML('beforeend', itemHeadingHTML);

  const artistImgElement = document.createElement('div');
  artistImgElement.classList.add('detail__artist');
  itemHeroElement.appendChild(artistImgElement);

  const itemArtistImg = new Image();
  itemArtistImg.src = itemData.artist.image;
  itemArtistImg.onload = function () {
    itemArtistImg.alt = itemData.artist.name + ' artist thumbnail';
    itemArtistImg.width = itemArtistImg.naturalWidth;
    itemArtistImg.height = itemArtistImg.naturalHeight;
  };
  artistImgElement.appendChild(itemArtistImg);

  const itemTextHTML = `
    <div class="detail__text">
      <p class="detail__year display">${itemData.year}</p>
      <p class="detail__desc">${itemData.description}</p>
      <a class="detail__source link2" href="${itemData.source}" rel="external">Go to source</a>
    </div>
    `;
  itemElement.insertAdjacentHTML('beforeend', itemTextHTML);
};

const renderDetails = (data, parent) => {
  const detailsElement = document.createElement('section');
  detailsElement.id = 'details';
  data.forEach((item) => {
    renderDetailsItem(item, detailsElement);
  });
  parent.appendChild(detailsElement);
  return detailsElement;

  /* data.forEach((item) => {
    renderDetailsItem(item, parent);
  }); */
};

// ----------------------------------------
// HTML Elements Hide/Show
// ----------------------------------------

const hideHTMLElement = (element) => {
  element.classList.add('hidden');
};

const showHTMLElement = (element) => {
  element.classList.remove('hidden');
};

// ----------------------------------------
// Gallery Card Click Event Handler
// ----------------------------------------

const handleSlideshowButtonClicked = (e) => {
  e.preventDefault();
  console.log('Slideshow button clicked');

  // if gallery is showing, start the slideshow

  // else gallery is not showing, so stop the slideshow
};

const handleGalleryCardLinkClicked = (e) => {
  e.preventDefault();
  // console.log("Gallery card button clicked:", e.target.dataset.name);

  // hide the gallery
  hideHTMLElement(gallery);

  // find the chosen item among the list of details items
  const chosenItem = Array.from(detailsItems).filter(
    (item) => item.dataset.name === e.target.dataset.name
  );

  // unhide that chosen element
  if (chosenItem.length > 0) showHTMLElement(chosenItem[0]);
};

// ----------------------------------------
// Card (Inclsuive Components)
// - https://inclusive-components.design/cards/
// ----------------------------------------

const handleCardClick = (card) => {
  let down,
    up,
    link = card.querySelector('.card__title > a');
  /* button = card.querySelector(".card__title > button"); */
  card.onmousedown = () => {
    down = +new Date();
    /* console.log(down); */
  };
  card.onmouseup = () => {
    up = +new Date();
    /* console.log(down); */
    if (up - down < 200) {
      link.click();
    }
  };
};

// ----------------------------------------
// Flex Masonry
// ----------------------------------------

/* Flex Masonry - based on/adapted from:
 * - Idea by Tobias Ahlin, "CSS masonry with flexbox, :nth-child(), and order" https://tobiasahlin.com/blog/masonry-with-css/
 * - JS implementation by Gilbert Pellegrom - https://github.com/gilbitron/flexmasonry / https://flexmasonry.vercel.app/
 */

let masonryState = {
  container: null,
  items: null,
  /* Options */
  minColumnWidth: '300px',
  maxColumnWidth: '327px',
  /* Container Info (as a string, likely with "px") */
  containerComputedStyle: null,
  containerWidth: null,
  containerColumnGap: null,
  containerRowGap: null,
  /*  Columns Info (calculated) */
  numColumns: null,
  columnWidth: null,
  /*  Container Info (calculated) */
  containerHeight: null,
};

let _resizeId = null;
let _options = {};
let _target;
let _items = [];
let _debug = false;

/* Options */
const minColumnWidth = '300px';
const maxColumnWidth = '327px';

/* Container Info (as a string, likely with "px") */
let containerComputedStyle;
let containerWidth;
let containerColumnGap;
let containerRowGap;

/*  Columns Info (calculated) */
let numColumns;
let columnWidth;

/*  Container Info (calculated) */
let containerHeight;

const setupDebugElement = (item, index) => {
  const debugElement = document.createElement('span');
  debugElement.classList.add('debug');
  debugElement.style.position = 'absolute';
  debugElement.style.top = '.5rem';
  debugElement.style.left = '.5rem';
  debugElement.style.color = '#ffffff';
  debugElement.style.padding = '.5rem';
  debugElement.style.backgroundColor = 'hsl(0 0 0 / .5)';
  item.appendChild(debugElement);
};

const updateDebugElement = (item, index) => {
  const comp = window.getComputedStyle(item);
  const order = comp.getPropertyValue('order');
  /* const height = comp.getPropertyValue("height"); */

  const debugElement = item.querySelector('.debug');
  debugElement.innerHTML = `${order} - order`;
  debugElement.innerHTML += `<br>`;
  debugElement.innerHTML += `${index} - index`;
};

const calcNumColumns = (containerWidth, minColumnWidth, columnGap) => {
  let numColumns = 0;
  let widthNeeded = 0;
  do {
    numColumns++;
    widthNeeded =
      parseFloat(minColumnWidth) * numColumns +
      parseFloat(columnGap) * (numColumns - 1);
    /* console.log(
      `Num columns = ${numColumns} => Width needed = ${widthNeeded}px`
    ); */
  } while (widthNeeded < parseFloat(containerWidth));

  return numColumns - 1;
};

const calcColumnWidth = (
  containerWidth,
  numColumns,
  columnGap,
  maxColumnWidth
) => {
  const maxWidth = parseFloat(maxColumnWidth);
  const idealWidth =
    (parseFloat(containerWidth) - parseFloat(columnGap) * (numColumns - 1)) /
    numColumns;
  return idealWidth > maxWidth ? maxWidth : idealWidth;
};

const init = (target, options = {}) => {
  console.log('running init');
  setUp(target);
  addEventListeners();
  return this;
};

const setUp = (container) => {
  if (_debug) {
    Array.from(container.children).forEach((item, index) => {
      setupDebugElement(item, index);
      updateDebugElement(item, index);
    });
  }
};

const setItemWidths = (items, width) => {
  items.forEach((item) => {
    item.style.width = width + 'px';
  });
};

const udpateContainerInfo = (container) => {
  containerComputedStyle = window.getComputedStyle(container);
  containerWidth = containerComputedStyle.getPropertyValue('width');
  containerColumnGap = containerComputedStyle.getPropertyValue('column-gap');
  containerRowGap = containerComputedStyle.getPropertyValue('row-gap');
};

const updateColumnsInfo = () => {
  numColumns = calcNumColumns(
    containerWidth,
    minColumnWidth,
    containerColumnGap
  );
  columnWidth = calcColumnWidth(
    containerWidth,
    numColumns,
    containerColumnGap,
    maxColumnWidth
  );
};

const getFirstIndexOfMinValue = (array) =>
  array.reduce((r, v, i, a) => (v >= a[r] ? r : i), -1);

const updateHeightAndOrder = () => {
  // if only 1 column, then no need for fancy calculations
  if (numColumns < 2) {
    _target.style.removeProperty('height');
    _items.forEach(function (item) {
      item.style.removeProperty('order');
    });
    return;
  }

  // if > 1 column, then position the items in the columns and add up the heights
  let columnHeights = new Array(numColumns).fill(0);

  _items.forEach(function (item) {
    const comp = window.getComputedStyle(item);
    const itemHeight = comp.getPropertyValue('height');

    // Choose which column to add the item to based on whichever has the minimum total height so far
    const indexOfMinColumn = getFirstIndexOfMinValue(columnHeights);

    // Update the "order" property on that item
    item.style.order = indexOfMinColumn + 1;

    // Update the height on that column

    // Add a row-gap value to the column height if not the first element added
    if (columnHeights[indexOfMinColumn] > 0) {
      columnHeights[indexOfMinColumn] += parseFloat(containerRowGap);
    }

    // Add to the column the height of the item itself
    columnHeights[indexOfMinColumn] += Math.ceil(parseFloat(itemHeight));

    /* const order = comp.getPropertyValue("order");
    if (!heights[order - 1]) {
      heights[order - 1] = 0;
    }
    heights[order - 1] += Math.ceil(parseFloat(height)); */
  });

  containerHeight = Math.max(...columnHeights);
  console.log(columnHeights);
  console.log(containerHeight);
  _target.style.height = containerHeight + 'px';

  // Remove existing spacers
  _target.querySelectorAll('.spacer').forEach((spacer) => {
    spacer.remove();
  });

  // Add spacers
  columnHeights.forEach((height, index) => {
    const spacerHeight = containerHeight - parseFloat(containerRowGap) - height;
    console.log(`Spacer height needed: [${index}] = ${spacerHeight}`);
    if (spacerHeight <= 0) return;
    const spacerElement = document.createElement('span');
    spacerElement.classList.add('spacer');
    spacerElement.style.content = '';
    spacerElement.style.height = spacerHeight + 'px';
    spacerElement.style.order = index + 1;
    _target.appendChild(spacerElement);
  });
};

const refresh = () => {
  console.log('calling refresh');
  udpateContainerInfo(_target);
  updateColumnsInfo();
  setItemWidths(_items, columnWidth);
  updateHeightAndOrder();

  if (_debug) {
    _items.forEach((item, index) => {
      updateDebugElement(item, index);
    });
  }
};

const onLoad = () => {
  refresh();
};

const onResize = () => {
  refresh();
};

const addEventListeners = () => {
  window.addEventListener('load', onLoad);
  window.addEventListener('resize', onResize);
};

const removeEventListeners = () => {
  window.removeEventListener('load', onLoad);
  window.removeEventListener('resize', onResize);
};

const destroyAll = () => {
  removeEventListeners();
};

// ----------------------------------------
// Main program
// ----------------------------------------

// order of operations
// - load the data
// - add the items to the DOM
// - add the card click handler to each item
// - lay out the items in the columns

loader.classList.remove('hidden');

// Read the Data
allGalleryData = await getData('data.json');

/* window.addEventListener("load", function () {
  alert("It's loaded!");
}); */

function waitForElements(selector) {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        observer.disconnect();
        resolve(elements);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

/* Document Elements */
const main = document.querySelector('main');

/* Document Elements */
gallery = renderGallery(allGalleryData, main);

_target = gallery;
_items = Array.from(_target.children);
/* console.log(_items); */

init(_target);

Array.prototype.forEach.call(_items, handleCardClick);

const galleryLinks = document.querySelectorAll('.card__link');
galleryLinks.forEach((link) => {
  link.addEventListener('click', handleGalleryCardLinkClicked);
});

setTimeout(function () {
  console.log('Running');

  loader.classList.add('hidden');
  refresh();
  gallery.classList.remove('hidden');

  details = renderDetails(allGalleryData, main);
  detailsItems = details.children;

  slideshowButton.addEventListener('click', handleSlideshowButtonClicked);
}, 2000);

waitForElements('.item').then((elements) => {
  // All elements with class 'my-element' are now in the DOM
  console.log('Elements found:', elements);
});
