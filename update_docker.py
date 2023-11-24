import os, sys
from py_bot.python_utils.utils.all import *

docker_manager = DockerManager(*read_file('.ssh').split('\n')[0:5])

root = '/mnt/user/node-containers/BellaFiora/'
done_paths = []
commits_done = []
updated_dockers = []
if os.path.exists('commits_done'):
	content = ''
	with open('commits_done', 'r') as f:
		content = f.read()
	commits_done = content.split('\n')[:-1]

docker_names = ['private_api', 'public_api', 'bm_manager', 'js_bot', 'py_bot', 'user_manager', 'webapp']
logs = os.popen('git log --name-status --oneline --no-decorate --format="///%H"').read()
commits = logs.split('///')[1:]
for commit in commits:
	tmp = commit.split('\n')
	commit_hash = tmp[0]
	if commit_hash in commits_done: continue
	edits = tmp[2:-1]
	for edit in edits:
		tmp = edit.split('\t')
		action = tmp[0][0]
		path = tmp[1]
		full_path = path.split('/')
		if len(full_path) <= 1: continue
		docker = full_path[0]
		remotepath = root+path
		if action == 'A' or action == 'M' or action == 'C':
			if path in done_paths or not docker in docker_names: continue
			print('send', path, remotepath)
			docker_manager.send(path, remotepath)
			done_paths.append(path)
		elif action == 'D':
			if path in done_paths or not docker in docker_names: continue
			print('remove', remotepath)
			if docker_manager.exists(remotepath): docker_manager.remove(remotepath)
			done_paths.append(path)
		elif action == 'T':
			if path in done_paths or not docker in docker_names: continue
			print('remove', remotepath)
			if docker_manager.exists(remotepath): docker_manager.remove(remotepath)
			print('send', path, remotepath)
			docker_manager.send(path, remotepath)
			done_paths.append(path)
		elif action == 'R':
			dest = tmp[2]
			full_dest = dest.split('/')
			if len(full_dest) <= 1: continue
			docker = full_dest[0]
			if dest in done_paths or not docker in docker_names: continue
			remotepath_dest = root+dest
			if docker_manager.exists(remotepath):
				print('move', remotepath, remotepath_dest)
				docker_manager.move(remotepath, remotepath_dest)
			else:
				print('send', dest, remotepath_dest)
				docker_manager.send(dest, remotepath_dest)
			done_paths.append(dest)
		else:
			print(f'ignoring {edit}')
			continue
		updated_dockers.append(docker)
	commits_done.append(commit_hash)

# update dockers in which files were added / deleted / modified
# updated_dockers = list(set(updated_dockers))
# for docker in updated_dockers:
# 	docker_manager.stop(docker)
# 	docker_manager.start(docker)

with open('commits_done', 'w+') as f:
	for commit_hash in commits_done:
		f.write(commit_hash+'\n')

docker_manager.close()
