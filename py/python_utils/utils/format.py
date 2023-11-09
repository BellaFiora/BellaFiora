import time, re, copy
import pytz
from datetime import datetime, timezone
from python_utils.utils.str import *
from python_utils.utils.print import *
from python_utils.utils.list import *

def convert_to_unix_time(date_str, format_str):
	parsed_date = datetime.strptime(date_str, format_str)
	unix_time = int(time.mktime(parsed_date.timetuple()))
	return unix_time

def code_to_txt(code):
	return code.replace('   ', '\\t').replace('''
''', '\\n')

def txt_to_code(code):
	code.replace('\\\\t', '\\t')
	code.replace('\\\\n', '\\n')
	return code.replace('\\t', '    ').replace('\\n', '''
''')

def guess_order(ls):
	ns = {}
	for l in ls:
		for i in range(len(l)):
			if l[i] not in ns: ns[l[i]] = 0
			ns[l[i]] = max(ns[l[i]], i)
	return [e for e in sorted(ns, key=lambda x: ns[x])]

def format_time_ago(date_str, format_str):
	date = datetime.strptime(date_str, format_str)
	if date.tzinfo is None or date.tzinfo.utcoffset(date) is None:
		date = pytz.utc.localize(date)
	now = datetime.now(timezone.utc)
	time_diff = now - date
	
	years = time_diff.days // 365
	months = time_diff.days // 30
	weeks = time_diff.days // 7
	days = time_diff.days
	hours = time_diff.seconds // 3600
	minutes = (time_diff.seconds % 3600) // 60
	seconds = time_diff.seconds % 60
	
	if years > 0:
		if months >= 6: years += 1
		decades = floor(years/10)
		centuries = floor(decades/10)
		if centuries > 0:
			return f"{centuries} centurie{'s' if centuries > 1 else ''}"
		elif decades > 0:
			return f"{decades} decade{'s' if decades > 1 else ''}"
		return f"{years} year{'s' if years > 1 else ''}"
	elif months > 0:
		if days >= 15: # rougly half a month
			months += 1
			if months == 12: return '1 year'
		return f"{months} month{'s' if months > 1 else ''}"
	elif weeks > 0:
		if days >= 4: # round up if friday, saturday or sunday
			weeks += 1
			if weeks == 4: return '1 month' # roughly a month
		return f"{weeks} week{'s' if weeks > 1 else ''}"
	elif days > 0:
		if hours >= 12:
			days += 1
			if days == 7: return '1 week'
		return f"{days} day{'s' if days > 1 else ''}"
	elif hours > 0:
		if minutes >= 30:
			hours += 1
			if hours == 24: return '1 day'
		return f"{hours} hour{'s' if hours > 1 else ''}"
	elif minutes > 0:
		if seconds >= 30:
			minutes += 1
			if minutes == 60: return '1 hour'
		return f"{minutes} minute{'s' if minutes > 1 else ''}"
	else:
		return f"{seconds} second{'s' if seconds > 1 else ''}"

def ansi_text(text, esc_format=None, esc=None, end=None):
	# replaces occurences of:
	# [color <options>]
	
	# example:  ansi_text(this [bgyellow]is some[reset] long [blue]text with [bg    red _]colored parts, esc_format='shell')
	# 			becomes:
	#			this \e[0;43mis some\e[0m long \e[0;34mtext with \e[4;41mcolored parts\e[0m -- (add a reset at the end by default)
	
	# available colors : black, red, green, yellow, blue, purple, cyan, white
	# available options : * (bold), _ (underline), bg (background), hi (high intensity) -- order does not matter, spaces are ignored
	# example for high intensity red background underlined text : [hibg_red] or [hi_bg red] (wink to french people)

	# esc arg specifies how the esc character should be written, overwrite esc_format
	# esc_format arg changes how the escape character will be put in the output:
	esc_formats = {'shell': '\\e', 'ascii_hex': '\\0x1B', 'ascii_oct': '\\033', 'json': '\\u001B'}
	if not esc:
		esc = ''
		if esc_format:
			if esc_format in esc_formats:
				esc = esc_formats[esc_format]
			else:
				cprint(f'ansi_text: Unknown format ({esc_format})', 'red')
				return None
	matches = re.finditer(r"\[[?*?_?(bg)?(hi)a-z\s]+\]", text)
	try:
		offset = 0
		for m in matches:
			st = m.start()-offset
			ed = m.end()-offset
			match = text[st+1:ed-1]
			n = len(match)+2
			color_offset = 0
			dec = 0
			i =	match.find('*')
			if i != -1:
				match = match[:i]+match[i+1:]
				dec = 1
			i =	match.find('_')
			if i != -1:
				match = match[:i]+match[i+1:]
				dec = 4
			i =	match.find('bg')
			if i != -1:
				match = match[:i]+match[i+2:]
				color_offset += 10
			i =	match.find('hi')
			if i != -1:
				match = match[:i]+match[i+2:]
				color_offset += 60
			while '  ' in match:
				match = match.replace('  ', ' ')
			match = match.replace(' ', '')
			match = match.strip()

			if match == 'reset':
				new = esc+'[0m'
			else:
				color = str(color_codes[match]+color_offset)
				new = f'{esc}[{dec};{color}m'
			offset += n - len(new)
			text = text[:st]+new+text[ed:]
	except Exception as e:
		cprint(f'ansi_text: failed ({e})', 'red')
		return None
	r = text+end if end else text+esc+'[0m'
	return r

