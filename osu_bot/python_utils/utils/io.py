import os
from .print import cprint


def read_file(path, mode="r"):
	r = None
	if os.path.exists(path):
		try:
			with open(path, mode) as f:
				r = f.read()
		except:
			cprint("read_file: failed tp read " + path, "red")
	return r


def count_files_in_dir(directory, check_if_file=True):
	count = 0
	if check_if_file:
		for path in os.scandir(directory):
			if os.path.is_file():
				count += 1
	else:
		for path in os.scandir(directory):
			count += 1
	return count
