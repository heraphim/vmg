function Sitegen(rows, cols) {
    this.sites = [];
    this.rows = rows;
    this.cols = cols;
	this.noiseScale = 0.006;


}

Sitegen.prototype.generateSites = function() {
	let rows = this.rows;
	let cols = this.cols;
	for(let dy = 0; dy < rows; dy++) {
		let hexoff = 0;
		let coloffset = 0;
		let offset = scl/2; // shift to have the point in the middle of the desired cell
		hexoff = (dy % 2 == 0) ? offset : 0; // each even row is shifted a bit more to create hexagonal grid
		coloffset = (dy % 2 == 0) ? 1 : 0;
		for (let dx = 0; dx < cols - coloffset; dx++) {
			let x = dx * scl + offset + hexoff;
			let y = dy * scl + offset;
			this.sites.push({x, y});
		}
	}
}
Sitegen.prototype.genPerlin = function() {
	let noiseScale = this.noiseScale;
	for (let i = 0; i < this.sites.length; i++) {
		let x = this.sites[i].x;
		let y = this.sites[i].y;
		let noiseX = noise(x * noiseScale, y * noiseScale);
		let noiseY = noise((x + 1000) * noiseScale, (y + 1000) * noiseScale);
		this.sites[i].noiseX = noiseX;
		this.sites[i].noiseY = noiseY;
		this.sites[i].land = (noiseX <= waterThresh) ? false : true;
	}
}
Sitegen.prototype.perlinMove = function() {
	let moveScale = 3 * scl;
	for (let i = 0; i < this.sites.length; i++) {
		let xoff = map(this.sites[i].noiseX, 0, 1, - moveScale, moveScale);
		let yoff = map(this.sites[i].noiseY, 0, 1, - moveScale, moveScale);
		this.sites[i].x = this.sites[i].x + xoff;
		this.sites[i].y = this.sites[i].y + yoff;
	}
}
Sitegen.prototype.getSites = function() {
	this.generateSites();
	this.genPerlin();
	this.perlinMove();
	return this.sites;
}