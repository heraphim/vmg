Voronoi.prototype.Diagram.prototype.draw = function(c) {
	let cells = this.cells;
	for (var i = 0; i < cells.length; i++) {
		cells[i].draw(c, false);
	}
}

Voronoi.prototype.Cell.prototype.draw = function(c, strokeCol) {
	let halfedges = this.halfedges;
	let cellCol;
	// draw the cell
	c.beginShape();
	c.noStroke();
	for (let i = halfedges.length - 1; i >= 0; i--) {
		let r;
		let g;
		let b;
		if (this.site.land == false) {
			cellCol = '#0B589E';
		}
		else {
			r = round(map(this.site.noiseX, 0, landTresh, 229, 0));
			g = round(map(this.site.noiseX, 0, landTresh, 191, 70));
			b = round(map(this.site.noiseX, 0, landTresh, 0, 7));

			cellCol = c.color(r, g, b);
		}
		c.fill(cellCol);
		let x = halfedges[i].getStartpoint().x;
		let y = halfedges[i].getStartpoint().y;
		c.vertex(x, y);
	}
	c.endShape(CLOSE);

	// draw edges
	c.strokeWeight(1);
	strokeCol = (strokeCol) ? strokeCol : cellCol; // if stroke color is set draw it, otherwise draw same color
	c.stroke(0);
	for (let i = halfedges.length - 1; i >= 0; i--) {
		let x1 = halfedges[i].getStartpoint().x;
		let y1 = halfedges[i].getStartpoint().y;
		let x2 = halfedges[i].getEndpoint().x;
		let y2 = halfedges[i].getEndpoint().y;
		c.line(x1, y1, x2, y2);
	}

	// // draw site
	// let x = this.site.x;
	// let y = this.site.y;
	// c.stroke(point);
	// c.strokeWeight(3);
	// c.point(x, y);
}

Voronoi.prototype.Diagram.prototype.setSelCell = function(cell) {
	this.selCel = cell;
}

Voronoi.prototype.Diagram.prototype.drawSelected = function(cell) {
	if (this.selCel) {
		this.selCel.draw(selectOverlay, 255);
	}
}

Voronoi.prototype.Diagram.prototype.prepareCells = function(cell) {
	let cells = this.cells;
	for (let i = 0; i < cells.length; i++) {
		let thisCel = cells[i];
		// check if it's on the edge of the canvas
		for (let j = 0; j < thisCel.halfedges.length; j++) {
			if (thisCel.halfedges[j].edge.lSite == null || thisCel.halfedges[j].edge.rSite == null) {
				thisCel.site.onEdge = true;
				thisCel.site.land = false;
				thisCel.site.noiseX = 0.1;
			}
			else {
				thisCel.site.onEdge = false;
			}
		}
		// set the neighbors of each cell
		thisCel.neighborIds = [];
		let neighborIds = thisCel.getNeighborIds();
		for (let j = 0; j < neighborIds.length; j++) {
			thisCel.neighborIds.push(this.getCellById(neighborIds[j]));
		}
	}
}

Voronoi.prototype.Diagram.prototype.getCellById = function(id) {
	let site;
	site = this.cells.filter( function(obj) {
		return obj.site.voronoiId == id;
	});
	return site[0];
}

Voronoi.prototype.Diagram.prototype.getClosestSite = function (x, y) {
	let bestDist = Infinity;
	let closestSite;
	for (let i = 0; i < this.cells.length; i++) {
		let siteX = this.cells[i].site.x;
		let siteY = this.cells[i].site.y;
		let currDist = dist(x, y, siteX, siteY);
		if (currDist < bestDist) {
			bestDist = currDist;
			closestSite = this.cells[i].site.voronoiId;
		}
	}
	return closestSite;
};