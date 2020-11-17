
d3.csv('assets/cities.csv', d3.autoType).then(data=>{
	console.log('cities', data);
	var eucities = data.filter(d => d.eu == true);
	d3.select('.city-count').text(eucities.length + ' European Cities');
	const width = 700;
	const height = 550;
	const svg = d3.select('.population-plot')
		.append('svg')
    	.attr('width', width)
		.attr('height', height)
	
		svg.selectAll('circle')
		.data(eucities)
		.enter()
		.append('circle')
		.attr("fill", "slateblue")
		.attr('cx', (d,i) => d.x)
        .attr('cy', (d,i) => d.y)
		.attr('r', d => d.population < 1000000? 4 : 8)
	
	
		svg.selectAll("text")
		.data(eucities)
		.enter()
		.append("text")
        .attr('x', (d, i) => d.x)
        .attr('y', (d, i) => d.y)
		.filter((d,i) => d.population >= 1000000)
		.text(d=>d.country)
		.attr("font-size", "12px")
		.attr("text-anchor", "middle")
		.attr("fill", "black")
		.attr('dx', +10)
        .attr('dy', -10);
})

d3.csv('assets/buildings.csv', d3.autoType).then(data=>{
	console.log('buildings', data);
	var sortdata = data.sort((a,b) => b.height_ft - a.height_ft);
	const width = 500;
	const height = 500;
	const svg = d3.select('.bar-buildings')
	.append('svg')
	.attr('width', width)
	.attr('height', height);

	svg.selectAll('rect')
		.data(sortdata)
		.enter()
		.append('rect')
		.attr('x', 50)
		.attr('y', 50)
		.attr('width',  20)
		.attr('height', 100)
		.attr('x', (d,i) => 175)
		.attr('y', (d,i) => (i * width/sortdata.length) + 20)
		.attr('width', (d,i) => d.height_px)
		.attr('height', 20)
		.attr("fill", "orange")
		.attr('class', 'bar-details')
		.on("click", (d, i) => {
			d3.select('.image').attr('src', "assets/img/" + i.image)
			d3.select('.building-name').text(i.building)
			d3.select('.height').text(i.height_ft)
			d3.select('.city').text(i.city)
			d3.select('.country').text(i.country)

			svg.selectAll('table.height')
				.data(sortdata)
				.enter()
				.append('text')
			d3.select("td#height").append('span').text(i.height_ft)
			d3.select("td#city").text((i) => i.city)
			d3.select("td#country").text((i) => i.country)
		  });
						
	svg.selectAll("text.labels")
		.data(sortdata)
		.enter()
		.append("text")
		.attr('dx', 0)
		.attr('dy', (d,i) => (i * width/sortdata.length) + 32 )
		.text(d=>d.building)	
		.attr("font-size", "12px")
		.attr("text-anchor", "front")
		.attr("fill", "black")

	svg.selectAll("text.values")
		.data(sortdata)
		.enter()
		.append("text")
		.attr('dx', (d,i) => (d.height_px) + 170)
		.attr('dy', (d,i) => (i * width/sortdata.length) + 35 )
		.text(d=> (d.height_m + 'm'))	
		.attr("font-size", "12px")
		.attr("text-anchor", "end")
		.attr("fill", "white")
})