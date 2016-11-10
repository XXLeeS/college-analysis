var current_path = window.location.pathname.split("/");
var current_id = current_path[current_path.length-1];
d3.json("/departments/" + current_id + ".json", function(data){
	var student_sum = data.adj_dep.reduce(function(sum, d){
		return sum + d.value;
	}, 0);
	var adj_dep = data.adj_dep.filter(function(d){
		return d.value/student_sum >= 0.05;
	});
	var other = {
		dep_no: 0,
		name: "其他",
		value: student_sum - adj_dep.reduce(function(sum, d){return sum + d.value;}, 0)
	}
	adj_dep.push(other);
	adj_dep.sort(function(a, b){
		return b.value - a.value;
	})
	var svg_width = 400;
	var svg_height = 400;

	var pi = Math.PI;
	var pie = d3.layout.pie()
				.padAngle(.02);
	var piedata = pie(adj_dep.map(function(d){return d.value;}));
	console.log(piedata);

	var outerRadius = 150;
	var innerRadius = 120;
	var arc = d3.svg.arc()
				.outerRadius(outerRadius)
				.innerRadius(innerRadius);
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
	var text_name = text_block.append("tspan")
						.classed("name", true)
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
			text_value.text(adj_dep[i].value);
			//add stroke-width
		});
	arcs.append("text")
		.text(function(d){
			percent = Math.floor(d.value*100/student_sum, -1);
			if(percent >= 5){
				return percent + "%";
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