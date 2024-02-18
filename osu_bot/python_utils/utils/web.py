import re, os, urllib, webbrowser, paramiko, time, requests
from bs4 import BeautifulSoup
from .os import from_windows, TimeIt
from .print import cprint
from .list import *
from .constants import tmp_folder_path, python_utils_tmp_folder_path
from dotenv import load_dotenv

"""
status codes

	Informational responses (100 – 199)
	Successful responses (200 – 299)
	Redirection messages (300 – 399)
	Client error responses (400 – 499)
	Server error responses (500 – 599)

"""

# allows for indent_width with BeautifulSoup.prettify
# source : https://stackoverflow.com/a/15513483
orig_prettify = BeautifulSoup.prettify
r = re.compile(r"^(\s*)", re.MULTILINE)


def prettify(self, encoding=None, formatter="minimal", indent_width=4):
	return r.sub(r"\1" * indent_width, orig_prettify(self, encoding, formatter))


BeautifulSoup.prettify = prettify


def decode_url(url):
	return urllib.parse.unquote(url)


def encode_url(url):
	return urllib.parse.quote(url)


def status_code_text(status_code):
	return requests.status_codes._codes.get(status_code, ["Unknown"])[0]


status_code_category_color = {
	"Informational": "orange",
	"Successful": "green",
	"Redirection": "orange",
	"Client error": "red",
	"Server error": "red",
}


def status_code_category(status_code):
	if status_code >= 400:
		# error
		if status_code >= 500:
			return "Server error"
		else:
			return "Client error"
	else:
		# successful
		if status_code < 200:
			if status_code >= 100:
				return "Informational"
			else:
				return "Unknown"
		if status_code < 300:
			return "Successful"
		else:
			return "Redirection"


def har_to_json(har_headers):
	headers = {}
	for e in har_headers:
		headers[e["name"]] = e["value"]
	return headers


def build_post_data(params):
	data = ""
	for key, value in params.items():
		data += f"&{key}={value}"
	return data[1:] if data != "" else ""


def build_get_url(base_url, params):
	data = ""
	for key, value in params.items():
		data += f"&{key}={value}"
	return f"{base_url}?{data[1:]}" if data != "" else ""


def get_from_link(original_link, key):
	link = original_link
	index = link.find(key)
	if index == -1:
		return None
	end = link[index + len(key) :].find("&")


def open_url(url):
	if from_windows():
		webbrowser.open(url)
	else:
		# escape the '&' characters
		url = url.replace("&", "^&")
		os.system(f'cmd.exe /C "start {url}"')


def deconstruct_get_url(get_url):
	i = get_url.find("&")
	params = {}
	if i == -1:
		return get_url, params
	base_url = get_url[:i]
	get_url = get_url[i + 1 :]
	j = base_url.find("?")
	if j != -1:
		base_url_cpy = base_url
		base_url = base_url[:j]
		base_url_cpy = base_url_cpy[j + 1 :]
		j = base_url_cpy.find("=")
		params[base_url_cpy[:j]] = base_url_cpy[j + 1 :]
	while get_url != "":
		i = get_url.find("=")
		key = get_url[:i]
		get_url = get_url[i + 1 :]
		i = get_url.find("&")
		if i == -1:
			i = len(get_url)
		value = get_url[:i]
		get_url = get_url[i + 1 :]
		params[key] = value
	return base_url, params


def txt_headers_to_json_headers(txt, filters=[]):
	headers = {}
	lines = txt.split("\n")
	first = lines[0].split(" ")
	method, url, http = first[0].strip(), first[1].strip(), first[2].strip()
	if filters != []:
		for e in lines[1:]:
			semi_colon_index = e.find(":")
			left = e[:semi_colon_index].strip()
			if left in filters:
				headers[left] = e[semi_colon_index + 1 :].strip()
	else:
		for e in lines[1:]:
			semi_colon_index = e.find(":")
			left = e[:semi_colon_index].strip()
			headers[left] = e[semi_colon_index + 1 :].strip()
	return method, url, http, headers


