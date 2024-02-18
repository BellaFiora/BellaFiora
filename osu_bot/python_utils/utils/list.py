class list(list):
	def get(self, element):
		for i in range(len(self)):
			if self[i] == element:
				return i
		return -1

	def delete(self, element):
		for i, e in enumerate(self):
			if e == element:
				self.pop(i)
				break
		return self

	def extract(self, element):
		for i, e in enumerate(self):
			if e == element:
				return self.pop(i)
		return None
