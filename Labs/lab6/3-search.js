const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

const API_KEY = 'API_KEY';
const BASE_URL = 'https://pixabay.com/api/';

let lightbox;

form.addEventListener('submit', async e => {
  e.preventDefault();

  const query = form.elements.query.value.trim();
  if (!query) {
    iziToast.warning({
      message: 'Please enter a search query',
      position: 'topRight',
    });
    return;
  }

  showLoader(true);
  gallery.innerHTML = '';

  try {
    const data = await fetchImages(query);

    if (data.hits.length === 0) {
      iziToast.error({
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    renderGallery(data.hits);
  } catch (err) {
    iziToast.error({
      message: 'Failed to fetch images. Try again later.',
      position: 'topRight',
    });
  } finally {
    showLoader(false);
  }
});

async function fetchImages(query) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

function renderGallery(images) {
  const markup = images
    .map(
      img => `
      <li class="gallery-item">
        <a href="${img.largeImageURL}" class="gallery-link">
          <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy"/>
        </a>
        <div class="info">
          <p><b>Likes</b> ${img.likes}</p>
          <p><b>Views</b> ${img.views}</p>
          <p><b>Comments</b> ${img.comments}</p>
          <p><b>Downloads</b> ${img.downloads}</p>
        </div>
      </li>`
    )
    .join('');

  gallery.innerHTML = markup;

  lightbox?.destroy();
  lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
}

function showLoader(isVisible) {
  loader.hidden = !isVisible;
}