def wget(
	url: str,
	output_filename: str = None,
	output_dir: str = None,
	show_progress: bool = True,
	quiet: bool = True,
	auth: tuple[str, str] = None,
	headers: dict = None,
	print_cmd: bool = False,
):
	output_opt = f'-O "{output_filename}"' if output_filename != None else ""
	progress_opt = "--show-progress" if show_progress else ""
	quiet_opt = "-q" if quiet else ""
	auth_opt = f'--user "{auth[0]}" --password "{auth[1]}"' if auth != None else ""
	header_opt = (
		" ".join([f'--header="{key}: {value}"' for key, value in headers.items()])
		if headers != None
		else ""
	)
	if from_windows():
		cmd = f'wsl wget {quiet_opt} {progress_opt} {output_opt} {auth_opt} {header_opt} "{url}"'
	else:
		cmd = f'wget {quiet_opt} {progress_opt} {output_opt} {auth_opt} {header_opt} "{url}"'
	if print_cmd:
		if header_opt != "":
			header_opt = "--header=..."
		print(
			f"wget {quiet_opt} {progress_opt} {output_opt} {auth_opt} {header_opt} {url}"
		)

	if output_dir != None:
		if os.path.exists(output_dir):
			os.system(f'cd "{output_dir}" && {cmd}')
		else:
			cprint(
				f'\ncould not wget "{url}" in "{output_dir}" because it does not exists',
				"red",
			)
			return False
	else:
		os.system(cmd)

	if output_filename == None:
		output_filename = max(os.listdir(), key=os.path.getmtime)
	full_path = (
		f"{output_dir}/{output_filename}" if output_dir != None else output_filename
	)
	if os.path.exists(full_path):
		with open(full_path, "rb") as f:
			if f.read() == b"":
				cprint(f"\nthis command:\n{cmd}\ndownloaded a file of 0 bytes", "red")
				return False
	else:
		cprint(f"\nthis command:\n{cmd}\nseemed to have failed", "red")
		return False
	return True


# class SftpManager:
# 	def __init__(self, )


