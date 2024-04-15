function ctm(ms, totms) {
	const totalSeconds = Math.floor(totms / 1000);
	const totalMinutes = Math.floor(totalSeconds / 60);
	const totalHours = Math.floor(totalMinutes / 60);

	const currentSeconds = Math.floor(ms / 1000);
	const currentMinutes = Math.floor(currentSeconds / 60);
	const currentHours = Math.floor(currentMinutes / 60);

	const remainingSeconds = currentSeconds % 60;
	const remainingMinutes = currentMinutes % 60;

	const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
	const formattedMinutes = remainingMinutes.toString().padStart(2, '0');
	const formattedHours = totalHours > 0 ? currentHours.toString().padStart(2, '0') : '';

	if (totalHours > 0) {
		return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
	} else {
		return `${formattedMinutes}:${formattedSeconds}`;
	}
}
module.exports.ctm = ctm

