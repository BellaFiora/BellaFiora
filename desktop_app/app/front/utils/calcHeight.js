function calcHeight(text) {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	context.font = `16px sans-serif`;
	context.letterSpacing = 1;
	const coefficient = context.measureText(text).width / 250;
	return 35 * coefficient + 'px';
}
module.exports.calcHeight = calcHeight