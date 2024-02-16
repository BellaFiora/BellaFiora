// const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzMDE2NSIsImp0aSI6IjA1M2Q4MzMxY2JkOWJlMDQ5YWIwMTQ3ODIwZTJhZmUwMmE5ZGYyODIwNGQ2ZWUwYWVmYTA5Y2Y5YTQ2NjU0YjM3MmNmMDM1YWFlODIxODNiIiwiaWF0IjoxNzA3NzAwODExLjQ2OTQxLCJuYmYiOjE3MDc3MDA4MTEuNDY5NDEyLCJleHAiOjE3MDc3ODcyMTEuNDU3MTQyLCJzdWIiOiI1MTQ2NTMxIiwic2NvcGVzIjpbImlkZW50aWZ5IiwicHVibGljIl19.InZJ9or-Ve9IwDdHOZtXTTns9G0fz4UM8Qy8ZOtI7_Cb3GlypOZ8PaSiWFlGONLIlO1JUjyJbfoGNSRuyXnOp5RnD2KoEudYi0z0i2VSO40xfllrmC-6ovJa49MC4ytlqGs_Ilp4bjDvs-W0eDOZL7Psu4c_q0Fgg9mEJ62AePBqcC-flmYQI35bPrVQF19_feqy1_rY0Vwayx5Iah8EhiGCSnxPITBU0_O2a8Mqf9n-lUlOyEnVyEbpkiJ23MfGA2edLpcSG-5zJ_GlKFFwcS_B-ogPejMtpv_V1i9L73MeK8S3wBs6m7G7Y981WZdgFGm1ePsV6jTTfWPFMBWS7N9nVXBcxaVbl5SZe0wpjx11RAn_1cjBB-Ojv5g3lfEmJpB-JDpyJYuJoJ8xjQclJmaeQBNVsW7fSRQaN2DcLNJ9x1pPCztwGAUVK3jLVKx2_t9eqPUNNYbZgOoXkym_rLMWLNI-zrV_XoD9upq7BY6HUGJ4sj5l1hd9y3vpnLIoYGVYV0foHdGMhJ5JH5_RTFW9iDo9X3dJU01YXvxtsHlKOZvIyGTNflZQJLXFyay-14XB68qyaxSG2-ZPQHZE0U4Ic8M2eGdjUdOgRsywMHL9eT4uCuNDzbZkxIBhCZ1DltSkDoq-lTIDneN9DFOct8MX1veDaK541qEMDE6J0hc"
// async function test() {
//     return new Promise(async (resolve, reject) => {
//         const headers2 = new Headers({
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//             "Accept": "application/json"
//         });

//         const response2 = await fetch(`https://osu.ppy.sh/api/v2/users/5146531/mania`, { method: 'GET', headers: headers2 });
//         const v2_data2 = await response2.json();
//         console.log(v2_data2)

//         resolve(v2_data2);
//     });
// }

// setTimeout(async () => {
//     await test();
// }, 1);

const https = require('https');
const fs = require('fs');
const querystring = require('querystring');

const bmsetId = '2071776';
let osuSession = '';

function replaceForbiddenCharacters(filename) {
	const forbiddenCharacters = ['<', '>', ':', '"', '/', '\\', '|', '?', '*'];
	for (const char of forbiddenCharacters) {
		filename = filename.split(char).join('_');
	}
	return filename.replace(/\.$/, '');
}

fs.readFile('osu_session', 'utf8', (err, data) => {
	if (err) throw err;
	osuSession = data.trim();

	const headers = {
		'Referer': `https://osu.ppy.sh/beatmapsets/${bmsetId}`,
		'Cookie': `locale=en; osu_session=${osuSession}`
	};

	https.get({
		hostname: 'osu.ppy.sh',
		path: `/beatmapsets/${bmsetId}/download`,
		headers: headers,
		agent: false,
		allowRedirects: false
	}, (res) => {
		const setCookie = res.headers['set-cookie'];
		const osuSessionCookie = setCookie.find(cookie => cookie.includes('osu_session'));
		const start = osuSessionCookie.indexOf('osu_session') + 'osu_session'.length + 1;
		const end = osuSessionCookie.indexOf(';', start);
		osuSession = osuSessionCookie.substring(start, end);
		const location = res.headers['location'];
		const queryIndex = location.indexOf('?fs=');
		const filename = replaceForbiddenCharacters(decodeURIComponent(location.substring(queryIndex + '?fs='.length, location.indexOf('.osz&fd='))));
		
		https.get(location, { headers: headers }, (downloadRes) => {
			const fileStream = fs.createWriteStream(`${filename}.osz`);
			downloadRes.pipe(fileStream);
			fileStream.on('finish', () => {
				fileStream.close();
				fs.writeFile('osu_session', osuSession, (err) => {
					if (err) throw err;
					console.log('Session updated and file saved.');
				});
			});
		});
	});
});