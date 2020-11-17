// TODO: load the dataset 
var attractions;
let movies;
const defaultval = 'all';
fetch('attractions.json')
  .then(response => response.json())
  .then(data => {
		attractions = data;
        console.log('attractions',attractions);
        filterData(defaultval);
    });

    

function filterData(category) {
    var filters
    if (category=="all"){
        filters =attractions.slice(0,5);
        console.log('ranksall',filters);
    }
    else{
        filters = attractions.filter(attraction => attraction.Category == category).slice(0,5);
        console.log('ranks',filters);
    }
    renderBarChart(filters);
	/* **************************************************
	 *
	 * TODO: filter attractions by the selected category
	 * TODO: filter top 5 attractions
	 *
	 * CALL THE FOLLOWING FUNCTION TO RENDER THE BAR-CHART:
	 *
	 * renderBarChart(data)
	 *
	 * - 'data' must be an array of JSON objects
	 * - the max. length of 'data' is 5
	 *
	 * **************************************************/
    
}

// TODO: Define an event listener for the dropdown menu
//       Call filterData with the selected category
let menu = document.getElementById('attraction-category');
menu.addEventListener("change",(event)=>{
    filterData(event.target.value);
    console.log(event.target.value);
})
console.log('menu',menu);
