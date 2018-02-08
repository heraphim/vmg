var scl = 20;
var wd = 900;
var hg = 800;
var cols = wd / scl;
var rows = hg / scl;
var sites = [];
var diagram;
var voronoi;
var bbox = {xl: 0, xr: wd, yt: 0, yb: hg};
var mapStyle = 'elevation';
var reDraw = true;
let waterThresh = 0.41;


// initiate p5 so I can have access to general function
function setup() {
}
function draw() {
	noLoop();
}

// initiate an instance for the map, that will be static
var m = function(m) {
	m.setup = function() {
		m.createCanvas(wd, hg);
		sitegen = new Sitegen(rows, cols);
		sites = sitegen.getSites();
		voronoi = new Voronoi();
		diagram = voronoi.compute(sites, bbox);
		diagram.prepareCells(); // prepare the diagram, with othe modifications
		console.log(diagram);
	}

	m.draw = function() {
		if (reDraw) {
			console.log('%c -----------------------------------------------------------------------', 'background: #f4df42; color: #f4df42');
			diagram.draw(m);
			reDraw = false;
		}
		diagram.drawChanged(m);
	}
}
var map = new p5(m, 'map');
// initiate an instance for the overlay canvas
var o = function(o) {
	o.setup = function() {
		o.createCanvas(wd, hg);
	}

	o.draw = function() {
		o.clear();
		diagram.drawSelected(o);
	}
}
var selectOverlay = new p5(o, 'selectOverlay');

$(document).ready(function() {
	$('body').on('click', '#selectOverlay', function(e) {
        let x = e.pageX - $(this).offset().left
        let y = e.pageY - $(this).offset().top;
        let cellId = diagram.getClosestSite(x, y);
        let selCell = diagram.getCellById(cellId);
        console.log(selCell);
        diagram.setSelCell(selCell);
	});
	$('.mapStyle .btn').click(function(e) {
		e.preventDefault();
		mapStyle = $(this).attr('data-mapStyle');
		$('.mapStyle .btn').removeClass('disabled');
		$(this).addClass('disabled');
		reDraw = true;
	});
});