class DockerManager:
	nb_get_container_id = 0
	nb_start = 0
	nb_stop = 0
	nb_pause = 0
	nb_execute = 0
	nb_mkdir = 0
	nb_rmdir = 0
	nb_send = 0
	nb_get = 0
	nb_read = 0
	nb_remove = 0
	nb_move = 0
	nb_rename = 0
	nb_stat = 0
	nb_exists = 0

	# the mapping between a container name and a container id must be set in a .env file on remote at dotenv_path
	def __init__(
		self,
		hostname,
		port,
		username,
		password,
		dotenv_path,
		root_depth=0,
		cache=True,
		safe=True,
		overwrite=True,
	):
		self.ti = TimeIt()
		self.ssh = self.ti.timeit(paramiko.SSHClient)
		self.ti.timeit(self.ssh.set_missing_host_key_policy, paramiko.AutoAddPolicy())
		self.root_depth = root_depth

		# local_cache represents if a local file was already sent
		self.local_cache = {}
		# remote_cache represents if a remote file exists
		self.remote_cache = list()

		self.set_mkdir_options(cache, safe)
		self.set_rmdir_options(cache)
		self.set_send_options(cache, safe, overwrite)
		self.set_get_options(safe, overwrite)
		self.set_remove_options(cache)
		self.set_move_options(cache)
		self.set_stat_options(cache)
		self.set_exists_options(cache)

		# init ssh
		try:
			self.ti.timeit(self.ssh.connect, hostname, port, username, password)
		except Exception as e:
			self.ssh = None
			self.sftp = None
			print(f"DockerManager: ssh failed to connect: {e}")
			return None
		# init sftp
		try:
			self.sftp = self.ti.timeit(self.ssh.open_sftp)
		except Exception as e:
			self.ssh = None
			self.sftp = None
			print(f"DockerManager: ssh sftp failed to open: {e}")
			self.ssh.close()
			return None

		if not os.path.exists(python_utils_tmp_folder_path):
			os.mkdir(python_utils_tmp_folder_path)
		tmp_dotenv_path = (
			python_utils_tmp_folder_path + "/DockerManager___init___tmp_file"
		)
		if not self._get(dotenv_path, tmp_dotenv_path):
			self.ssh.close()
			self.ssh = None
			self.sftp = None
			print(f"DockerManager: _get failed to get {dotenv_path} on remote")
			return None
		load_dotenv(dotenv_path=tmp_dotenv_path)

	# docker commands utilities

	def get_container_id(self, container_name):
		r = os.getenv(container_name, None)
		if r:
			self.nb_get_container_id += 1
		return r

	def _execute(self, command, container_name, additional_args=None):
		container_id = self.get_container_id(container_name)
		if not container_id:
			return False, None
		additional_args = additional_args or []
		tmp = " ".join(additional_args)
		stdout = None
		try:
			_, stdout, _ = self.ti.timeit(
				self.ssh.exec_command, f"docker {command} {container_id} {tmp}"
			)
		except:
			return False, none
		data = stdout.read().decode().strip()
		return True, data

	def start(self, container_name):
		r = self._execute("start", container_name)
		if r:
			self.nb_start += 1
		return r

	def stop(self, container_name):
		r = self._execute("stop", container_name)
		if r:
			self.nb_stop += 1
		return r

	def pause(self, container_name):
		r = self._execute("pause", container_name)
		if r:
			self.nb_pause += 1
		return r

	def execute(self, container_name, command, additional_args=None):
		r = self._execute("exec", container_name, [command, *additional_args])
		if r:
			self.nb_execute += 1
		return r

	# make intermediate directories

	def _make_dirs_no_cache(self, path):
		full_path = path.split("/")[1:]
		for i in range(self.root_depth, len(full_path) - 1):
			folder = "/" + "/".join(full_path[: i + 1])
			self._mkdir(folder)

	def _make_dirs_cache(self, path, cache):
		full_path = path.split("/")[1:]
		for i in range(self.root_depth, len(full_path) - 1):
			folder = "/" + "/".join(full_path[: i + 1])
			if folder in cache:
				continue
			self._mkdir(folder)
			cache.append(folder)

	# mkdir utility

	def set_mkdir_options(self, cache, safe):
		if cache:
			if safe:
				self._mkdir_with_options = self._mkdir_cache_safe
			else:
				self._mkdir_with_options = self._mkdir_cache_no_safe
		else:
			if safe:
				self._mkdir_with_options = self._mkdir_no_cache_safe
			else:
				self._mkdir_with_options = self._mkdir_no_cache_no_safe

	def _mkdir(self, remotepath):
		try:
			self.ti.timeit(self.sftp.mkdir, remotepath)
			self.nb_mkdir += 1
		except Exception as e:
			# print(f'DockerManager: mkdir: self.sftp.mkdir: {e}')
			return False
		return True

	def _mkdir_cache_safe(self, remotepath):
		self._make_dirs_cache(remotepath, self.remote_cache)
		r = self._mkdir(remotepath)
		if r and not remotepath in self.remote_cache:
			remote_cache.append(remotepath)
		return r

	def _mkdir_cache_no_safe(self, remotepath):
		r = self._mkdir(remotepath)
		if r and not remotepath in self.remote_cache:
			remote_cache.append(remotepath)
		return r

	def _mkdir_no_cache_safe(self, remotepath):
		self._make_dirs_no_cache(remotepath, self.remote_cache)
		return self._mkdir(remotepath)

	def _mkdir_no_cache_no_safe(self, remotepath):
		return self._mkdir(remotepath)

	def mkdir(self, remotepath):
		return self._mkdir_with_options(remotepath)

	# rmdir utility

	def set_rmdir_options(self, cache):
		if cache:
			self._rmdir_with_options = self._rmdir_cache
		else:
			self._rmdir_with_options = self._rmdir_no_cache

	def _rmdir(self, remotepath):
		try:
			self.ti.timeit(self.sftp.rmdir, remotepath)
			self.nb_rmdir += 1
		except Exception as e:
			# print(f'DockerManager: rmdir: self.sftp.rmdir: {e}')
			return False
		return True

	def _rmdir_cache(self, remotepath):
		self.remote_cache.delete(remotepath)
		return self._rmdir(remotepath)

	def _rmdir_no_cache(self, remotepath):
		return self._rmdir(remotepath)

	def rmdir(self, remotepath):
		return self._rmdir_with_options(remotepath)

	# send utility

	def set_send_options(self, cache, safe, overwrite):
		if cache:
			if safe:
				if overwrite:
					self._send_with_options = self._send_cache_safe_overwrite
				else:
					self._send_with_options = self._send_cache_safe_no_overwrite
			else:
				if overwrite:
					self._send_with_options = self._send_cache_no_safe_overwrite
				else:
					self._send_with_options = self._send_cache_no_safe_no_overwrite
		else:
			if safe:
				if overwrite:
					self._send_with_options = self._send_no_cache_safe_overwrite
				else:
					self._send_with_options = self._send_no_cache_safe_no_overwrite
			else:
				if overwrite:
					self._send_with_options = self._send_no_cache_no_safe_overwrite
				else:
					self._send_with_options = self._send_no_cache_no_safe_no_overwrite

	def _send(self, localpath, remotepath):
		try:
			self.ti.timeit(self.sftp.put, localpath, remotepath)
			self.nb_send += 1
		except Exception as e:
			print(f"DockerManager: _send: self.sftp.put: {e}")
			return False
		return True

	def _send_no_cache_no_safe_no_overwrite(self, localpath, remotepath):
		if self.exists(remotepath):
			return False
		return self._send(localpath, remotepath)

	def _send_no_cache_no_safe_overwrite(self, localpath, remotepath):
		return self._send(localpath, remotepath)

	def _send_no_cache_safe_no_overwrite(self, localpath, remotepath):
		if self.exists(remotepath):
			return False
		self._make_dirs_no_cache(remotepath)
		return self._send(localpath, remotepath)

	def _send_no_cache_safe_overwrite(self, localpath, remotepath):
		self._make_dirs_no_cache(remotepath)
		return self._send(localpath, remotepath)

	def _send_cache_no_safe_no_overwrite(self, localpath, remotepath):
		local_file_info = os.stat(localpath)
		if (
			localpath in self.local_cache
			and local_file_info.st_mtime == self.local_cache[localpath]
		):
			return False
		self.local_cache[localpath] = local_file_info.st_mtime
		if self.exists(remotepath):
			return False
		return self._send(localpath, remotepath)

	def _send_cache_no_safe_overwrite(self, localpath, remotepath):
		local_file_info = os.stat(localpath)
		if (
			localpath in self.local_cache
			and local_file_info.st_mtime == self.local_cache[localpath]
		):
			return False
		self.local_cache[localpath] = local_file_info.st_mtime
		return self._send(localpath, remotepath)

	def _send_cache_safe_no_overwrite(self, localpath, remotepath):
		local_file_info = os.stat(localpath)
		if (
			localpath in self.local_cache
			and local_file_info.st_mtime == self.local_cache[localpath]
		):
			return False
		self.local_cache[localpath] = local_file_info.st_mtime
		if self.exists(remotepath):
			return False
		self._make_dirs_cache(remotepath, self.remote_cache)
		return self._send(localpath, remotepath)

	def _send_cache_safe_overwrite(self, localpath, remotepath):
		local_file_info = os.stat(localpath)
		if (
			localpath in self.local_cache
			and local_file_info.st_mtime == self.local_cache[localpath]
		):
			return False
		self.local_cache[localpath] = local_file_info.st_mtime
		self._make_dirs_cache(remotepath, self.remote_cache)
		return self._send(localpath, remotepath)

	def send(self, localpath, remotepath):
		if not os.path.exists(localpath):
			return False
		if os.path.isdir(localpath):
			for root, dirs, files in os.walk(localpath):
				for name in files:
					tmp_localpath = os.path.join(localpath, name)
					tmp_remotepath = os.path.join(localpath, name)
					print(f"sending {tmp_localpath} -> {tmp_remotepath}")
					self.send(tmp_localpath, tmp_remotepath)
			return False
		return self._send_with_options(localpath, remotepath)

	# get utility

	# function names???

	def set_get_options(self, safe, overwrite):
		if safe:
			if overwrite:
				self._get_with_options = self._get_safe_overwrite
			else:
				self._get_with_options = self._get_safe_no_overwrite
		else:
			if overwrite:
				self._get_with_options = self._get_no_safe_overwrite
			else:
				self._get_with_options = self._get_no_safe_no_overwrite

	def _get(self, remotepath, localpath):
		try:
			self.ti.timeit(self.sftp.get, remotepath, localpath)
			self.nb_get += 1
		except Exception as e:
			print(f"DockerManager: _get: self.sftp.get: {e}")
			return False
		return True

	def _get_no_safe_no_overwrite(self, remotepath, localpath):
		if os.path.exists(localpath):
			return False
		return self._get(remotepath, localpath)

	def _get_no_safe_overwrite(self, remotepath, localpath):
		return self._get(remotepath, localpath)

	def _get_safe_no_overwrite(self, remotepath, localpath):
		if os.path.exists(localpath):
			return False
		self._make_dirs_no_cache(localpath)
		return self._get(remotepath, localpath)

	def _get_safe_overwrite(self, remotepath, localpath):
		self._make_dirs_no_cache(localpath)
		return self._get(remotepath, localpath)

	def get(self, remotepath, localpath):
		return self._get_with_options(remotepath, localpath)

	# read utility

	# no _read bc read is already the most basic operation that can be done
	# and I'll not create a _read just for read to return _read lol

	def read(self, remotepath, mode="r"):
		tmp_file_path = python_utils_tmp_folder_path + "/DockerManager_read_tmp_file"
		if not self._get(remotepath, tmp_file_path):
			return None
		self.nb_read += 1
		content = ""
		with open(tmp_file_path, mode) as f:
			content = f.read()
		return content

	# remove utility

	def set_remove_options(self, cache):
		if cache:
			self._remove_with_options = self._remove_cache
		else:
			self._remove_with_options = self._remove_no_cache

	def _remove(self, remotepath):
		try:
			self.ti.timeit(self.sftp.remove, remotepath)
			self.nb_remove += 1
		except Exception as e:
			# print(f'DockerManager: remove: self.sftp.remove: {e}')
			return False
		return True

	def _remove_cache(self, remotepath):
		self.remote_cache.delete(remotepath)
		return self._remove(remotepath)

	def _remove_no_cache(self, remotepath):
		return self._remove(remotepath)

	def remove(self, remotepath):
		return self._remove_with_options(remotepath)

	# move utility

	def set_move_options(self, cache):
		if cache:
			self._move_with_options = self._move_cache
		else:
			self._move_with_options = self._move_no_cache

	def _move(self, remotepath_src, remotepath_dest):
		try:
			self.ti.timeit(self.sftp.posix_rename, remotepath_src, remotepath_dest)
			self.nb_move += 1
		except Exception as e:
			# print(f'DockerManager: move: self.sftp.posix_rename: {e}')
			return False
		return True

	def _move_no_cache(self, remotepath_src, remotepath_dest):
		return self._move(remotepath_src, remotepath_dest)

	def _move_cache(self, remotepath_src, remotepath_dest):
		r = self._move(remotepath_src, remotepath_dest)
		if r:
			self.remote_cache.delete(remotepath_src)
			if not remotepath_dest in self.remote_cache:
				self.remote_cache.append(remotepath_dest)
		return r

	def move(self, remotepath_src, remotepath_dest):
		return self._move_with_options(remotepath_src, remotepath_dest)

	# rename utility

	# no _rename, same reason as read

	def rename(self, remotepath_src, remotepath_dest):
		try:
			self.ti.timeit(self.sftp.posix_rename, remotepath_src, remotepath_dest)
			self.nb_rename += 1
		except Exception as e:
			# print(f'DockerManager: move: self.sftp.posix_rename: {e}')
			return False
		return True

	# stat utility

	def set_stat_options(self, cache):
		if cache:
			self._stat_with_options = self._stat_cache
		else:
			self._stat_with_options = self._stat_no_cache

	def _stat(self, remotepath):
		r = None
		try:
			r = self.ti.timeit(self.sftp.stat, remotepath)
			self.nb_stat += 1
		except Exception as e:
			# print(f'DockerManager: stat: self.sftp.stat: {e}')
			return None
		return r

	def _stat_no_cache(self, remotepath):
		return self._stat(remotepath)

	def _stat_cache(self, remotepath):
		r = self._stat(remotepath)
		if not r:
			self.remote_cache.delete(remotepath)
		elif not remotepath in self.remote_cache:
			self.remote_cache.append(remotepath)
		return r

	def stat(self, remotepath):
		return self._stat_with_options(remotepath)

	# exists utility

	def set_exists_options(self, cache):
		if cache:
			self._exists_with_options = self._exists_cache
		else:
			self._exists_with_options = self._exists_no_cache

	def _exists(self, remotepath):
		try:
			self.ti.timeit(self.sftp.stat, remotepath)
			self.nb_exists += 1
		except Exception as e:
			# print(f'DockerManager: exists: self.sftp.stat: {e}')
			return False
		return True

	def _exists_no_cache(self, remotepath):
		return self._exists(remotepath)

	def _exists_cache(self, remotepath):
		r = self._exists(remotepath)
		if r and not remotepath in self.remote_cache:
			self.remote_cache.append(remotepath)
		return r

	def exists(self, remotepath):
		return self._exists_with_options(remotepath)

	# close the DockerManager

	def close(self):
		self.ti.timeit(self.sftp.close)
		self.ti.timeit(self.ssh.close)