def _parse_check_option_value(value):
	if not value[1] or len(value[1]) == 0:
		if not value[2] or len(value[2]) == 0:
			print('parse: shorts and longs cannot be both empty')
			return 1
		value[1] = list([])
		value[2] = list(value[2])
	else:
		value[1] = list(value[1])
		value[2] = list(value[2] if value[2] else [])
	return 0

def parse(input_string, options, first=False, default_arguments=[], default_options=None, default_help=True, default_help_value=True):
	# considers that shorts begin with '-' and longs with '--'
	# options format:
	# options = [
	#	[option1_takes_arg, ["option1_short1", "option1_short2", ...], ["option1_long1", "option1_long2", ...]],
	#	[option2_takes_arg, ["option2_short2", "option2_short2", ...], ["option2_long1", "option2_long2", ...]],
	# 	...
	# ]
	# the shorts or longs list can be empty or null (considered as empty) in which case the other must not be empty
	# returns arguments, parsed_options
	# arguments being the list of all arguments (including the default ones if provided)
	# parsed_options being the list of all options values (including the default ones if provided)
	# parsed_options[0] being the value of the first option in the options list
	# set first to True if the input_string does not contain the command name
	# a default help option is added: [False, ["h", "?"], ["help"]], you can disable that by setting default_help to False
	# also by default, it will be at the end so parsed_options[-1] is the help option value
	# it is 1 if no argument and no option is provided, u can disable that by setting default_help_value to False (requires default_help to be True)
	
	# init / prepare parsing
	txt = input_string.strip()
	while '  ' in txt: txt = txt.replace('  ', ' ')
	l = list(txt.split(' '))
	arguments = default_arguments
	parsed_options = list()
	if default_options:
		parsed_options = copy.deepcopy(default_options)
		for value in options:
			if _parse_check_option_value(value):
				return None, None
	else:
		for value in options:
			if value[0]: parsed_options.append(None)
			else: parsed_options.append(False)
			if _parse_check_option_value(value):
				return None, None
	if default_help:
		options.append([False, list(["h", "?"]), list(["help"])])
		parsed_options.append(False)
	options_found = 0
	i = 0 if first else 1
	
	# parse input_string
	while i < len(l):
		e = l[i]
		is_arg = True
		for k, tmp in enumerate(options):
			takes_arg = tmp[0]
			shorts = tmp[1]
			longs = tmp[2]
			if len(e) >= 3 and e[0] == '-' and e[1] == '-' and e[2:] in longs:
				if takes_arg:
					if i+1 < len(l):
						parsed_options[k] = l[i+1]
						options_found += 1
					i += 1
				else:
					parsed_options[k] = True
					options_found += 1
				is_arg = False
				break
			elif e[0] != '_' and len(e) >= 2 and e[0] == '-' and e[1] in shorts:
				if len(e) == 2:
					if takes_arg:
						if i+1 < len(l):
							parsed_options[k] = l[i+1]
							options_found += 1
						i += 1
					else:
						parsed_options[k] = True
						options_found += 1
					is_arg = False
				else:
					if not takes_arg:
						multiple_short_options = True
						multiple_short_options_indexes = [k]
						for c in e[2]:
							option = None
							takes_arg = False
							j = -1
							for o, tmp in enumerate(options):
								index = tmp[1].get(c)
								if index >= 0:
									option = tmp[1][index]
									takes_arg = tmp[0]
									j = o
									break
							if option and not takes_arg:
								multiple_short_options_indexes.append(j)
							else:
								multiple_short_options = False
								break
						if multiple_short_options:
							is_arg = False
							for o in multiple_short_options_indexes:
								parsed_options[o] = True
								options_found += 1
				break
		if is_arg: arguments.append(e)
		i += 1
	
	if default_help:
		if default_help_value and len(arguments) == 0 and options_found == 0:
			parsed_options[-1] = True
		options.pop()
	
	return arguments, parsed_options
