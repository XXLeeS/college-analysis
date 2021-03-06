if($('#histogram').length){
var current_path = window.location.pathname.split('/');
var current_year = current_path[1];
var current_id = current_path[3];

d3.json("/" + current_year + "/departments.json", function(dep){
	var svg_padding = 20;
	var svg_width = parseInt(d3.select("#histogram").style("width"), 10);
	var svg_height = 250;

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

	var xScale = d3.scale.linear()
                .domain([d3.min(rscore), d3.max(rscore)])
                .range([0, svg_width-svg_padding*2]);

	var max_height = svg_height - svg_padding - 20;
	var heights = hist_data.map(function(a) {return a.y});
	var yScale = d3.scale.linear()
				.domain([d3.min(heights),d3.max(heights)])
				.range([2, max_height]);
	var rect_width = (svg_width-svg_padding*2) / bin_num;

	var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        // .tickValues(d3.range(d3.min(rscore), d3.max(rscore), 5))

    var colorScale = d3.scale.linear()
            .domain([d3.min(heights), d3.max(heights)])
            .range([d3.rgb("#16A085").brighter(), d3.rgb("#16A085").darker()]);

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
					})
					.on("mouseover", function(d, i){
						d3.select(this).attr("fill", "#E67E22");
						d3.select(labels[0][i]).style("visibility", "visible");
						d3.select(label_rects[0][i]).style("visibility", "visible");
					})
					.on("mouseout", function(d, i){
						d3.select(this).attr("fill", colorScale(d.y));
						d3.select(labels[0][i]).style("visibility", "hidden");
						d3.select(label_rects[0][i]).style("visibility", "hidden");
					});

	var labels = svg.append("g")
					.classed("labels", true)
					.selectAll("text")
					.data(hist_data)
					.enter()
					.append("text")
					.attr("transform", "translate(" + svg_padding + "," + svg_padding + ")")
					.attr("x", function(d, i){
						return rect_width * (i);
					})
					.attr("y", function(d, i){
						return max_height - yScale(d.y);
					})
					.attr("dx", function(){
						return rect_width/2;
					})
					.attr("dy", -5)
					.attr("text-anchor", "middle")
					.text(function(d){
			            return d.length + ", " + ((d.length / dep.length)*100).toFixed(1) + "%";
			        })
			        .style("fill", "#fff")
			        .style("visibility", "hidden");

	var labels_padding = 2;
	var bboxs = [];
	labels.each(function(){
		bboxs.push(this.getBBox());
	})

	var label_rects = d3.select('.labels')
						.selectAll("rect")
						.data(bboxs)
						.enter()
						.insert("rect", ":first-child")
						.attr("transform", "translate(" + svg_padding + "," + svg_padding + ")")
						.attr("x", function(d){ return d.x - labels_padding })
					    .attr("y", function(d){ return d.y })
					    .attr("width", function(d){ return d.width + 2*labels_padding })
					    .attr("height", function(d){ return d.height })
					    .style("fill", "#D35400")
					    .style("visibility", "hidden");

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