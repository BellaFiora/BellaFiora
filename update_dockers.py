import os, sys, time, mysql.connector, math
from py_bot.python_utils.utils.all import *

st_total = time.time()
if len(sys.argv) == 1:
	print('give prod or dev as argument')
	exit(1)

branch = sys.argv[1]
if branch == 'prod':
	root = '/mnt/user/node-containers/BellaFiora/'
elif branch == 'dev':
	root = '/mnt/user/node-containers/BellaFiora_Dev/'
else:
	print('give prod or dev as argument')
	exit(1)
args = read_file('.ssh').split('\n')[0:4]
docker_manager = DockerManager(*args, dotenv_path=root+'common/env/.env', root_depth=4)
if docker_manager == None:
	exit(1)
docker_manager._send('dummy.txt', 'dummy.txt')
if docker_manager.sftp == None or docker_manager.ssh == None:
	exit(1)

commits_done_file = 'commits_done_'+branch
commits_done = []
updated_dockers = []
if os.path.exists(commits_done_file):
	content = ''
	with open(commits_done_file, 'r') as f:
		content = f.read()
	commits_done = content.split('\n')[:-1]

docker_names = ['private_api', 'public_api', 'bm_manager', 'js_bot', 'py_bot', 'user_manager', 'webapp', 'common']
logs = os.popen('git log --name-status --oneline --no-decorate --format="///%H"').read()
commits = logs.split('///')[1:]

'''
cmd>git log --name-status --oneline --no-decorate --format="///%H"
///ce042254a2ce20233646c8f657d713d011e3e77c

M       py_bot/python_utils/utils/web.py
///50de47255f3c99e9ee7715b894b7b8613b55d91e

M       py_bot/python_utils/utils/constants.py
M       py_bot/python_utils/utils/web.py
///e3101286b2b67a9b8f07480b88b0893b78350d6c

R100    common/assets/34071295.jpg      common/assets/avatar.jpg
///c52dba7a6b27c958a04c44dd4101fe5886bbbcd0

A       common/assets/34071295.jpg
///bc80dbdb990cbf3f84d375099203bf150ff156f2

M       py_bot/python_utils/utils/web.py
M       update_dockers.py
///cbcba790c0fa7026542a4060de6ed596b46dd144

M       py_bot/python_utils/utils/all.py
A       py_bot/python_utils/utils/constants.py
A       py_bot/python_utils/utils/io.py
M       py_bot/python_utils/utils/os.py
D       py_bot/python_utils/utils/unsorted.py
M       py_bot/python_utils/utils/web.py
M       update_dockers.py
A       update_dockers.py.lprof

commits = [
'ce042254a2ce20233646c8f657d713d011e3e77c\n\nM\tpy_bot/python_utils/utils/web.py\n',
'50de47255f3c99e9ee7715b894b7b8613b55d91e\n\nM\tpy_bot/python_utils/utils/constants.py\nM\tpy_bot/python_utils/utils/web.py\n',
'e3101286b2b67a9b8f07480b88b0893b78350d6c\n\nR100\tcommon/assets/34071295.jpg\tcommon/assets/avatar.jpg\n',
'c52dba7a6b27c958a04c44dd4101fe5886bbbcd0\n\nA\tcommon/assets/34071295.jpg\n',
'bc80dbdb990cbf3f84d375099203bf150ff156f2\n\nM\tpy_bot/python_utils/utils/web.py\nM\tupdate_dockers.py\n',
'cbcba790c0fa7026542a4060de6ed596b46dd144\n\nM\tpy_bot/python_utils/utils/all.py\nA\tpy_bot/python_utils/utils/constants.py\nA\tpy_bot/python_utils/utils/io.py\nM\tpy_bot/python_utils/utils/os.py\nD\tpy_bot/python_utils/utils/unsorted.py\nM\tpy_bot/python_utils/utils/web.py\nM\tupdate_dockers.py\nA\tupdate_dockers.py.lprof\n'
]
'''

