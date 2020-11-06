var width = 600
var height = 400 

var svg = d3.selectAll(".container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0,0,width,height]) 

var size = d3.scaleLinear().range([0,10])
var colors = d3.scaleOrdinal(d3.schemeCategory10)
var dataset;
var visType = "Force";
var drag = force =>{
  
    function dragstart(event) {
      if (!event.active) force.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
    function drag(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    
    function dragend(event) {
      if (!event.active) force.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
    
    return d3.drag()
        .filter(event => visType === "Force")
        .on("start", dragstart)
        .on("drag", drag)
        .on("end", dragend);
}

Promise.all([d3.json('airports.json'),d3.json('world-110m.json')])
    .then(data=>{
        let dataset = data[0];
        let worldmap = data[1]; 
        
        var worldmapgeojson = topojson.feature(worldmap, worldmap.objects.countries);
        var projection = d3.geoNaturalEarth1().fitExtent([[0,0], [width,height]], worldmapgeojson);
        var path = d3.geoPath()
             .projection(projection);
        
        var map = svg.append("path")
            .datum(worldmapgeojson)
            .attr("d", path)
            .style("opacity", 0);

        var mapOutline = svg.append("path")
            .datum(topojson.mesh(worldmap,worldmap.objects.countries))
            .attr("d", path)
            .attr('fill', 'none')
              .attr('stroke', 'white')
            .attr("class", "subunit-boundary")
    
        size.domain([0,d3.max(dataset.nodes, d=>(d.passengers))])
        const force = d3.forceSimulation(dataset.nodes)
            .force("charge", d3.forceManyBody().strength(-5))
            .force("link", d3.forceLink(dataset.links).distance(40))
            .force("center", d3.forceCenter().x(width/2).y(height/2).strength(1.5));
   
        var edges = svg.selectAll("line")
            .data(dataset.links)
            .enter()
            .append("line")
            .style("stroke", "#ccc")
            .style("stroke-width", 1);
        
        var nodes = svg.selectAll("circle")
            .data(dataset.nodes)
            .enter()
            .append("circle")
            .attr("r", d=>size(d.passengers))
            .style("fill", 'orange')
            .call(drag(force));

        nodes.append("title")
            .text(function(d) {
                return d.name;
            });
        
        force.on("tick", function() {
            nodes.attr("cx", function(d){d.x = Math.max(10, Math.min(width - 10, d.x)); return d.x;})
                .attr("cy", function(d) {d.y = Math.max(10, Math.min(height - 10, d.y)); return d.y});
            edges.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
        });

        function switchLayout() {
            console.log(visType);
            if (visType === "Map") {
                    force.stop()
                    nodes.transition(1000).attr("cx",d=>d.x = projection([d.longitude, d.latitude])[0])
                        .attr("cy", d=>d.y = projection([d.longitude, d.latitude])[1]);
                    edges.transition(1000).attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });
                    
                    map.transition(1000).style("opacity", 1);
                    mapOutline.transition(1000).style("opacity",1);
                } else { 
                    force.alpha(1).restart()
                    map.transition(2000).style("opacity", 0)
                    mapOutline.transition(1000).style("opacity", 0)

                }
        }
            
        d3.selectAll("input[name=maptype]").on("change", event=>{
            visType = event.target.value;
            switchLayout();
        });
    })

