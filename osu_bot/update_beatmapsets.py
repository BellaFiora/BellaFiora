import requests, time, os, math
from multiprocessing import Process, Manager
from python_utils.utils.math import divide
from update_beatmaps import update_beatmaps


def _update_beatmapsets(
	start: int,
	end: int,
	apikey: str,
	nb_beatmapsets_downloaded: int,
	lock: multiprocessing.Lock,
) -> None:
	for beatmapset_id in range(start, end):
		if os.path.exists(f"cache/beatmapsets/{beatmapset_id}"):
			continue
		r = requests.get(
			f"https://osu.ppy.sh/api/get_beatmaps?k={apikey}&s={beatmapset_id}"
		)
		if r.status_code != 200 or r.content == b"[]":
			continue
		with open(f"cache/beatmapsets/{beatmapset_id}.json", "wb+") as f:
			f.write(r.content)
		lock.acquire()
		nb_beatmapsets_downloaded.value += 1
		lock.release()
		time.sleep(1)


def update_beatmapsets() -> None:
	while True:
		print("updating beatmapsets...")
		content = ""
		with open("../.apikeys", "r") as f:
			content = f.read()

		manager = multiprocessing.Manager()
		nb_beatmapsets_downloaded = manager.Value("i", 0)
		lock = manager.Lock()
		running_processes = []

		apikeys = content.split("\n")
		ranges = divide(2500000, len(apikeys))
		for k, (i, j) in enumerate(zip(ranges)):
			p = Process(
				target=_update_beatmapsets,
				args=(
					i,
					j,
					apikeys[k],
					nb_beatmapsets_downloaded,
					lock,
				),
			)
			p.start()
			running_processes.append(p)
		for process in running_processes:
			p.join()
		print(f"{nb_beatmapsets_downloaded.value} new beatmapsets were downloaded")
		print("updating beatmaps...")
		update_beatmaps()
		time.sleep(604800)


def start_update_beatmapsets_thread() -> None:
	update_beatmapsets_thread = Thread(target=update_beatmapsets)
	update_beatmapsets_thread.start()
