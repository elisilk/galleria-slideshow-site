import galleryData from '../data/galleryData.js';
import Gallery from './gallery.js';
import Masonry from './masonry.js';

// ----------------------------------------
// HTML elements to save
// ----------------------------------------

// const loader = document.querySelector('.loader');
// const main = document.querySelector('main');

// ----------------------------------------
// Cards
// ----------------------------------------

// Inclusive Copmponents - Cards
// https://inclusive-components.design/cards/

const cards = document.querySelectorAll('.card');
Array.prototype.forEach.call(cards, (card) => {
  let down,
    up,
    link = card.querySelector('h2 a');
  card.onmousedown = () => (down = +new Date());
  card.onmouseup = () => {
    up = +new Date();
    if (up - down < 200) {
      link.click();
    }
  };
  card.style.cursor = 'pointer';
});

// ----------------------------------------
// Main program
// ----------------------------------------

// order of operations
// - load the data
// - add the items to the DOM
// - add the card click handler to each item
// - lay out the items in the columns

// Read the Data
// allGalleryData = await getData('data.json');

// gallery = renderGallery(allGalleryData, main);
// loader.classList.add('hidden');

// console.log(allGalleryData);

// const gallery = new Gallery(container, galleryData);
// console.log(gallery);
// globalThis.gallery = gallery;
// Wait for the gallery to fully load (how?)

// const container = document.querySelector('.masonry');
// const masonry = new Masonry(container);

// console.log(masonry);

// Make module variables accessible in the global scope
// globalThis.container = container;
// globalThis.masonry = masonry;

// Run a refresh on the masonry object
// masonry.refresh();

// Export to CSV file

function galleryDataToArray(data) {
  return data.map((item) => [item.name, item.year, item.artist.name]);
}

function galleryImageDataToArray(images) {
  return Array.from(images).map((image) => [
    image.alt,
    image.naturalWidth,
    image.naturalHeight,
  ]);
}

function exportArrayToCsv(array, filename = 'data.csv', colNames) {
  let itemsToCsv = array.map((item) => item.join(',')).join('\n');
  if (colNames) {
    itemsToCsv = colNames.join(',') + '\n' + itemsToCsv;
  }
  let csvContent = 'data:text/csv;charset=utf-8,' + itemsToCsv;
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link); // Required for FF
  link.click(); // This will download the data file
  // console.log('downloading data to:', filename);
}

globalThis.galleryDataToArray = galleryDataToArray;
globalThis.exportArrayToCsv = exportArrayToCsv;

const galleryDataAsArray = galleryDataToArray(galleryData);
// console.log(galleryDataAsArray);
// exportArrayToCsv(galleryDataAsArray, 'data2.csv', [
//   'Name',
//   'Year',
//   'Artist Name',
// ]);

// const images = container.querySelectorAll('.card__img img');
// const imageArray = galleryImageDataToArray(images);
// console.log(images);
// console.log(imageArray);
// exportArrayToCsv(imageArray, 'dataImages.csv', [
//   'Gallery Image Name',
//   'Gallery Image Natural Width',
//   'Gallery Image Natural Height',
// ]);

// const itemsToCsv = Array.from(items)
//   .map((item) => {
//     console.log(item);
//     return '';
//   })
//   .join('');

// console.log(itemsToCsv);
