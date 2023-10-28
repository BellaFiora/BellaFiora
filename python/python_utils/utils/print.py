import json, inspect, pprint, zlib
try:
	from bs4 import BeautifulSoup
except:
	import os
	os.system('pip install beautifulsoup4')
	from bs4 import BeautifulSoup

BLACK, RED, GREEN, YELLOW, BLUE, PURPLE, CYAN, WHITE = 30, 31, 32, 33, 34, 35, 36, 37
# in case not all was imported (from debug import *)
color_codes = {
	'black': 30,
	'red': 31,
	'green': 32,
	'yellow': 33,
	'blue': 34,
	'purple': 35,
	'cyan': 36,
	'white': 37
}
# make it work for windows?
def cprint(string, color=37, end='\n'):
	if type(color) is str: color = color_codes.get(color.lower())
	if color:
		print(f"\033[{color}m{string}\033[0m", end=end)
	else:
		print(f'cprint: Unknown color ({color}), available colors are:\n')
		print_json(color_codes)

def print_var(var, indent=3, color=37):
	callers_local_vars = inspect.currentframe().f_back.f_locals.items()
	cprint(pprint.pformat(str([k for k, v in callers_local_vars if v is var][0])+' = '+str(var), indent=indent), color=color)
	print()

def _print_json(obj, indent, color):
	if type(obj) is str or type(obj) is bytes:
		try:
			obj = json.loads(obj)
		except:
			obj = str(obj)
			cprint(f'print_json: json.loads() failed loading the provided string or bytes ({obj})')
			return
	cprint(json.dumps(obj, indent=indent), color)

# accepts bytes, str, dict or list of them
def print_json(obj, indent=3, color=37):
	if type(obj) is list:
		if obj != []:
			for o in obj: _print_json(o, indent, color)
		else:
			cprint('[]', color=color)
	else:
		_print_json(obj, indent, color)

def print_all_attributes(obj, builtin=False, color=37):
	if builtin:
		for attr in dir(obj):
			value = getattr(obj, attr)
			cprint(f'{attr} = {value}\n\n', color)
	else:
		for attr in dir(obj):
			if not attr.startswith("__"):
				value = getattr(obj, attr)
				cprint(f'{attr} = {value}\n\n', color)



def print_all_items(obj, color=37):
	for key, value in obj.items():
		cprint(f'{key} = {value}\n\n', color)

def print_response(r, indent=3, color=37, content_color=37):
	if color != 37 and content_color == 37: content_color = color
	
	headers = {}
	for key, value in r.headers.items():
		headers[key] = value
	saved_response = {
		# "_content": r._content.decode('utf-8'),
		"_content_consumed": str(r._content_consumed),
		"_next": str(r._next),
		"status_code": str(r.status_code),
		"headers": headers,
		"url": str(r.url),
		"encoding": str(r.encoding),
		"history": str(r.history),
		"reason": str(r.reason),
		"elapsed": str(r.elapsed)
	}

	cprint(json.dumps(saved_response, indent=indent), color=color)
	if r._content != b'':
		# decode

		content_encoding = None
		content_encoding_in_headers = True
		if 'Content-Encoding' in headers: content_encoding = 'Content-Encoding'
		elif 'content-encoding' in headers: content_encoding = 'content-encoding'
		else: content_encoding_in_headers = False

		if content_encoding in headers:
			if 'gzip' in headers[content_encoding] or 'compress' in headers[content_encoding] or 'deflate' in headers[content_encoding]:
				# content = zlib.decompress(r._content) fails :c
				content = r._content.decode('utf-8', 'ignore')
			elif 'br' in headers[content_encoding]:
				# content = brotli.decompress(r._content) fails :c
				content = r._content.decode('utf-8', 'ignore')
		else:
			content = r._content.decode('utf-8', 'ignore')

		# format and print
		
		content_type = None
		content_type_in_headers = True
		if 'Content-Type' in headers: content_type = 'Content-Type'
		elif 'content-type' in headers: content_type = 'content-type'
		else: content_type_in_headers = False

		if content_type_in_headers:
			if 'text/plain' in headers[content_type]:
				cprint(content, color=content_color)
			elif 'text/html' in headers[content_type]:
				cprint(BeautifulSoup(content, 'html.parser').prettify(indent_width=indent), color=content_color)
			elif 'application/json' in headers[content_type]:
				cprint(json.dumps(json.loads(content), indent=indent), color=content_color)
			elif 'application/x-www-form-urlencoded' in headers[content_type]:
				cprint(decode_url(content), color=content_color)
		else:
			cprint(content, color=content_color)