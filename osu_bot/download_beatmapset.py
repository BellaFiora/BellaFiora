# import requests, json
# r = json.loads(requests.get("https://osu.ppy.sh/users/33141911/extra-pages/historical?mode=osu").content)
# s = 0
# for e in r["monthly_playcounts"]:
# 	s += int(e["count"])
# print(s)
# import json, html
# content = '...'
# content = content[content.find('data-initial-data="') + len('data-initial-data="'):]
# json_text = html.unescape(content[:content.find('</div>') - 7])
# with open('data_initial_data.json', 'w+', encoding='utf-8') as f:
# 	f.write(json.dumps(json.loads(json_text), indent=4))

import requests, http, time, urllib

def replace_forbidden_characters(filename):
	forbidden_characters = '<>:"/\\|?*'
	for char in forbidden_characters:
		filename = filename.replace(char, '_')
	return filename.rstrip('.')

bmset_id = '2071776'
osu_session = ''

with open('osu_session', 'r') as f:
	osu_session = f.read()

headers = {
	"Referer": f"https://osu.ppy.sh/beatmapsets/{bmset_id}",
	"Cookie": f"locale=en; osu_session={osu_session}"
}

r = requests.get(f'https://osu.ppy.sh/beatmapsets/{bmset_id}/download', headers=headers, allow_redirects=False)
print(r.status_code, http.HTTPStatus(r.status_code).phrase)
setcookie = r.headers.get('Set-Cookie')
setcookie = setcookie[setcookie.find('osu_session') + len('osu_session') + 1:]
osu_session = setcookie[:setcookie.find(';')]
filename = r.headers['Location']
filename = filename[filename.find('?fs=') + len('?fs='):]
filename = replace_forbidden_characters(urllib.parse.unquote(filename[:filename.find('.osz&fd=')]))
r = requests.get(r.headers['Location'], headers=headers)
with open(f'{filename}.osz', 'wb') as f:
	f.write(r.content)

with open('osu_session', 'w') as f:
	f.write(osu_session)