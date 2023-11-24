import re, os, urllib, webbrowser, paramiko, time, requests 
from bs4 import BeautifulSoup
from .os import from_windows, TimeIt
from .print import cprint
from .list import *
from dotenv import load_dotenv
'''
status codes

	Informational responses (100 – 199)
	Successful responses (200 – 299)
	Redirection messages (300 – 399)
	Client error responses (400 – 499)
	Server error responses (500 – 599)

'''

# allows for indent_width with BeautifulSoup.prettify
# source : https://stackoverflow.com/a/15513483
orig_prettify = BeautifulSoup.prettify
r = re.compile(r'^(\s*)', re.MULTILINE)
def prettify(self, encoding=None, formatter="minimal", indent_width=4):
	return r.sub(r'\1' * indent_width, orig_prettify(self, encoding, formatter))
BeautifulSoup.prettify = prettify

def decode_url(url):
	return urllib.parse.unquote(url)

def encode_url(url):
	return urllib.parse.quote(url)

def status_code_text(status_code):
	return requests.status_codes._codes.get(status_code, ["Unknown"])[0]

status_code_category_color = {
	'Informational': 'orange',
	'Successful': 'green',
	'Redirection': 'orange',
	'Client error': 'red',
	'Server error': 'red'
}

def status_code_category(status_code):
	if status_code >= 400:
		# error
		if status_code >= 500:
			return 'Server error'
		else:
			return 'Client error'
	else:
		# successful
		if status_code < 200:
			if status_code >= 100:
				return 'Informational'
			else:
				return 'Unknown'
		if status_code < 300:
			return 'Successful'
		else:
			return 'Redirection'

def har_to_json(har_headers):
	headers = {}
	for e in har_headers:
		headers[e['name']] = e['value']
	return headers

def build_post_data(params):
	data = ''
	for key, value in params.items(): data += f'&{key}={value}'
	return data[1:] if data != '' else ''

def build_get_url(base_url, params):
	data = ''
	for key, value in params.items(): data += f'&{key}={value}'
	return f'{base_url}?{data[1:]}' if data != '' else ''

def get_from_link(original_link, key):
	link = original_link
	index = link.find(key)
	if index == -1: return None
	end = link[index+len(key):].find('&')

def open_url(url):
	if from_windows():
		webbrowser.open(url)
	else:
		# escape the '&' characters
		url = url.replace('&', '^&')
		os.system(f'cmd.exe /C "start {url}"')

def deconstruct_get_url(get_url):
	i = get_url.find('&')
	params = {}
	if i == -1:
		return get_url, params
	base_url = get_url[:i]
	get_url = get_url[i+1:]
	j = base_url.find('?')
	if j != -1:
		base_url_cpy = base_url
		base_url = base_url[:j]
		base_url_cpy = base_url_cpy[j+1:]
		j = base_url_cpy.find('=')
		params[base_url_cpy[:j]] = base_url_cpy[j+1:]
	while get_url != '':
		i = get_url.find('=')
		key = get_url[:i]
		get_url = get_url[i+1:]
		i = get_url.find('&')
		if i == -1: i = len(get_url)
		value = get_url[:i]
		get_url = get_url[i+1:]
		params[key] = value
	return base_url, params

def txt_headers_to_json_headers(txt, filters=[]):
	headers = {}
	lines = txt.split('\n')
	first = lines[0].split(' ')
	method, url, http = first[0].strip(), first[1].strip(), first[2].strip()
	if filters != []:
		for e in lines[1:]:
			semi_colon_index = e.find(':')
			left = e[:semi_colon_index].strip()
			if left in filters:
				headers[left] = e[semi_colon_index+1:].strip()
	else:
		for e in lines[1:]:
			semi_colon_index = e.find(':')
			left = e[:semi_colon_index].strip()
			headers[left] = e[semi_colon_index+1:].strip()
	return method, url, http, headers

