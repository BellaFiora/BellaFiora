import sys
from commands.parse import parse
from commands.bm_options import *

def bm_command(string):
	arguments, options = parse(string, bm_options, 0, default_bm_arguments, default_bm_options)
	# print(arguments)
	# print(options)
	if (options[-1]):
		print('bm help message')
	else:
		print(arguments, options)

def main():
	input_string = 'bot.py -h' if len(sys.argv) < 2 else ' '.join(sys.argv)
	bm_command(input_string)
	

if __name__ == '__main__':
	main()