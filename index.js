window.addEventListener('load', () => {
	buildHexgrid(120, 10);
});

window.addEventListener('resize', () => {
	cleanSVGGrid();
	buildHexgrid(120, 10);
});

function cleanSVGGrid() {
	let svg = document.querySelector('#svg-hexgrid');
	while (svg.lastElementChild) {
		svg.removeChild(svg.lastElementChild);
	}
}

// Hexagon width (large diagonal) and distance between two hexagons;
function buildHexgrid(hexWidth, hexMargin) {
	let container = document.querySelector('#svg-container');
	let svg = document.querySelector('#svg-hexgrid');

	// Automatically generated measures, based on the given width;
	let {lDiag: hexLDiag, sDiag: hexSDiag, height: hexHeight} = getHexMeasures(hexWidth);
	let hexesInRow = Math.floor((container.offsetWidth - hexLDiag) / ((3*hexSDiag/2) + hexMargin)) + 1;
	let rowCount = Math.floor((container.offsetHeight - (hexHeight * 1.5 + hexMargin)) / (hexHeight + (hexMargin * 2))) + 1;

	// Distribute the remaining space evenly to the start and end of the grid;
	let remainingWidth = container.offsetWidth - ((hexSDiag + (3*hexLDiag/4 * (hexesInRow - 1)) + (hexMargin * (hexesInRow - 1))) + hexSDiag);
	let remainingHeight = (container.offsetHeight  - (hexHeight * 1.5 + hexMargin)) - ((hexHeight + (hexMargin * 2)) * (rowCount - 1));
	let containerXMargin = hexSDiag + remainingWidth/2;
	let containerYMargin = hexHeight/2 + remainingHeight/2;

	Array(rowCount).fill().map((r, i) => {
		let y = containerYMargin + ((hexHeight + (hexMargin * 2)) * i);
		return buildHexRow(containerXMargin, y, hexLDiag, hexHeight, hexMargin, hexesInRow)
	}).flat().forEach(h => svg.appendChild(h));
}

function getHexMeasures(lDiag) {
	return {
		lDiag,
		sDiag: lDiag/2,
		height: Math.sqrt(Math.pow(lDiag/2, 2) - Math.pow(lDiag/4, 2)) * 2,
	}
}

function buildHexPath(center, lDiag, hexHeight) {
	if (!lDiag) hexHeight = getHexMeasures(lDiag).height;
	return `M
		${center[0] - lDiag/2} ${center[1]},
		${center[0] - lDiag/4} ${center[1] - hexHeight/2},
		${center[0] + lDiag/4} ${center[1] - hexHeight/2},
		${center[0] + lDiag/2} ${center[1]},
		${center[0] + lDiag/4} ${center[1] + hexHeight/2},
		${center[0] - lDiag/4} ${center[1] + hexHeight/2}
	Z`;
}

function buildHexSVG(x, y, lDiag, hexHeight) {
	let hex = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	hex.setAttribute('class', `hex`);
	hex.setAttribute('d', buildHexPath([x, y], lDiag, hexHeight));
	hex.setAttribute('data-x', x);
	hex.setAttribute('data-y', y);
	return hex;
}

function buildHexRow(x0, y0, lDiag, hexHeight, hexMargin, n) {
	return Array(n).fill().map((h, i) => {
		let x = x0 + (3 * lDiag/4 * i) + (hexMargin * i);
		let y = i % 2 ? y0 + hexHeight/2 + hexMargin : y0;
		return buildHexSVG(x, y, lDiag, hexHeight)
	});
}