if($('#piechart')){
var current_path = window.location.pathname.split("/");
var current_id = current_path[current_path.length-1];
d3.json("/departments/" + current_id + ".json", function(data){
	var student_sum = data.adj_dep.reduce(function(sum, d){
		return sum + d.value;
	}, 0);
	var adj_dep = data.adj_dep;
	var svg_width = 500;
	var svg_height = 500;

	var pie = d3.layout.pie()
				.padAngle(.02);
	//define the attribute name of object we want
	pie.value(function(d, i){
		return d.value;
	})
	var piedata = pie(adj_dep);
	console.log(piedata);

	var radius = 200;
	var labelRadius = 230;
	var arc = d3.svg.arc()
				.outerRadius(radius)
				.innerRadius(radius - 30);
	var arc_outer = d3.svg.arc()
						.outerRadius(radius + 20)
						.innerRadius(radius - 30);
	var colors = d3.scale.linear().domain([0, piedata.length])
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
	var center_block = svg.append("text")
						.attr("text-anchor", "middle")
						.attr("transform", "translate(" + svg_width/2 + "," + svg_height/3 + ")");
	var center_value = center_block.append("tspan")
							.classed("value", true)
							.attr("text-anchor", "middle")
							.attr("x", "0")
							.attr("dy", svg_height*2/15);
	var center_link = center_block.append("a")
						.classed("name", true);
	var center_name = center_link.append("tspan")
						.attr("text-anchor", "middle")
						.attr("x", "0")
						.attr("dy", svg_height*1/15);
	var center_percentage = center_block.append("tspan")
							.classed("percentage", true)
							.attr("text-anchor", "middle")
							.attr("x", "0")
							.attr("dy", svg_height*2/15);

	arcs.append("path")
		.attr("fill", function(d, i){
			return colors(i);
		})
		.attr("d", function(d, i){
			return arc(d);
		})
		.on("mouseover", function(d, i){
			center_value.text(d.data.value + " 人");
			center_link.attr("href", '/departments/'+d.data.dep_no)
			center_name.text(d.data.name);
			center_percentage.text(d.data.percentage + " %");
			d3.select(this).transition().duration(100).attr("d", arc_outer);
		})
		.on("mouseout", function(d, i){
			d3.select(this).transition().duration(100).attr("d", arc);
		});

	function midAngle(d){
		return (d.startAngle + (d.endAngle - d.startAngle)/2);
	}
	var label_line =  arcs.filter(function(d){
			return d.data.percentage >= 5;
		})
		.append("line")
		.attr("x1", function(d){
			return arc.centroid(d)[0];
		})
		.attr("y1", function(d){
			return arc.centroid(d)[1];
		})
		.attr("x2", function(d){
			return Math.sin(midAngle(d)) * labelRadius;
		})
		.attr("y2", function(d){
			return -Math.cos(midAngle(d)) * labelRadius;
		})
		.attr("stroke-width", "1")
		.attr("stroke", "#666")
	var lebel_text = arcs.filter(function(d){
			return d.data.percentage >= 5;
		})
		.append("text")
		.attr({
			"x": function(d){
				var x = Math.sin(midAngle(d)) * labelRadius;
				var sign = (x > 0)? 1 : -1;
				var offset = 5;
				return x + sign*offset;
			},
			"y": function(d){
				var y = -Math.cos(midAngle(d)) * labelRadius;
				var sign = (y > 0)? 1 : -1;
				var offset = 5;
				return y + sign*offset;
			},
			"text-anchor": function(d){
				return (midAngle(d) < Math.PI)? "start" : "end"
			}
		})
		.text(function(d){
			return d.data.percentage + "%";
		});
})
}