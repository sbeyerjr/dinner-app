const ZOMATO_SEARCH_URL = 'https://developers.zomato.com/api/v2.1/search';
const GOOGLE_SEARCH_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

function getAddress(searchTerm, callback){
	 const query = {
    key: 'AIzaSyA3RAamR0JAm6pZz46jZRVdLuLLx9wQwg4',
    address: `${searchTerm}`
    
  }
  $.getJSON(GOOGLE_SEARCH_URL, query, callback);
}

function getDataFromApi(lat, lon, callback) {
  const query = {
    lat: `${lat}`,
    lon: `${lon}`,
    count: 20,
    sort: 'real-distance',
    apikey: '460286dfbdb204719a6ef49dfdc82c58'
  }
  $.getJSON(ZOMATO_SEARCH_URL, query, callback);
}



function displayGoogleLatitude(data) {
  const latitude = data.results[0].geometry.location.lat;
  const longitude = data.results[0].geometry.location.lng;
  
  // const results = data.results[0].map((item, index) => renderResult(item));
  getDataFromApi(latitude, longitude, displayZomatoData);

}

function displayZomatoData(data) {
	
	const results = data.restaurants;
	renderResult(data);
	console.log(data);
	
}


function renderResult(result) {
	const rand = Math.floor(Math.random() * 19);
	const rest = result.restaurants[rand];
	const text = `<h2>${rest.restaurant.name}</h2><br>
	<img src="${rest.restaurant.thumb}">
	<p>${rest.restaurant.location.address}</p>`;
	$('.js-search-results').html(text);
	
}


function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('#js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getAddress(query, displayGoogleLatitude);
  });
}

$(watchSubmit);
