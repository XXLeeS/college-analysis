if($('#boxplot').length){
d3.json("/ranks.json", function(data){
	var svg_padding = 20;
	var svg_width = parseInt(d3.select("#boxplot").style("width"), 10);
	var svg_height = window.innerHeight - $('#navbar').height();

	var svg = d3.select("#boxplot")
		.append("svg")
	    .attr("height", svg_height)
	    .attr("width", svg_width);

	var stats = data.statistics;

	var colorScale = d3.scale.linear()
        .domain([
	      Number(d3.max(stats, function(d){ return d.field })) + 1,
	      Number(d3.min(stats, function(d){ return d.field })) - 1
	    ])
        .range([d3.rgb("#16A085").darker(), d3.rgb("#16A085").brighter()]);

	var min = d3.min(stats, function(d){ return d.min });
	var max = d3.max(stats, function(d){ return d.max });

	var xScale = d3.scale.linear()
	    .domain([min, max])
	    .range([0, svg_width - 2*svg_padding]);

	var yScale = d3.scale.linear()
	    .domain([
	      Number(d3.max(stats, function(d){ return d.field })) + 1,
	      Number(d3.min(stats, function(d){ return d.field })) - 1
	    ])    
	    .range([svg_height - svg_padding, svg_padding]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	svg.append("g")
		.attr("class", "axis")
	    .attr("transform", "translate(" + svg_padding + "," + (svg_height-svg_padding) + ")")
	    .attr("fill", "#999")
	    .style("stroke-width", "2px")
	    .call(xAxis);

	var boxes = svg.selectAll("g.box")
	    .data(stats)
	    .enter()
	    .append("g")
	    .classed("box", true)
	    .attr("transform", function(d){
	      return "translate(" + svg_padding + "," + yScale(d.field) + ")"
	    });

	var range = boxes.append("line")
		.attr("class", "range")
        .attr("x1", function(d){
        	return xScale(d.max);
        })
        .attr("x2", function(d){
        	return xScale(d.min);
        })
        .attr("y1", 0)
        .attr("y2", 0)
        .style("stroke", function(d, i){
        	return colorScale(d.field);
        })
        .style("stroke-width", "2px");

    var line_max = boxes.append("line")
    	.attr("class", "max")
        .attr("x1", function(d){
        	return xScale(d.max);
        })
        .attr("x2", function(d){
        	return xScale(d.max);
        })
        .attr("y1", -10)
        .attr("y2", 10)
        .style("stroke", function(d, i){
        	return colorScale(d.field);
        })
        .style("stroke-width", "2px");

    var line_min = boxes.append("line")
    	.attr("class", "min")
        .attr("x1", function(d){
        	return xScale(d.min);
        })
        .attr("x2", function(d){
        	return xScale(d.min);
        })
        .attr("y1", -10)
        .attr("y2", 10)
        .style("stroke", function(d, i){
        	return colorScale(d.field);
        })
        .style("stroke-width", "2px");

    var iqr = boxes.append("rect")
    	.attr("class", "iqr")
        .attr("x", function(d){
        	return xScale(d.q1);
        })
        .attr("y", -10)
        .attr("height", 20)
        .attr("width", function(d){
        	return xScale(d.q3) - xScale(d.q1);
        })
        .style("fill", function(d, i){
        	return d3.rgb(colorScale(d.field)).brighter();
        })
        .style("stroke", function(d, i){
        	return colorScale(d.field);
        })
        .style("stroke-width", "2px");

    var line_median = boxes.append("line")
    	.attr("x1", function(d){
        	return xScale(d.median);
        })
        .attr("x2", function(d){
        	return xScale(d.median);
        })
        .attr("y1", -10)
        .attr("y2", 10)
        .style("stroke", function(d, i){
        	return colorScale(d.field);
        })
        .style("stroke-width", "2px");
})
}