import sys, os
from python_utils.utils.all import *

def get_commands_options():
	global bm_options, default_bm_arguments, default_bm_options
	options = None
	with open('../commands/bm_options.json', 'r') as f:
		options = json.loads(f.read())
	bm_options = options["bm_options"]
	default_bm_arguments = options["default_bm_arguments"]
	default_bm_options = options["default_bm_options"]

def send_to_beatmap_parser(osufile_path):
	global jsonified_bm
	os.system('cd beatmap_parser/bin && bm_parser.exe ' + osufile_path)
	while not os.path.exists('beatmap_parser/bin/out'):
		pass
	with open('beatmap_parser/bin/out', 'r', encoding='utf-8') as f:
		jsonified_bm =json.loads(f.read())
	os.remove('beatmap_parser/bin/out')

def bm_command(string):
	arguments, options = parse(string, bm_options, 0, default_bm_arguments, default_bm_options)
	if (options[-1]):
		print('bm help message')
	else:
		print(arguments, options)
	# find map...
	path = '../../bms/kimi.osu'
	send_to_beatmap_parser(path)
	print_json(jsonified_bm)

def main():
	get_commands_options()
	input_string = 'bot.py -h' if len(sys.argv) < 2 else ' '.join(sys.argv)
	bm_command(input_string)

if __name__ == '__main__':
	main()