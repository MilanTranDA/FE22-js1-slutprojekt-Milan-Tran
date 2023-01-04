// Add an event listener to the search button
const btn = document.querySelector('#button-forsearch');
btn.addEventListener('click', searchItems);


// Function to handle the search button click event
function searchItems(event) {
  event.preventDefault();
  
  const input = document.querySelector('#input-text');
  const searchTerm = input.value.trim();  // Trim any leading or trailing white space from the search term
  
  // Check if the search term is empty
  if (!searchTerm) {
    // If the search term is empty, show an error message and return from the function
    alert('Please enter a search term in order to search');
    return;
  }
  
  // Start the loading animation
  document.querySelector('#loading').style.display = 'block';
  loadingAnimation.play();
  
  input.value = '';
  
  const numInput = document.querySelector('#num-images');
  const numImages = numInput.value;
  numInput.value = '';
  
  const sizeInput = document.querySelector('#image-size');
  const size = sizeInput.value;
  
  const sortInput = document.querySelector('#sort-order');
  const sortOrder = sortInput.value;
  
  console.log(numImages, searchTerm, size, sortOrder);
  fetchSearch(searchTerm, numImages, size, sortOrder);
}



// Helper function to build the URL for the Flickr API request

function buildFlickrUrl(searchTerm, numImages, size) {
  const baseUrl = 'https://www.flickr.com/services/rest/';
  const apiKey = '11ba514af7e0cb2ac8870a45aa34ff59';
  return `${baseUrl}?method=flickr.photos.search&api_key=${apiKey}&text=${searchTerm}&per_page=${numImages}&size=${size}&format=json&nojsoncallback=1`;
}

console.log(buildFlickrUrl);
// Function to make the fetch request to the Flickr API
function fetchSearch(searchTerm, numImages, size, sortOrder) {
  const url = buildFlickrUrl(searchTerm, numImages, size);

  try {
    fetch(url)
      .then((response) => response.json())
      .then((itemdata) => displayInfo(itemdata, size, sortOrder));
  } catch (error) {
    console.error('Error:', error);
  }
}
document.querySelector('#output-container').innerHTML = '';

function displayInfo(itemdata, size, sortOrder) {
  // Define the photos array
  loadingAnimation.pause();
  let photos = itemdata.photos.photo;

  // Sort the photos array based on the selected sort order
  if (sortOrder === 'ascending') {
    photos.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOrder === 'descending') {
    photos.sort((a, b) => b.title.localeCompare(a.title));
  }
  if (itemdata.photos === undefined) {
    console.error('Error: photos object is undefined');
    return;
  }

  document.querySelector('#output-container').innerHTML = '';
  for (const photo of photos) {
    const imgUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size}.jpg`;
    const imgOfItem = document.createElement('img');

    // Append the img and div elements to the output container
    document.querySelector('#output-container').appendChild(imgOfItem);

    imgOfItem.src = imgUrl;
    // Hide the loading div
    document.querySelector('#loading').style.display = 'none';
  }
};

const loadingAnimation = anime({
  targets: '#loading',
  opacity: [{ value: 1 }, { value: 0 }],
  easing: 'linear',
  loop: true,
  duration: 1000
});