def wget(url:str, output_filename:str=None, output_dir:str=None, show_progress:bool=True, quiet:bool=True, auth:tuple[str, str]=None, headers:dict=None, print_cmd:bool=False):
	output_opt = f'-O "{output_filename}"' if output_filename != None else ''
	progress_opt = '--show-progress' if show_progress else ''
	quiet_opt = '-q' if quiet else ''
	auth_opt = f'--user "{auth[0]}" --password "{auth[1]}"' if auth != None else ''
	header_opt = ' '.join([f'--header="{key}: {value}"' for key, value in headers.items()]) if headers != None else ''
	if from_windows():
		cmd = f'wsl wget {quiet_opt} {progress_opt} {output_opt} {auth_opt} {header_opt} "{url}"'
	else:
		cmd = f'wget {quiet_opt} {progress_opt} {output_opt} {auth_opt} {header_opt} "{url}"'
	if print_cmd:
		if header_opt != '': header_opt = '--header=...'
		print(f'wget {quiet_opt} {progress_opt} {output_opt} {auth_opt} {header_opt} {url}')
	
	if output_dir != None:
		if os.path.exists(output_dir):
			os.system(f'cd "{output_dir}" && {cmd}')
		else:
			cprint(f'\ncould not wget "{url}" in "{output_dir}" because it does not exists', 'red')
			return False
	else:
		os.system(cmd)

	if output_filename == None:
		output_filename = max(os.listdir(), key=os.path.getmtime)
	full_path = f'{output_dir}/{output_filename}' if output_dir != None else output_filename
	if os.path.exists(full_path):
		with open(full_path, 'rb') as f:
			if f.read() == b'':
				cprint(f'\nthis command:\n{cmd}\ndownloaded a file of 0 bytes', 'red')
				return False
	else:
		cprint(f'\nthis command:\n{cmd}\nseemed to have failed', 'red')
		return False
	return True

# class SftpManager:
# 	def __init__(self, )

