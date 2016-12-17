if($('#histogram')){
var current_path = window.location.pathname.split("/");
var current_id = current_path[current_path.length-1];

d3.json("/departments.json", function(dep){
	var svg_width = 400;
	var svg_height = 250;
	var svg_padding = 20;

	var svg = d3.select("#histogram")
				.append("svg")
				.attr("width", svg_width)
				.attr("height", svg_height);

	var rscore = dep.map(function(a) {return Number(a.ts_rscore);});
	var this_rscore;
	$.each(dep, function(i, v){
		if(v.dep_no == current_id){
			this_rscore = v.ts_rscore
		}
	});

	var bin_num = 10;
    var histogram = d3.layout.histogram()
				.range([d3.min(rscore), d3.max(rscore)])
			    .bins(bin_num)
				.frequency(true);

	var hist_data = histogram(rscore);

	console.log(hist_data)


	var xScale = d3.scale.linear()
                .domain([d3.min(rscore), d3.max(rscore)])
                .range([0, svg_width-svg_padding*2]);

	var max_height = svg_height - svg_padding - 20;
	var heights = hist_data.map(function(a) {return a.y});
	var yScale = d3.scale.linear()
				.domain([d3.min(heights),d3.max(heights)])
				.range([20, max_height]);
	var rect_width = (svg_width-svg_padding*2) / bin_num;

	var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        // .tickValues(d3.range(d3.min(rscore), d3.max(rscore), 5))
        // .tickFormat(function(d, i){ return i* })

    var colorScale = d3.scale.linear()
            .domain([d3.min(heights), d3.max(heights)])
            .range([d3.rgb("steelblue").brighter(), d3.rgb("steelblue").darker()]);

	var rect = svg.append("g")
					.selectAll("rect")
					.data(hist_data)
					.enter()
					.append("rect")
					.attr("transform", "translate(" + svg_padding + "," + svg_padding + ")")
					.attr("x", function(d, i){
						return i*rect_width;
					})
					.attr("y", function(d, i){
						return max_height - yScale(d.y);
					})
					.attr("width", rect_width)
					.attr("height", function(d, i){
						return yScale(d.y);
					})
					.attr("fill", function(d, i){
						return colorScale(d.y);
					});

	svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + svg_padding + "," + (svg_height-svg_padding) + ")")
	    .call(xAxis);


	svg.append("line")
		.attr("stroke", "#999")
		.attr("stroke-width", "1px")
		.attr("x1", function(d){
			return xScale(this_rscore) + svg_padding;
		})
		.attr("y1", 0+svg_padding)
		.attr("x2", function(d){
			return xScale(this_rscore) + svg_padding;
		})
		.attr("y2", svg_height-svg_padding)
});
}