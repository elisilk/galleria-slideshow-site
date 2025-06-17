function Slider(slider, startSlideId) {
  // console.log(slider);
  if (!(slider instanceof Element)) throw new Error('No slider passed in');

  this.slider = slider;

  // HTML elements

  // the slides
  this.slides = slider.querySelector('.slider__slides');

  // the controller elements
  this.controllerProgress = slider.querySelector('progress[value]');
  this.controllerProgress.max = this.slides.children.length;

  this.controllerTitle = slider.querySelector('.slider__item-title');
  this.controllerArtist = slider.querySelector('.slider__item-artist');

  this.prevButton = slider.querySelector('.goToPrev');
  this.nextButton = slider.querySelector('.goToNext');

  // Event Listeners

  this.prevButton.addEventListener('click', () => this.move('back'));
  // nextButton.addEventListener('click', this.move);
  // nextButton.addEventListener('click', this.move.bind(this));
  this.nextButton.addEventListener('click', () => this.move());

  // when this slider is created, run the start slider function
  this.startSlider(startSlideId);
  this.applyClasses();
  this.updateController();

  // add an observer to handle scrolling within the slider
  this.observer = new IntersectionObserver(
    this.handleSlideScrolledToView.bind(this),
    {
      root: this.slides,
      threshold: 0.6,
    }
  );
  Array.from(this.slides.children).forEach((item) =>
    this.observer.observe(item)
  );
}

Slider.prototype.startSlider = function (startSlideIndex) {
  // Set the CURRENT slide

  if (
    Number.isInteger(startSlideIndex) &&
    startSlideIndex >= 0 &&
    startSlideIndex < this.slides.children.length
  ) {
    // console.log('override HTML with URL param:', start);
    const currentSlide = this.slider.querySelector('.current');
    // if a slide has been specified as the current one
    // then remove the "current" designation from that slide
    if (currentSlide) currentSlide.classList.remove('current');
    // and instead add it to the slide specified in the params
    this.slides.children[startSlideIndex].classList.add('current');
  }

  this.current =
    this.slider.querySelector('.current') || this.slides.firstElementChild;

  this.scrollToCurrentSlide('instant');

  // Set the PREV and NEXT slides

  // to do the wrap around
  // this.prev =
  //   this.current.previousElementSibling || this.slides.lastElementChild;
  // this.next = this.current.nextElementSibling || this.slides.firstElementChild;
  // to take away the wraparound
  this.prev = this.current.previousElementSibling;
  this.next = this.current.nextElementSibling;
  // console.log({ current, prev, next });
};

Slider.prototype.applyClasses = function () {
  this.current.classList.add('current');
  if (this.prev) this.prev.classList.add('prev');
  if (this.next) this.next.classList.add('next');
};

Slider.prototype.getIndexOfCurrentSlide = function () {
  return Array.from(this.slides.children).findIndex(
    (item) => item === this.current
  );
};

Slider.prototype.setCurrentSlide = function (slide) {
  if (!(slide instanceof Element)) throw new Error('No slide passed in');

  // console.log(slide.dataset.title);
  this.current = slide;
  this.prev = this.current.previousElementSibling;
  this.next = this.current.nextElementSibling;

  this.applyClasses();
  this.updateController();
};

Slider.prototype.scrollToCurrentSlide = function (behavior = 'smooth') {
  this.slides.scrollTo({
    left: this.current.offsetLeft,
    behavior,
  });
};

Slider.prototype.updateController = function () {
  // Update progress bar
  const indexOfCurrentSlide = this.getIndexOfCurrentSlide();
  if (indexOfCurrentSlide >= 0)
    this.controllerProgress.value = indexOfCurrentSlide + 1;

  // Update title and artist
  this.controllerTitle.textContent = this.current.dataset.title;
  this.controllerArtist.textContent = this.current.dataset.artist;

  // Update the controller buttons
  this.nextButton.disabled = !this.next;
  this.prevButton.disabled = !this.prev;
};

Slider.prototype.move = function (direction) {
  // if direction is forward and no next slide, then do nothing
  if (!direction && !this.next) return;
  // if direction is back and no prev slide, then do nothing
  if (direction === 'back' && !this.prev) return;

  // first strip all classes off the current slides
  const classesToRemove = ['prev', 'current', 'next'];
  if (this.prev) this.prev.classList.remove(...classesToRemove);
  this.current.classList.remove(...classesToRemove);
  if (this.next) this.next.classList.remove(...classesToRemove);
  // An alternative 1-line option
  // [prev, current, next].forEach((el) =>
  //   el.classList.remove(...classesToRemove),
  // );

  if (direction === 'back') {
    [this.prev, this.current, this.next] = [
      // this.prev.previousElementSibling || this.slides.lastElementChild, // get the prev slide, if there is none, get the last slide from the entire slider for wrapping
      this.prev.previousElementSibling, // get the prev slide, or null if there is no previous slide
      this.prev,
      this.current,
    ];
  } else {
    [this.prev, this.current, this.next] = [
      this.current,
      this.next,
      this.next.nextElementSibling, // get the next slide or null if there is no next slide
      // this.next.nextElementSibling || this.slides.firstElementChild, // get the next slide or if its at the end, loop around and grab the first
    ];
  }

  this.scrollToCurrentSlide();
  this.applyClasses();
  this.updateController();
};

Slider.prototype.handleSlideScrolledToView = function (entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // console.log(entry);
      // console.log(entry.target);
      // console.log(observer);
      // console.log(this);
      this.setCurrentSlide(entry.target);
    }
  });
};

// Read in the URL parameter to set the current slide
let params = new URLSearchParams(document.location.search);
let id = params.get('id');
if (id) id = parseInt(id - 1);

// Instantiate the Slider
const mySlider = new Slider(document.querySelector('.slider'), id);
// console.log(mySlider);

// Add key event listeners for the slider
window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight') mySlider.move();
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft') mySlider.move('back');
});

// Lightbox image viewer

const viewImageButtons = document.querySelectorAll('.view-image-btn');

const viewImageDialog = document.querySelector('.view-image-dialog');
const viewImageDialogCloseButton = viewImageDialog.querySelector('button');
const viewImageDialogImage = viewImageDialog.querySelector('img');

function handleViewImageButtonClick(event) {
  const detailParent = this.closest('.detail');
  viewImageDialogImage.src = `./assets/${detailParent.dataset.slug}/gallery.jpg`;
  viewImageDialogImage.alt = detailParent.dataset.title;
  viewImageDialog.showModal();
}

viewImageButtons.forEach((item) =>
  item.addEventListener('click', handleViewImageButtonClick)
);
