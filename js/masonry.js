/* Flex Masonry - based on/adapted from:
 * - Idea by Tobias Ahlin, "CSS masonry with flexbox, :nth-child(), and order" https://tobiasahlin.com/blog/masonry-with-css/
 * - JS implementation by Gilbert Pellegrom - https://github.com/gilbitron/flexmasonry / https://flexmasonry.vercel.app/
 */

function Masonry(container) {
  if (!container) throw new Error('No container Found!');

  this.container = container;
  this.items = Array.from(container.querySelectorAll('.item'));

  // Options
  this.minColumnWidth = '300px';
  this.maxColumnWidth = '327px';

  // Container Info (as a string, likely with "px")
  this.containerComputedStyle;
  this.containerWidth;
  this.columnGap;
  this.rowGap;

  // Columns Info (calculated)
  this.numColumns;
  this.columnWidth;

  // Container Info (calculated)
  this.containerHeight;

  // refresh();
  // return this;

  // Resize observer(s)
  // Set up resize observers on the items to see when their height has been set

  // set up the resize observer with the callback function
  // this.resizeObserver = new ResizeObserver(this.handleItemResize);
  // // add the observer to each of the items
  // this.items.forEach((item) => this.resizeObserver.observe(item));

  // Mutation observer
  // this.mutationObserver = new MutationObserver(this.handleContainerMutation);
  // // this.mutationObserver.observe(this.container, {
  // this.mutationObserver.observe(document.body, {
  //   attributes: true,
  //   childList: true,
  //   subtree: true,
  // });
  // console.log(this.mutationObserver);
}

Masonry.prototype.handleItemResize = function (entries, observer) {
  console.log('-- resize was observed --', entries.length);
  // console.log(this);
  // console.log(this.items);
  // const zeroHeightItems = this.items.filter(
  //   (item) => item.getComputedStyle().height === '0px'
  // );
  // console.log(zeroHeightItems);
  // console.log(entries, observer);
  // entries.forEach((entry, index) => {
  //   console.log(index, 'Element height:', entry.contentRect.height);
  // });
};

Masonry.prototype.handleContainerMutation = function (mutations) {
  console.log('-- mutation was observed --', mutations.length);
  // console.log(this);
  // console.log(mutations);
  mutations.forEach((mutation) => {
    console.log(mutation.addedNodes.length);
    if (mutation.target.classList.contains('item'))
      console.log(mutation.type, mutation.target, mutation.attributeName);
  });
};

Masonry.prototype.udpateContainerInfo = function () {
  this.containerComputedStyle = window.getComputedStyle(this.container);
  this.containerWidth = this.containerComputedStyle.getPropertyValue('width');
  this.columnGap = this.containerComputedStyle.getPropertyValue('column-gap');
  this.rowGap = this.containerComputedStyle.getPropertyValue('row-gap');
};

Masonry.prototype.calcNumColumns = function () {
  let numColumns = 0;
  let widthNeeded = 0;
  do {
    numColumns++;
    widthNeeded =
      parseFloat(this.minColumnWidth) * numColumns +
      parseFloat(this.columnGap) * (numColumns - 1);
    // console.log(
    //   `Num columns = ${numColumns} => Width needed = ${widthNeeded}px`
    // );
  } while (widthNeeded < parseFloat(this.containerWidth));
  console.log(`Num columns = ${numColumns - 1}`);

  return numColumns - 1;
};

Masonry.prototype.calcColumnWidth = function () {
  const maxWidth = parseFloat(this.maxColumnWidth);
  const idealWidth =
    (parseFloat(this.containerWidth) -
      parseFloat(this.columnGap) * (this.numColumns - 1)) /
    this.numColumns;
  return idealWidth > maxWidth ? maxWidth : idealWidth;
};

Masonry.prototype.updateColumnsInfo = function () {
  this.numColumns = this.calcNumColumns();
  this.columnWidth = this.calcColumnWidth();
};

Masonry.prototype.setItemWidths = function (width) {
  this.items.forEach((item) => {
    item.style.width = width + 'px';
  });
};

Masonry.prototype.getFirstIndexOfMinValue = (array) =>
  array.reduce((r, v, i, a) => (v >= a[r] ? r : i), -1);

Masonry.prototype.updateHeightAndOrder = function () {
  // Remove any existing spacers
  this.container
    .querySelectorAll('.spacer')
    .forEach((spacer) => spacer.remover());

  // if only 1 column, then no need for fancy calculations
  if (this.numColumns < 2) {
    this.container.style.removeProperty('height');
    this.items.forEach(function (item) {
      item.style.removeProperty('order');
    });
    return;
  }

  // if > 1 column, then position the items in the columns and add up the heights
  let columnHeights = new Array(this.numColumns).fill(0);

  this.items.forEach((item) => {
    const itemComputedStyle = window.getComputedStyle(item);
    const itemHeight = itemComputedStyle.getPropertyValue('height');

    // Choose which column to add the item to based on whichever has the minimum total height so far
    const indexOfMinColumn = this.getFirstIndexOfMinValue(columnHeights);

    // Update the "order" property on that item
    item.style.order = indexOfMinColumn + 1;

    // Update the height on that column in two steps:

    // 1. Add a row-gap value if not the first element added
    if (columnHeights[indexOfMinColumn] > 0)
      columnHeights[indexOfMinColumn] += parseFloat(this.rowGap);

    // 2. Add the height of the item itself
    columnHeights[indexOfMinColumn] += Math.ceil(parseFloat(itemHeight));
  });

  this.containerHeight = Math.max(...columnHeights);

  console.log(columnHeights);
  console.log(this.containerHeight);

  // as a safeguard backup, if the computed container height is zero (meaning the items didn't successfully load yet), then don't set the column height at all
  this.container.style.height =
    this.containerHeight > 0 ? this.containerHeight + 'px' : '';

  // SPACERS

  // Add new spacers as needed
  columnHeights.forEach((height, index) => {
    const spacerHeight =
      this.containerHeight - parseFloat(this.rowGap) - height;
    console.log(`Spacer height needed: [${index}] = ${spacerHeight}`);
    if (spacerHeight <= 0) return;
    const spacerElement = document.createElement('span');
    spacerElement.classList.add('spacer');
    spacerElement.style.content = '';
    spacerElement.style.height = spacerHeight + 'px';
    spacerElement.style.order = index + 1;
    this.container.appendChild(spacerElement);
  });
};

Masonry.prototype.refresh = function () {
  console.log('Masonry: refreshing');
  this.udpateContainerInfo();
  this.updateColumnsInfo();
  this.setItemWidths(this.columnWidth);
  this.updateHeightAndOrder();
  // console.log(containerWidth, columnGap, rowGap);
  // console.log(numColumns, columnWidth);
};

export default Masonry;
