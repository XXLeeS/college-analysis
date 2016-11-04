var current_path = window.location.pathname.split("/");
var current_id = current_path[current_path.length-1];
d3.json("/departments/" + current_id + ".json", function(adj_dep){
	console.log(adj_dep);
})