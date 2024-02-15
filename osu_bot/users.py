import random, time

def define_macros() -> None:
	global USER_ID, USER_NAME, USER_JOIN_DATE, USER_COUNTRY, NB_USER_MODE_DATA, MODES_START_LINES, LINES_NUMBER

	# user data file lines macros
	USER_ID = 0
	USER_NAME = 1
	USER_JOIN_DATE = 2
	USER_COUNTRY = 3
	FIRST_MODE_START_LINE = COUNTRY + 2
	STD_START_LINE = FIRST_MODE_START_LINE
	TAIKO_START_LINE = STD_START_LINE + NB_USER_MODE_DATA + 2
	CTB_START_LINE = TAIKO_START_LINE + NB_USER_MODE_DATA + 2
	MANIA_START_LINE = CTB_START_LINE + NB_USER_MODE_DATA + 2
	LAST_MODE_START_LINE = MANIA_START_LINE
	MODES_START_LINES = [STD_START_LINE, TAIKO_START_LINE, CTB_START_LINE, MANIA_START_LINE]
	LINES_NUMBER = 1 + LAST_MODE_START_LINE + NB_USER_MODE_DATA # +1 bc starts at 0

	# user data indices macros

	# v1
	COUNT_300 = 0
	COUNT_100 = 1
	COUNT_50 = 2
	PLAY_COUNT = 3
	RANKED_SCORE = 4
	TOTAL_SCORE = 5
	PP_RANK = 6
	LEVEL = 7
	PP_RAW = 8
	ACCURACY = 9
	COUNT_RANK_SS = 10
	COUNT_RANK_SSH = 11
	COUNT_RANK_S = 12
	COUNT_RANK_SH = 13
	COUNT_RANK_A = 14
	COUNTRY = 15
	PLAY_TIME = 16
	PP_COUNTRY_RANK = 17

	# v2
	IS_ACTIVE = 18
	IS_BOT = 19
	IS_DELETED = 20
	IS_ONLINE = 21
	IS_SUPPORTER = 22
	LAST_VISIT = 23
	PM_FRIENDS_ONLY = 24
	PROFILE_COLOUR = 25

	# ignores v2 for now
	NB_USER_MODE_DATA = PP_COUNTRY_RANK + 1

def load_apikeys() -> None:
	global apikeys
	content = ''
	with open('../.apikeys', 'r') as f:
		content = f.read()
	apikeys = content.split('\n')

def load_users_infos() -> None:
	global users
	users = []
	files = os.listdir('cache/users')
	for username in files:
		content = ''
		with open('cache/users/'+username, 'r') as f:
			content = f.read()
		lines = content.split('\n')

		#	 	std, taiko, ctb, mania
		modes = []
		for start_line in MODES_START_LINES:
			modes.append([
				lines[start_line + COUNT_300],
				lines[start_line + COUNT_100],
				lines[start_line + COUNT_50],
				lines[start_line + PLAY_COUNT],
				lines[start_line + RANKED_SCORE],
				lines[start_line + TOTAL_SCORE],
				lines[start_line + PP_RANK],
				lines[start_line + LEVEL],
				lines[start_line + PP_RAW],
				lines[start_line + ACCURACY],
				lines[start_line + COUNT_RANK_SS],
				lines[start_line + COUNT_RANK_SSH],
				lines[start_line + COUNT_RANK_S],
				lines[start_line + COUNT_RANK_SH],
				lines[start_line + COUNT_RANK_A],
				lines[start_line + COUNTRY],
				lines[start_line + PLAY_TIME],
				lines[start_line + PP_COUNTRY_RANK]
				])
		users.append([lines[USER_ID], username, lines[USER_JOIN_DATE], lines[USER_COUNTRY], modes])

def _get_user_info(username:str, mode:int) -> object:
	apikey = apikeys[random.randint(0, len(apikeys))]
	return requests.get(f'https://osu.ppy.sh/api/get_user?k={apikey}&u={username}&m={mode}&type=string')

def get_user_info(username:str, mode:int) -> dict:
	r = _get_user_info(username, mode)
	while r.status_code != 200:
		time.sleep(1)
		r = _get_user_info(username, mode)
	return json.loads(r.content)

def save_user(username:str) -> None:
	user_modes_infos = []
	for i in range(4):
		user_modes_infos.append(get_user_info(username, i)[0])
		time.sleep(0.25)
	lines = [''*LINES_NUMBER]
	lines[USER_ID] = user_modes_infos[0]['user_id']
	lines[USER_NAME] = username
	lines[USER_JOIN_DATE] = user_modes_infos[0]['join_date']
	lines[USER_COUNTRY] = user_modes_infos[0]['country']
	for i in range(4):
		user_mode_infos = user_modes_infos[i]
		for j in range(NB_USER_MODE_DATA):
			lines[MODES_START_LINES[i] + j] = user_mode_infos[j]
	with open('cache/users/'+username) as f:
		f.write('\n'.join(lines))

def is_new_user(username:str) -> int:
	for user in users:
		if username == user[USER_NAME]:
			return 0
	return 1

def update_user(username:str) -> None:
	if is_new_user(username):
		save_user(username)
