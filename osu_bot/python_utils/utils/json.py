import os, json
from .print import cprint


def get_attributes(obj):
	return [
		a for a in dir(obj) if not a.startswith("__") and not callable(getattr(obj, a))
	]


def load_json(path, mode="r"):
	r = None
	if os.path.exists(path):
		try:
			with open(path, mode) as f:
				r = json.loads(f.read())
		except:
			cprint("read_json: failed tp read " + path, "red")
	return r


def save_json(obj, filename, indent=3):
	with open(filename, "w+") as f:
		f.write(json.dumps(obj, indent=indent))


def match_aliases(x, aliases):
	for key, values in aliases.items():
		if x == key or x in values:
			return key
	return None


def get_next_key(string, keys):
	# meant to extract cookies from cookies string in response headers
	start_index = 0
	minimum_index = -1
	n = len(keys)
	if n > 0:
		minimum_index = string.find(keys[start_index])
	else:
		return -1, None
	while minimum_index == -1 and start_index < n - 1:
		start_index += 1
		minimum_index = string.find(keys[start_index])
	if start_index == n:
		return -1, None
	minimum_key = keys[start_index]
	if minimum_index > 0:
		for i in range(start_index + 1, n):
			cur_index = string.find(keys[i])
			if cur_index < minimum_index and cur_index != -1:
				minimum_key = keys[i]
				minimum_index = cur_index
	return minimum_index, minimum_key


def transfer_json_data(
	source, dest, keys=[], key_action=None, value_action=None, force=False
):
	if key_action == None:
		key_action = lambda key: key
	if value_action == None:
		value_action = lambda value: value
	if force:
		if keys == []:
			for key, value in source.items():
				dest[key_action(key)] = value_action(value)
		else:
			for key, value in source.items():
				key = key_action(key)
				if key in keys:
					dest[key] = value_action(value)
	else:
		if keys == []:
			for key, value in source.items():
				key = key_action(key)
				if key in dest:
					dest[key] = key_action(value)
		else:
			for key, value in source.items():
				key = key_action(key)
				if key in dest and key in keys:
					dest[key] = value_action(value)
