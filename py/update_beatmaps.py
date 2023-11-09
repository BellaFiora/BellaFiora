import requests, os, json, time, math, sys
from multiprocessing import Process
from python_utils.utils.math import divide

def _update_beatmaps(start:int, end:int, bmsetids:List[int], nb_beatmaps_downloaded:int, lock:multiprocessing.Lock) -> None:
	content = ''
	for i in range(start, end):
		bmsetid = bmsetids[i]
		with open('cache/beatmapsets/'+bmsetid, 'rb') as f:
			content = f.read()
		bmset = json.loads(content)
		if not bmset: continue
		for bm in bmset:
			if not 'beatmap_id' in bm: continue
			bmid = bm['beatmap_id']
			if not bmid: continue
			if os.path.exists(f'cache/beatmaps/{bmid}.osu'): continue
			r = requests.get('https://osu.ppy.sh/osu/'+bmid)
			while r.status_code != 200:
				time.sleep(1)
				r = requests.get('https://osu.ppy.sh/osu/'+bmid)
			with open(f'cache/beatmaps/{bmid}.osu', 'wb+') as f:
				f.write(r.content)
			lock.acquire()
			nb_beatmaps_downloaded.value += 1
			lock.release()
			time.sleep(1)

def update_beatmaps():
	content = ''
	with open('../.apikeys', 'r') as f:
		content = f.read()

	manager = multiprocessing.Manager()
	nb_beatmaps_downloaded = manager.Value('i', 0)
	lock = manager.Lock()
	running_processes = []

	bmsetids = os.listdir('cache/beatmapsets')
	for k, (i, j) in enumerate(divide(len(bmsetids), 10)):
		p = Process(target=_update_maps, args=(i, j, bmsetids, nb_beatmaps_downloaded, lock,))
		p.start()
		running_processes.append(p)
	for process in running_processes:
		p.join()
	print(f'{nb_beatmaps_downloaded.value} new beatmaps were downloaded')
