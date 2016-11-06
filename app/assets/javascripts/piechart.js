var current_path = window.location.pathname.split("/");
var current_id = current_path[current_path.length-1];
d3.json("/departments/" + current_id + ".json", function(data){
	var adj_dep = data.adj_dep.filter(function(d){
		return d.value >= 5;
	});
	var student_sum = data.adj_dep.reduce(function(sum, d){
		return sum + d.value;
	}, 0);
	var other = {
		dep_no: 0,
		name: "其他",
		value: student_sum - adj_dep.reduce(function(sum, d){return sum + d.value;}, 0)
	}
	adj_dep.push(other);
	console.log(adj_dep);
	var svg_width = 400;
	var svg_height = 400;

	var pi = Math.PI;
	var pie = d3.layout.pie()
				// .startAngle(-90 * (pi/180))
				// .endAngle(90 * (pi/180));
	var piedata = pie(adj_dep.map(function(d){return d.value;}));

	var outerRadius = 150;
	var arc = d3.svg.arc()
				.outerRadius(outerRadius)
				.innerRadius(0);

	var colors = d3.scale.category10();

	var svg = d3.select("#piechart")
				.append("svg")
				.attr("width", svg_width)
				.attr("height", svg_height)
	var arcs = svg.selectAll("g")
				.data(piedata)
				.enter()
				.append("g")
				.attr("transform", "translate(" + svg_width/2 + "," + svg_height/2 + ")");
	arcs.append("path")
		.attr("fill", function(d, i){
			return colors(i);
		})
		.attr("d", function(d, i){
			return arc(d);
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