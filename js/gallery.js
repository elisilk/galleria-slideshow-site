function Gallery(gallery, data) {
  if (!gallery) throw new Error('No gallery Found!');

  // ----------------------------------------
  // Rendering
  // ----------------------------------------

  function renderGalleryItem(itemData, parent) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('card', 'item');
    parent.appendChild(itemElement);

    const cardImgElement = document.createElement('div');
    cardImgElement.classList.add('card__img');
    itemElement.appendChild(cardImgElement);

    const itemThumbnail = new Image();
    itemThumbnail.src = itemData.images.thumbnail;
    itemThumbnail.alt = itemData.name + ' thumbnail';
    itemThumbnail.onload = function () {
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
  }

  function renderGallery(data, parent) {
    data.forEach((item) => {
      renderGalleryItem(item, parent);
    });
  }

  renderGallery(data, gallery);
}

export default Gallery;
