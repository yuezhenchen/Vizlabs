var csvdata;
var colorScale;

d3.csv('wealth-health-2014.csv', d3.autoType)
        .then(data=>{
            console.log(data);
            csvdata = data;
            csvdata.sort((a,b)=>b.Population - a.Population);

            const margin = ({top: 20, right: 20, bottom: 20, left: 30})
            const width = 650 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;
            const max_radius = width / csvdata.length

            console.log(csvdata[0])

            const xScale = d3.scaleSqrt()
                .domain([d3.min(data, d=>d.Income),d3.max(data, d=>d.Income)])
                .range([0, width]) ;
            const yScale = d3.scaleSqrt()
                .domain([d3.min(data, d=>d.LifeExpectancy), d3.max(data,d=>d.LifeExpectancy)])
                .range([height,0]);
            
            colorScale = d3.scaleOrdinal(d3.schemeTableau10)
            const areaScale = d3.scalePow().exponent(0.5)
                .domain([0, d3.max(csvdata, d=>d.Population)])
                .range([1, max_radius * 10]);

            const xAxis = d3.axisBottom()
                .scale(xScale)
                // .style("fill","none")
                .ticks(5, "s");
            
            const yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5, "s");

            var svg = d3.select('.chart')
                .append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                

            const incomeMax = 133563;
            console.log(xScale(incomeMax));

            var circles = svg.selectAll("circle")
            .data(csvdata)
            .enter()
            .append("circle")
            .attr('cx', d=>xScale(d.Income))
            .attr('cy', d=>yScale(d.LifeExpectancy))
            .attr("fill", d=>colorScale(d.Region))
            .attr("fill-opacity", .9)
            .attr("r", d=>areaScale(d.Population))
            .on("mouseenter", (event, d) => {
                
                const pos = d3.pointer(event, window);
                console.log(d);
                console.log(pos);
                console.log(pos[0] + "px");
                
                var tooltip = d3.select('.tooltip')
                    .style('display', 'block')
                    .style('position', 'fixed')
                    .style("background-color", "black")
                    .style("color","white")
                    .style("border", "solid")
                    .style("border-width", "1px")
                    .style("border-radius", "5px")
                    .style("padding", "10px")
                    .style('top', pos[1] + "px")
                    .style('left', pos[0] + "px")
                    // .style('fill',black)
                    .html(
                        "<p id='tooltip'>Country: " +d.Country + "<br> Region: " + d.Region + "<br> Population: " + d3.format(",.2r")(d.Population) + "<br> Income: " + d3.format(",.2r")(d.Income) + "<br> Life Expectancy: " + d.LifeExpectancy + "</p>"
                    );
                
                // show the tooltip
            })
            .on("mouseleave", (event, d) => {
                // hide the tooltip
                d3.select('.tooltip').style('display', 'none');
            }); 


            var xAxisDisplay = svg.append("g")
                .attr("class", "axis x-axis")
                .call(xAxis)
                .attr("transform", `translate(0, ${height})`);
            
            var yAxisDisplay = svg.append("g")
                .attr("Class", "axis y-axis")
                .call(yAxis);
            
            var xLabel = svg.append("text")
                .attr('x', width)
                .attr('y', height - margin.bottom/2) 
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .attr('font-size',12)
                // add attrs such as alignment-baseline and text-anchor as necessary
                .text("Income");
            
            var yLabel = svg.append("text")
                .attr('x', 0 + width/50)
                .attr('y', 0 + height/8)
                .attr('writing-mode', 'vertical-lr')
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .attr('font-size', 12)
                .text("Life Expectancy");
            
            var fontSize = 10;

            var legend = svg.append("g")
                .attr("transform", "translate(" + width * 4/5  + "," +  (margin.top + height - 1.5*fontSize*(colorScale.domain().length) - margin.bottom*2) + ")");
                // .attr("transform", `translate(0, ${height})`)
            var boxes = legend.selectAll("rect")
                .data(colorScale.domain())
                .enter()
                .append("rect")
                .attr("class", "box")
                .attr("height", fontSize) 
                .attr("width", fontSize) 
                .attr('x', 5)
                .attr('y', (d,i) => 1.5*fontSize * i)
                .attr('fill', d=>colorScale(d));
            
            var labels = legend.selectAll("text")
                .data(colorScale.domain())
                .enter()
                .append("text")
                .text(d=>d)
                .attr('x', fontSize + 10)
                .attr('y', (d,i) => 1 + 1.5* fontSize * i)
                .attr('font-size', fontSize)
                .attr('text-anchor', 'beginning')
                .attr('alignment-baseline', 'hanging');
        })
