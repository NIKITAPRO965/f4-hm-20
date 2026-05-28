const API_KEY = '55396799-af467bce3dc1f029cc7ffe916';
const BASE_URL = 'https://pixabay.com/api/';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let currentQuery = '';

loadMoreBtn.style.display = 'none';

form.addEventListener('submit', async event => {
  event.preventDefault();

  currentQuery = event.currentTarget.elements.query.value.trim();

  if (!currentQuery) return;

  page = 1;
  gallery.innerHTML = '';

  await fetchImages();
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;

  const previousHeight = gallery.scrollHeight;

  await fetchImages();

  gallery.lastElementChild?.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });

  if (gallery.scrollHeight === previousHeight) {
    loadMoreBtn.style.display = 'none';
  }
});

async function fetchImages() {
  try {
    const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(
      currentQuery
    )}&image_type=photo&orientation=horizontal&page=${page}&per_page=12`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();

    if (data.hits.length === 0 && page === 1) {
      gallery.innerHTML = `<p class="message">Nothing found 😢</p>`;
      loadMoreBtn.style.display = 'none';
      return;
    }

    renderImages(data.hits);

    if (data.totalHits > page * 12) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.log(error);
  }
}

function renderImages(images) {
  const markup = images.map(img => {
    return `
      <li class="photo-card">
        <img src="${img.webformatURL}" alt="${img.tags}" />

        <div class="stats">
          <p class="stats-item">
            <i class="material-icons">thumb_up</i>
            ${img.likes}
          </p>

          <p class="stats-item">
            <i class="material-icons">visibility</i>
            ${img.views}
          </p>

          <p class="stats-item">
            <i class="material-icons">comment</i>
            ${img.comments}
          </p>

          <p class="stats-item">
            <i class="material-icons">cloud_download</i>
            ${img.downloads}
          </p>
        </div>
      </li>
    `;
  }).join('');

  gallery.innerHTML += markup;
}