var svg_padding = 20;
var svg_height = window.innerHeight - $('#navbar').height() - svg_padding*2;
var bar_height = 20;
$('.fields').css("margin-top", (svg_height)/12 + 10);
$('.one-field').css("height", bar_height).css("margin-bottom", (svg_height - bar_height*10)/12)

var options = {
  valueNames: ['rank', 'name', 'rscore', 'mu', 'sigma']
};

var depList = new List('table', options);