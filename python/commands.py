import sys, os
from python_utils.utils.all import *

def load_commands() -> None:
	global bm_options, default_bm_arguments, default_bm_options
	options = None
	with open('../commands/bm_options.json', 'r') as f:
		options = json.loads(f.read())
	bm_options = options["options"]
	default_bm_arguments = options["default_arguments"]
	default_bm_options = options["default_options"]

def send_to_beatmap_parser(osufile_path:str) -> None:
	global jsonified_bm
	os.system('cd beatmap_parser/bin && bm_parser.exe ' + osufile_path)
	while not os.path.exists('beatmap_parser/bin/out'):
		pass
	with open('beatmap_parser/bin/out', 'r', encoding='utf-8') as f:
		jsonified_bm =json.loads(f.read())
	os.remove('beatmap_parser/bin/out')

def help_command(string:str) -> str:
	return 'current commands: help, ping, echo, bm'

def ping_command(string:str) -> str:
	return 'pong'

def echo_command(string:str) -> str:
	return string[6:]

def bm_command(string:str) -> str:
	args, opts = parse(string, bm_options, False, default_bm_arguments, default_bm_options)
	print(args, opts)
	if opts[-1]:
		return 'bm help message'
	return 'mmh'
	# find map...
	path = '../../bms/kimi.osu'
	send_to_beatmap_parser(path)
	print_json(jsonified_bm)