class DockerManager:
	def __init__(self, hostname, port, username, password, dotenv_path, root_depth=0, use_cache=False):
		self.ti = TimeIt()
		self.ssh = self.ti.timeit(paramiko.SSHClient)
		self.ti.timeit(self.ssh.set_missing_host_key_policy, paramiko.AutoAddPolicy())
		self.use_cache = use_cache
		if self.use_cache:
			# local_cache represents if a local file was already sent
			self.local_cache = list()
			# remote_cache represents if a remote file exists
			self.remote_cache = list()

		# init ssh
		try:
			self.ti.timeit(self.ssh.connect, hostname, port, username, password)
		except Exception as e:
			print(f'DockerManager: ssh failed to connect: {e}')
			return None
		# init sftp
		try:
			self.sftp = self.ti.timeit(self.ssh.open_sftp)
		except Exception as e:
			print(f'DockerManager: ssh sftp failed to open: {e}')
			self.ssh.close()
			return None

		self.get(dotenv_path, '.env')
		load_dotenv(dotenv_path='.env')
		self.root_depth = root_depth

	def get_container_id(self, container_name):
		return os.getenv(container_name, None)

	def _execute(self, command, container_name, additional_args=None):
		container_id = self.get_container_id(container_name)
		if not container_id: return False, None
		additional_args = additional_args or []
		tmp = ' '.join(additional_args)
		stdout = None
		try:
			_, stdout, _ = self.ti.timeit(self.ssh.exec_command, f"docker {command} {container_id} {tmp}")
		except:
			return False, none
		data = stdout.read().decode().strip()
		return True, data
		
	def start(self, container_name):
		return self._execute('start', container_name)

	def stop(self, container_name):
		return self._execute('stop', container_name)

	def pause(self, container_name):
		return self._execute('pause', container_name)

	def execute(self, container_name, command, additional_args=None):
		return self._execute('exec', container_name, [command, *additional_args])

	@profile
	def _send(self, localpath, remotepath):
		if not os.path.exists(localpath): return False
		if not overwrite and self.exists(remotepath): return False
		if safe:
			full_path = remotepath.split('/')[1:]
			for i in range(self.root_depth, len(full_path)-1):
				folder = '/'+'/'.join(full_path[:i+1])
				self.mkdir(folder)
		try:
			self.ti.timeit(self.sftp.put, localpath, remotepath)
		except Exception as e:
			# print(f'DockerManager: send: self.sftp.put: {e}')
			return False

	@profile
	def send(self, localpath, remotepath, safe=True, overwrite=True):
		if self.use_cache:
			if localpath in self.local_cache: return False
			r = self._send(localpath, remotepath, safe, overwrite)
			self.local_cache.append(localpath)
			if not remotepath in self.remote_cache: self.remote_cache.append(remotepath)
			return r
		return self._send(localpath, remotepath, safe, overwrite)

	# /////////////////////// WIP ///////////////////////
	def _get(self, remotepath, localpath, safe, overwrite):
		if not os.path.exists(localpath): return False
		if not overwrite and self.exists(remotepath): return False
		if safe:
			full_path = remotepath.split('/')[1:]
			for i in range(self.root_depth, len(full_path)-1):
				folder = '/'+'/'.join(full_path[:i+1])
				self.mkdir(folder)
		try:
			self.ti.timeit(self.sftp.put, localpath, remotepath)
		except Exception as e:
			# print(f'DockerManager: send: self.sftp.put: {e}')
			return False

	# /////////////////////// WIP ///////////////////////
	def get(self, remotepath, localpath, safe=True, overwrite=True):
		if self.use_cache:
			if localpath in self.local_cache: return False
			r = self._send(remotepath, localpath, safe, overwrite)
			self.local_cache.append(localpath)
			if not remotepath in self.remote_cache: self.remote_cache.append(remotepath)
			return r
		return self._send(remotepath, localpath, safe, overwrite)

	def read(self, remotepath):
		f = None
		if self.use_cache:
			try:
				f = self.ti.timeit(self.sftp.file, remotepath, 'r')
			except Exception as e:
				# print(f'DockerManager: read: self.sftp.file: {e}')
				self.remote_cache.delete(remotepath)
				return None
			if not remotepath in self.remote_cache: self.remote_cache.append(remotepath)
		else:
			try:
				f = self.ti.timeit(self.sftp.file, remotepath, 'r')
			except Exception as e:
				# print(f'DockerManager: read: self.sftp.file: {e}')
				return None
		content = f.read()
		f.close()
		return content

	def remove(self, remotepath):
		try:
			self.ti.timeit(self.sftp.remove, remotepath)
		except Exception as e:
			# print(f'DockerManager: remove: self.sftp.remove: {e}')
			return False
		if self.use_cache: self.remote_cache.delete(remotepath)
		return True

	def move(self, remotepath_src, remotepath_dest):
		try:
			self.ti.timeit(self.sftp.posix_rename, remotepath_src, remotepath_dest)
		except Exception as e:
			# print(f'DockerManager: move: self.sftp.posix_rename: {e}')
			return False
		return True

	def rename(self, remotepath_src, remotepath_dest):
		return self.move(remotepath_src, remotepath_dest)

	@profile
	def mkdir(self, remotepath):
		if use_cache:
			if remotepath in self.remote_cache: return True
			try:
				self.ti.timeit(self.sftp.mkdir, remotepath)	
			except Exception as e:
				# print(f'DockerManager: mkdir: self.sftp.mkdir: {e}')
				return False
			self.remote_cache.append(remotepath)
			return True
		else:
			try:
				self.ti.timeit(self.sftp.mkdir, remotepath)	
			except Exception as e:
				# print(f'DockerManager: mkdir: self.sftp.mkdir: {e}')
				return False
			return True

	def rmdir(self, remotepath):
		try:
			self.ti.timeit(self.sftp.rmdir, remotepath)
		except Exception as e:
			# print(f'DockerManager: rmdir: self.sftp.rmdir: {e}')
			return False
		if self.use_cache: self.remote_cache.delete(remotepath)
		return True

	def exists(self, remotepath):
		if self.use_cache:
			if remotepath in self.remote_cache: return True
			try:
				self.ti.timeit(self.sftp.stat, remotepath)
			except Exception as e:
				# print(f'DockerManager: exists: self.sftp.stat: {e}')
				return False
			self.remote_cache.append(remotepath)
			return True
		else:
			try:
				self.ti.timeit(self.sftp.stat, remotepath)
			except Exception as e:
				# print(f'DockerManager: exists: self.sftp.stat: {e}')
				return False
			return True

	def stat(self, remotepath):
		r = None
		try:
			r = self.ti.timeit(self.sftp.stat, remotepath)
		except Exception as e:
			# print(f'DockerManager: stat: self.sftp.stat: {e}')
			self.remote_cache.delete(remotepath)
			return None
		if not remotepath in self.remote_cache: self.remote_cache.append(remotepath)
		return r

	def close(self):
		self.ti.timeit(self.ssh.close)
		self.ti.timeit(self.sftp.close)
		os.remove('.env')
