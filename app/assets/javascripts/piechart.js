var current_path = window.location.pathname.split("/");
var current_id = current_path[current_path.length-1];
d3.json("/departments/" + current_id + ".json", function(data){
	var student_sum = data.adj_dep.reduce(function(sum, d){
		return sum + d.value;
	}, 0);
	var adj_dep = data.adj_dep;
	var svg_width = 600;
	var svg_height = 600;

	var pi = Math.PI;
	var pie = d3.layout.pie()
				.padAngle(.02);
	var piedata = pie(adj_dep.map(function(d){return d.value;}));

	var R = 200;
	var arc = d3.svg.arc()
				.outerRadius(R)
				.innerRadius(R-30);
	var arc_outer = d3.svg.arc()
						.outerRadius(R+20)
						.innerRadius(R-30);
	var colors = d3.scale.linear().domain([0, adj_dep.length])
					      .interpolate(d3.interpolateHcl)
					      .range([d3.rgb("#00F"), d3.rgb('#F0F')]);

	var svg = d3.select("#piechart")
				.append("svg")
				.attr("width", svg_width)
				.attr("height", svg_height)
	var arcs = svg.selectAll("g")
				.data(piedata)
				.enter()
				.append("g")
				.attr("transform", "translate(" + svg_width/2 + "," + svg_height/2 + ")");
	var text_block = svg.append("text")
						.attr("text-anchor", "middle")
						.attr("transform", "translate(" + svg_width/2 + "," + svg_height/2 + ")");
	var link = text_block.append("a")
						.classed("name", true)
	var text_name = link.append("tspan")
						.attr("text-anchor", "middle")
						.attr("x", "0")
						.attr("dy", "20px");
	var text_value = text_block.append("tspan")
							.classed("value", true)
							.attr("text-anchor", "middle")
							.attr("x", "0")
							.attr("dy", "12px");
	arcs.append("path")
		.attr("fill", function(d, i){
			return colors(i);
		})
		.attr("d", function(d, i){
			return arc(d);
		})
		.on("mouseover", function(d, i){
			text_name.text(adj_dep[i].name);
			link.attr("href", '/departments/'+adj_dep[i].dep_no)
			text_value.text(adj_dep[i].value + " 人 / " + adj_dep[i].percentage + " %");
			d3.select(this).transition().duration(100).attr("d", arc_outer);
		})
		.on("mouseout", function(d, i){
			d3.select(this).transition().duration(100).attr("d", arc);
		});
	arcs.append("text")
		.text(function(d, i){
			if(adj_dep[i].percentage >= 5){
				return adj_dep[i].percentage + "%";
			}
			else{
				return;
			}
		})
		.attr("transform", function(d, i){
	        return "translate(" + arc.centroid(d) + ")";
	    })
	    .attr("text-anchor", "middle")
	    .attr("fill", "white");
})