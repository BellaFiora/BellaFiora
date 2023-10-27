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