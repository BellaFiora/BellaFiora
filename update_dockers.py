import os, sys, time
from py_bot.python_utils.utils.all import *

st_total = time.time()
st = time.time()
docker_manager = DockerManager(*read_file('.ssh').split('\n')[0:5], root_depth=5)
time_to_connect = time.time() - st
ti = TimeIt()

root = '/mnt/user/node-containers/BellaFiora/'
sent_files = []
nb_removed_files = 0
nb_moved_files = 0
commits_done = []
updated_dockers = []
st = time.time()
if os.path.exists('commits_done'):
	content = ''
	with open('commits_done', 'r') as f:
		content = f.read()
	commits_done = content.split('\n')[:-1]
ti.time += time.time() - st
ti.measured += 1

docker_names = ['private_api', 'public_api', 'bm_manager', 'js_bot', 'py_bot', 'user_manager', 'webapp']
st = time.time()
logs = os.popen('git log --name-status --oneline --no-decorate --format="///%H"').read()
ti.time += time.time() - st
ti.measured += 1
commits = logs.split('///')[1:]
# /////////////////////// WIP ///////////////////////
@profile
def process_commit(commit):
	tmp = commit.split('\n')
	commit_hash = tmp[0]
	if commit_hash in commits_done: return
	edits = tmp[2:-1]
	for edit in edits:
		tmp = edit.split('\t')
		action = tmp[0][0]
		path = tmp[1]
		full_path = path.split('/')
		if len(full_path) <= 1: return
		docker = full_path[0]
		remotepath = root+path
		if action == 'A' or action == 'M' or action == 'C':
			if path in sent_files: return
			if docker_manager.send(path, remotepath):
				ti.timeit(print, 'sent', path, remotepath)
				sent_files.append(path)
		elif action == 'D':
			if docker_manager.remove(remotepath):
				ti.timeit(print, 'removed', remotepath)
				nb_removed_files += 1
		elif action == 'T':
			if docker_manager.remove(remotepath):
				ti.timeit(print, 'removed', remotepath)
				nb_removed_files += 1
			if docker_manager.send(path, remotepath):
				ti.timeit(print, 'sent', path, remotepath)
				sent_files.append(path)
		elif action == 'R':
			dest = tmp[2]
			full_dest = dest.split('/')
			if len(full_dest) <= 1: return
			docker = full_dest[0]
			remotepath_dest = root+dest
			if docker_manager.exists(remotepath) and docker_manager.move(remotepath, remotepath_dest):
				ti.timeit(print, 'moved', remotepath, remotepath_dest)
				nb_moved_files += 1
			elif not dest in sent_files and docker_manager.send(dest, remotepath_dest):
				ti.timeit(print, 'sent', dest, remotepath_dest)
				sent_files.append(dest)
		else:
			ti.timeit(print, f'ignoring {edit}')
			return
		updated_dockers.append(docker)
	commits_done.append(commit_hash)
st = time.time()
for commit in commits:
	process_commit(commit)
nb_sent_files = len(sent_files)
time_to_update_dockers = time.time() - st

st = time.time()
# update dockers in which files were added / deleted / modified
# updated_dockers = list(set(updated_dockers))
# for docker in updated_dockers:
# 	docker_manager.stop(docker)
# 	docker_manager.start(docker)
time_to_restart_dockers = time.time() - st

st = time.time()
with open('commits_done', 'w+') as f:
	for commit_hash in commits_done:
		f.write(commit_hash+'\n')
ti.time += time.time() - st
ti.measured += 1

docker_manager.close()
time_spent_on_io = ti.time_spent_waiting()
time_measuring_on_io = ti.time_spent_measuring()
time_spent_on_ssh = docker_manager.ti.time_spent_waiting()
time_measuring_on_ssh = docker_manager.ti.time_spent_measuring()
time_total = time.time() - st_total
time_other = time_total - time_spent_on_io - time_measuring_on_io - time_spent_on_ssh - time_measuring_on_ssh
print(	f"took {time_to_connect}s to connect\n"
		f"took {time_to_update_dockers}s to update dockers\n"
		f"took {time_to_restart_dockers}s to restart dockers\n\n"
		f"spent {time_spent_on_io}s on io (+{time_measuring_on_io}s on measuring)\n"
		f"spent {time_spent_on_ssh}s on ssh (+{time_measuring_on_ssh}s on measuring)\n\n"
		f"spent {time_total}s total (of which {time_other}s not spent on io or ssh)\n\n"
		f"sent {nb_sent_files} files\n"
		f"removed {nb_removed_files} files\n"
		f"moved {nb_moved_files} files")
