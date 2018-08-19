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

// Must get the Latitude and Longtitude and provide it to Zomato API
function getGoogleLatLong(data) {
  const latitude = data.results[0].geometry.location.lat;
  const longitude = data.results[0].geometry.location.lng;
  getDataFromApi(latitude, longitude, displayZomatoData);
}

function displayTopBar(){
  const top_bar = `
    <div class="col-12">
    <form action="#" class="js-top-bar" name="search-newplace">
          <button type="submit" class="btn-newplace">I Don't Like It...Pick a New Place for Me</button>
        </form>
        <form action="#" name="search-startover">
          <button type="button" value="Refresh Page" onClick="window.location.reload()" class="btn-newcity">Start Over</button>
        </form>
      </div>`;
   $('.top-bar').html(top_bar);
 
}

//Give the user a new restaurant when the user clicks on the appropriate button
function pickNewRestaurant (data){
$('.js-top-bar').submit(event => {
    event.preventDefault();
    renderResult(data);
  });
}


function displayZomatoData(data) {
	const results = data.restaurants;
	renderResult(data);
	pickNewRestaurant(data);
}

function renderResult(result) {
	const outputElem = $('.js-search-results');
	const rand = Math.floor(Math.random() * 19);
	const rest = result.restaurants[rand];
	function priceRange () {
	if (rest.restaurant.price_range == 1){

		const price_1 = `<p>Price: <i class="fas fa-money-bill-alt"></i></p>`;
		return price_1;

	}
	else if (rest.restaurant.price_range == 2){
		const price_2 = `<p>Price: <i class="fas fa-money-bill-alt"></i> <i class="fas fa-money-bill-alt"></i></p>`;
		return price_2;
	}
	else if (rest.restaurant.price_range == 3){
		const price_3 = `<p>Price: <i class="fas fa-money-bill-alt"></i> <i class="fas fa-money-bill-alt"></i> <i class="fas fa-money-bill-alt"></i></p>`;
		return price_3;
	}
	else {
		return  `Price: <i class="fas fa-money-bill-alt"></i> <i class="fas fa-money-bill-alt"></i> <i class="fas fa-money-bill-alt"></i> <i class="fas fa-money-bill-alt"></i></i>`;
	}

}
	const text = `
	<div class="row top-results">
	<div class="col-2">
	<img src="${rest.restaurant.thumb}" class="thumb-img" alt="${rest.restaurant.name}">
	</div>
	<div class="col-6">
	<h2 class="restaurant-name">${rest.restaurant.name}</h2><br>
	<h3 class="city-name">${rest.restaurant.location.city}</h3>
	</div>
	<div class="col-3">
	<h3 class="user-rating">User Rating: <br>${rest.restaurant.user_rating.rating_text}</h3>
	</div>
	</div>
	<div class="row">
	<div class="col-6">
	<p>Address: ${rest.restaurant.location.address}</p>
	<p class="price-range">${priceRange()}</p>
	<p>Average Cost for Two: $${rest.restaurant.average_cost_for_two}</p>
	<p>Cuisine: ${rest.restaurant.cuisines}</p>
	</div>
	<div class="col-6">
	<form action="http://www.google.com/maps/place/${rest.restaurant.location.latitude},${rest.restaurant.location.longitude}" target="_blank">
	<button type="submit" class="result-btn">Directions <i class="fas fa-map-marked-alt"></i> </button><br>
	</form>
	<form action="${rest.restaurant.menu_url}" target="_blank" >
	<button type="submit" class="result-btn">Menu <i class="fas fa-utensils"></i></button>
	</form>
	</div>
	</div>`;

	const text_noimage = `
	<div class="row">
	<div class="col-2">
	<img src="https://cdn.pixabay.com/photo/2014/09/17/20/26/restaurant-449952_1280.jpg" class="thumb-img">
	</div>
	<div class="col-6">
	<h2 class="restaurant-name">${rest.restaurant.name}</h2><br>
	<h3 class="city-name">${rest.restaurant.location.city}</h3>
	</div>
	<div class="col-3">
	<h3 class="user-rating">User Rating: <br>${rest.restaurant.user_rating.rating_text}</h3>
	</div>
	</div>
	<div class="row">
	<div class="col-6">
	<p>Address: ${rest.restaurant.location.address}</p>
	<p style="price-range">${priceRange()}</p>
	<p>Average Cost for Two: $${rest.restaurant.average_cost_for_two}</p>
	<p>Cuisine: ${rest.restaurant.cuisines}</p>
	</div>
	<div class="col-6">
	<form action="http://www.google.com/maps/place/${rest.restaurant.location.latitude},${rest.restaurant.location.longitude}" target="_blank">
	<button type="submit" class="result-btn">Directions <i class="fas fa-map-marked-alt"></i> </button><br>
	</form>
	<form action="${rest.restaurant.menu_url}" target="_blank" >
	<button type="submit" class="result-btn">Menu <i class="fas fa-utensils"></i></button>
	</form>
	</div>
	</div>
	`;

	if (rest.restaurant.thumb == ""){
		$('.js-search-results').html(text_noimage);
	}
	else {
		$('.js-search-results').html(text);
	}
	console.log(`${priceRange()}`);
	$('.js-search-results').removeClass('hidden');
	$('.search-box').addClass('hidden');
	$('.box').addClass('hidden');
	$('.top-bar').removeClass('hidden');
}

//When the user click submit, feed the result to the Google API
function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('#js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    getAddress(query, getGoogleLatLong);
    displayTopBar();
  });
}

$(watchSubmit);

