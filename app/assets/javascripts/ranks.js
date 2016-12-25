$('.fields').css("margin-top", (window.innerHeight-$('#navbar').height()-20*2)/12 + 20)

var options = {
  valueNames: ['rank', 'name', 'rscore', 'mu', 'sigma']
};

var depList = new List('table', options);