def process_commit(commit):
	tmp = commit.split('\n')
	'''['ce042254a2ce20233646c8f657d713d011e3e77c', '', 'M\tpy_bot/python_utils/utils/web.py', '']'''
	commit_hash = tmp[0]
	if commit_hash in commits_done: return
	edits = tmp[2:-1]
	for edit in edits:
		tmp = edit.split('\t')
		action = tmp[0][0]
		path = tmp[1]
		full_path = path.split('/')
		if len(full_path) <= 1: continue
		docker = full_path[0]
		if not docker in docker_names: continue
		remotepath = root+path
		if action == 'A' or action == 'M' or action == 'C':
			print(f'sending {path} {remotepath}')
			if docker_manager.send(path, remotepath):
				updated_dockers.append(docker)
		elif action == 'D':
			print(f'removing {remotepath}')
			if docker_manager.remove(remotepath):
				updated_dockers.append(docker)
		elif action == 'T':
			print(f'moving {path} {remotepath}')
			if docker_manager.move(path, remotepath):
				updated_dockers.append(docker)
		elif action == 'R':
			dest = tmp[2]
			full_dest = dest.split('/')
			if len(full_dest) <= 1: continue
			docker = full_dest[0]
			if not docker in docker_names: continue
			remotedest = root+dest
			print(f'renaming {remotepath} {remotedest}')
			if not docker_manager.rename(remotepath, remotedest):
				if docker_manager.send(dest, remotedest):
					updated_dockers.append(docker)
			else:
				updated_dockers.append(docker)
		else:
			print(f'ignoring {edit}')
	commits_done.append(commit_hash)

st = time.time()
for commit in commits:
	process_commit(commit)
time_to_update_dockers = time.time() - st

st = time.time()
# update dockers in which files were added / modified / created / deleted / renamed
updated_dockers = list(set(updated_dockers))
updated_dockers.delete('common')
for docker in updated_dockers:
	docker_manager.stop(docker)
	docker_manager.start(docker)
time_to_restart_dockers = time.time() - st

docker_manager.close()

with open(commits_done_file, 'w+') as f:
	for commit_hash in commits_done:
		f.write(commit_hash+'\n')

time_spent_on_ssh = docker_manager.ti.time_spent_waiting()
time_measuring_on_ssh = docker_manager.ti.time_spent_measuring()
time_total = time.time() - st_total
time_other = time_total - time_spent_on_ssh - time_measuring_on_ssh
nb_updated_dockers = len(updated_dockers)
print(	f"took {time_to_update_dockers}s to update dockers\n"
		f"took {time_to_restart_dockers}s to restart dockers\n\n"
		f"spent {time_spent_on_ssh}s on ssh (+{time_measuring_on_ssh}s on measuring)\n\n"
		f"spent {time_total}s total (of which {time_other}s not spent on ssh)\n\n"
		f"updated {nb_updated_dockers} dockers\n"
		f"sent {docker_manager.nb_send} files\n"
		f"removed {docker_manager.nb_remove} files\n"
		f"moved {docker_manager.nb_move} files\n"
		f"renamed {docker_manager.nb_rename} files"
		)
mydb_logs = {
	"update_dockers": math.floor(time_to_update_dockers*1000),
	"restart_dockers": math.floor(time_to_restart_dockers*1000),
	"ssh_time": math.floor(time_spent_on_ssh*1000),
	"nb_dockers_updated": nb_updated_dockers,
	"nb_files_sent": docker_manager.nb_send,
	"nb_files_removed": docker_manager.nb_remove,
	"nb_files_moved": docker_manager.nb_move,
	"nb_files_renamed": docker_manager.nb_rename
}

host = os.getenv('db_externalhost', None)
user = os.getenv('db_username', None)
password = os.getenv('db_password', None)
database = os.getenv('db_database', None)
connection = mysql.connector.connect(host=host, user=user, password=password, database=database)
cursor = connection.cursor()
query = f'INSERT INTO app_metrics (`app`, `start`, `time`, `exit`, `log`) VALUES (%s, %s, %s, %s, %s)'
 
st_total_formatted = datetime.utcfromtimestamp(st_total).strftime('%Y-%m-%d %H:%M:%S')

cursor.execute(query, ("update_dockers", st_total_formatted, math.floor(time_total*1000), 0, str(mydb_logs)))
connection.commit()
cursor.close()
connection.close()
