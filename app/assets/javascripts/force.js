if(window.location.pathname.split('/')[2] == 'force'){
var spinner = new Spinner({
    color: '#666',
    lines: 12,
    position: 'absolute',
    top: '50%'
}).spin(document.getElementById('force'));

var departments;
var dep_autocomplete = [];
$.getJSON('/105/force', function(data){
    departments = data;
    $.each(data, function(i, v){
        dep_autocomplete.push({
            label: v.name,
            value: v.dep_no
        });
    });
    dep_autocomplete.sort(function(a, b){
        return a.value - b.value;
    });
    startd3();
});

$('#search').autocomplete({
    source: dep_autocomplete
});

function depnoToName(dep_no){
    var name;
    $.each(departments, function(i, v){
        if(v.dep_no == dep_no){
            name = v.name;
            return;
        }
    });
    return name;
}

$('#force').css("height", window.innerHeight - $('#navbar').height())
            .css("width", document.body.clientWidth*3/4);
function startd3(){
d3.json("/105/get_nodes", function(nodes){
    d3.json("/105/get_links", function(links){       
        var svg_height = $('#force').height();
        var svg_width = $('#force').width();

        var colors = d3.scale.ordinal()
                        .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
                        .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#bcbd22", "#17becf", "#111111"]);

        
        var force = d3.layout.force()
                        .size([svg_width, svg_height])
                        .linkDistance(50)
                        .charge([-1000]);

        
//        check whether two nodes linked
        var linkedByIndex;
        function linkedInitial(){
            linkedByIndex = {};
            links.forEach(function(d){
                linkedByIndex[d.source.index + "," + d.target.index] = true;
            })
        }
        function isConnected(a, b){
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index];
        }
        
//        define text show and hide
        function showtext(d){
            d3.select(svg_texts[0][d.index]).style("visibility", "visible");
        }
        function hidetext(d){
            d3.select(svg_texts[0][d.index]).style("visibility", "hidden");
        }
        
//        define zoom event
        var zoom = d3.behavior.zoom()
                        .scaleExtent([0.001, 10])
                        .on("zoom", zoomed);
        function zoomed(){
            container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }
        
//        define drag event
        var drag = d3.behavior.drag()
                        .origin(function(d){ return d; })
                        .on("dragstart", dragstarted)
                        .on("drag", dragged)
                        .on("dragend", dragended);
        function dragstarted(d){
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("dragging", true);

        }
        function dragged(d){
            d3.select(this).attr("cx", d.x = d3.event.x)
                            .attr("cy", d.y = d3.event.y);
            tick();
        }
        function dragended(d){
            d3.select(this).classed("dragging", false);
            tick();
            force.resume();
        }
        
        
//        start drawing graph
        d3.select("#force *").remove();
        var svg = d3.select("#force")
                    .append("svg")
                    .attr("width", svg_width)
                    .attr("height", svg_height)
                    .call(zoom);
        var container = svg.append("g");
        
        var svg_links = container.selectAll("line");
        var svg_texts = container.selectAll("text");
        var svg_nodes = container.selectAll("circle");

        function start(){
            force.nodes(nodes)
                .links(links)
                .start();
                        
            svg_links = svg_links.data(links);
            svg_links.exit().remove();
            svg_links.enter()
                    .insert("line", "text")
                    .style("stroke", "#000")
                    .style("stroke-width", function(d){ return Math.sqrt(d.value) });

            svg_nodes = svg_nodes.data(nodes);
            svg_nodes.exit().remove();
            svg_nodes.enter()
                    .insert("circle", "text")
                    .attr("r", 10)
                    .attr("fill", function(d, i){
                        return colors(d.field);
                    })
                    .on("mouseover", function(d){
                        svg_nodes.classed("node-active", function(n){
                            if(isConnected(d, n)){
                                showtext(n);
                                return true;
                            }
                            return false;
                        });
                        svg_links.classed("link-active", function(l){
                            return l.source == d || l.target == d;
                        });
                        
                        showtext(d);
                        d3.select(this).classed("node-active", true);
                        
                        $("#node_name a").text(depnoToName(d.dep_no))
                                        .attr("href", "/departments/" + d.dep_no);
                    })
                    .on("mouseout", function(d){
                        hidetext(d);
                        d3.select(this).classed("node-active", false);
                        svg_nodes.classed("node-active", function(n){
                            hidetext(n);
                            return false;
                        });
                        svg_links.classed("link-active", function(l){
                            return false;
                        });
                    })
                    .call(drag);
            
            svg_texts = svg_texts.data(nodes);
            svg_texts.exit().remove();
            svg_texts.enter()
                    .append("text")
                    .text(function(d){
                        return depnoToName(d.dep_no);
                    })
                    .style("fill", "black")
                    .style("visibility", "hidden")
                    .attr("dx", 20)
                    .attr("dy", 5);
            
            
            linkedInitial();
        }
        
        start();
        spinner.stop();
        $('#spinner_text').remove();

//        define legend
        var legend_data = {
                "field": ["教育領域", "人文及藝術領域", "社會、商業及法律", "科學領域", "工程、製造及營造", "農學領域", "醫藥衛生及社福", "服務領域", "其他"],
                "level": ["台清交成政", "中字輩", "醫學大學", "國立", "私立大學", "退場大學"]
            };
        var current_legend = legend_data.field;
        var line_height = 20;
        var legend_container = d3.select("#legend")
                                .append("svg")
                                .attr("height", line_height*12);
        var legend = legend_container.selectAll("g");
        function draw_legend(){
            legend = legend.data(current_legend);
            legend.exit().remove();
            legend.enter()
                    .insert("g")
                    .attr('transform', function(d, i){
                        var horz = 0;
                        var vert = i*line_height;
                        return 'translate(' + horz + ', ' + vert + ')';
                    });
            legend.html("");
            legend.insert("circle")
                    .attr("r", 5)
                    .attr("cx", line_height/2)
                    .attr("cy", line_height/2)
                    .attr("fill", function(d, i){
                        return colors(i+1);
                    });
            legend.insert("text")
                    .attr("x", 20)
                    .attr("y", line_height-4)
                    .text(function(d){ return d; })
        }
        draw_legend();

//        define links and nodes dynamic position
        force.on("tick", tick);
        function tick(){
            svg_nodes.attr("cx", function(d){ return d.x; })
                        .attr("cy", function(d){ return d.y; });
            svg_links.attr("x1", function(d){ return d.source.x; })
                        .attr("y1", function(d){ return d.source.y; })
                        .attr("x2", function(d){ return d.target.x; })
                        .attr("y2", function(d){ return d.target.y; });
            svg_texts.attr("x", function(d){ return d.x; })
                        .attr("y", function(d){ return d.y; });
        }
        
//        search function
        $('#search_submit').click(function(){
            var dep_no = $('#search').val();
            if(dep_no){
                var target;
                svg_nodes.each(function(d){
                    if(d.dep_no == dep_no){
                        target = d3.select(this);
                    }
                })
                var target_x = svg_width/2 - target.data()[0].x;
                var target_y = svg_height/2 - target.data()[0].y;
                zoom.translate([target_x, target_y]).scale(1);
                container.attr("transform", "translate(" + target_x + "," + target_y + ")scale(1)");
                target.attr("r", 100);
                target.transition().duration(3000).attr("r", 10);
            }
        })

//        threshold function
        var links_original = [];
        for(var i = 0; i<links.length; i++){
            links_original.push(links[i]);
        }
        
        $("#threshold").change(function(){
            threshold(this.value);
        });
        function threshold(thresh){
            links.splice(0, links.length);
            for(var i = 0; i < links_original.length; i++){
                if(links_original[i].value > thresh){
                    links.push(links_original[i]);
                }
            }
            
            start();
        }

//         group function
        $('#group input').change(function(){
            if(this.value == 'field'){
                current_legend = legend_data.field;
                svg_nodes.attr("fill", function(d, i){
                    return colors(d.field);
                })
            }
            else if(this.value == 'level'){
                current_legend = legend_data.level;
                svg_nodes.attr("fill", function(d, i){
                    return colors(d.level);
                })
            }
            draw_legend();
        })
    })
})
}
}
