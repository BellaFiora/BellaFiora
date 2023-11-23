import os, sys
from py_bot.python_utils.utils.all import *

docker_manager = DockerManager(*read_file('.ssh').split('\n')[0:5])

done_paths = []
done_commits = []
updated_dockers = []
if os.path.exists('done_commits'):
	content = ''
	with open('done_commits', 'r') as f:
		content = f.read()
	done_commits = content.split('\n')[:-1]

docker_names = ['private_api', 'public_api', 'bm_manager', 'js_bot', 'py_bot', 'user_manager', 'webapp']
logs = os.popen('git log --name-status --oneline --no-decorate --format="///%H"').read()
commits = logs.split('///')[1:]
for commit in commits:
	tmp = commit.split('\n')
	commit_hash = tmp[0]
	if commit_hash in done_commits: continue
	edits = tmp[2:-1]
	for edit in edits:
		tmp = edit.split('\t')
		action = tmp[0]
		path = tmp[1]
		full_path = path.split('/')
		if len(full_path) <= 1: continue
		docker = full_path[0]
		if path in done_paths or not docker in docker_names: continue
		print(path)
		continue
		for folder in full_path[1:-1]:
			if not docker_manager.exists(folder):
				docker_manager.mkdir(folder)
		done_paths.append(path)
		if action == 'A' or action == 'M':
			docker_manager.send_file(path, path)
		elif action == 'D':
			docker_manager.remove_file(path)
		else:
			print(f'updated_dockers: Unknown action ({action})')
			continue
		updated_dockers.append(docker)
	done_commits.append(commit_hash)

# update dockers in which files were added / deleted / modified
updated_dockers = list(set(updated_dockers))
for docker in updated_dockers:
	docker_manager.stop(docker)
	docker_manager.start(docker)

with open('done_commits', 'w+') as f:
	for commit_hash in done_commits:
		f.write(commit_hash+'\n')
