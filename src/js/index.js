import ImagesApiService from './fetch';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

refs.form.addEventListener('submit', onFormSubmit);

refs.loadMoreBtn.addEventListener('click', fetchMoreImg);
refs.loadMoreBtn.disabled = true;

function onFormSubmit(event) {
  event.preventDefault();
  if (imageApiService.query === ' ') {
    return Notiflix.Notify.warning("Search query shouldn't be empty!");
  }
  refs.loadMoreBtn.classList.add('loading');
  clearImageGallery();
  const formElems = event.currentTarget;
  imageApiService.query = formElems.searchQuery.value;
  imageApiService.resetPage();
  imageApiService.fetchImg().then(images => {
    makeImagesMarkup(images);
    if (images) {
      refs.loadMoreBtn.disabled = false;
    }
  });
  refs.loadMoreBtn.classList.remove('loading');
}

const imageApiService = new ImagesApiService();

function fetchMoreImg() {
  refs.loadMoreBtn.classList.add('loading');
  imageApiService.fetchImg().then(makeImagesMarkup);
  refs.loadMoreBtn.classList.remove('loading');
}

function makeImagesMarkup(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
    <a class="gallery__link" href="${largeImageURL}">
    <img class ="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  var lightbox = new SimpleLightbox('.gallery .gallery__link', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}

function clearImageGallery() {
  refs.gallery.innerHTML = '';
}
