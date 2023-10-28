import time, re
try:
	import pytz
except:
	import os
	os.system('pip install pytz')
	import pytz
from datetime import datetime, timezone
from python_utils.utils.str import *
from python_utils.utils.print import *

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

def parse(input_string, options, first=False, default_arguments=[], default_options=None):
	# considers that shorts begin with '-' and longs with '--'
	# options format:
	# options = [
	#	[option1_takes_arg, "option1_short", "option1_long1", "option1_long2", ...],
	#	[option2_takes_arg, "option2_short", "option2_long1", "option2_long2", ...],
	# 	...
	# ]
	# returns arguments, parsed_options
	# arguments being the list of all arguments (including the default ones if provided)
	# parsed_options being the list of all options values (including the default ones if provided)
	# parsed_options[0] being the value of the first option in the options list
	txt = input_string.strip()
	while '  ' in txt: txt = txt.replace('  ', ' ')
	l = list(txt.split(' '))
	arguments = default_arguments
	parsed_options = []
	if default_options:
		parsed_options = default_options
	else:
		for value in options:
			if value[0]: parsed_options.append(None)
			else: parsed_options.append(False)
	i = 0 if first else 1
	while i < len(l):
		e = l[i]
		is_arg = True
		for k, tmp in enumerate(options):
			takes_arg = tmp[0]
			short = tmp[1]
			longs = tmp[2:]
			if len(e) >= 3 and e[0] == '-' and e[1] == '-' and e[2:] in longs:
				if takes_arg:
					if i+1 < len(l):
						parsed_options[k] = l[i+1]
					i += 1
				else:
					parsed_options[k] = True
				is_arg = False
				break
			elif e[0] != '_' and len(e) >= 2 and e[0] == '-' and e[1] == short:
				if len(e) == 2:
					if takes_arg:
						if i+1 < len(l):
							parsed_options[k] = l[i+1]
						i += 1
					else:
						parsed_options[k] = True
					is_arg = False
				else:
					if not takes_arg:
						multiple_short_options = True
						multiple_short_options_indexes = [k]
						for c in e[2:]:
							option = None
							takes_arg = False
							index = -1
							for o, tmp in enumerate(options):
								short = tmp[1]
								if short == c:
									option = short
									takes_arg = tmp[0]
									index = o
									break
							if option and not takes_arg:
								multiple_short_options_indexes.append(index)
							else:
								multiple_short_options = False
								break
						if multiple_short_options:
							is_arg = False
							for o in multiple_short_options_indexes:
								parsed_options[o] = True
				break
		if is_arg: arguments.append(e)
		i += 1
	return arguments, parsed_options