var current_path = window.location.pathname.split("/");
var current_id = current_path[current_path.length-1];
d3.json("/departments/" + current_id + ".json", function(data){
	var adj_dep = data.adj_dep;
	var svg_width = 400;
	var svg_height = 400;

	var pi = Math.PI;
	var pie = d3.layout.pie()
				.startAngle(-90 * (pi/180))
				.endAngle(90 * (pi/180));
	var piedata = adj_dep.map(function(d){return d.value;});
	console.log(piedata);
})