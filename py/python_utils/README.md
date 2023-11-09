# python_utils
Python utils I like to have.
## Add to your repo
In your repo root folder
* `git submodule add https://github.com/lakazatong/python_utils libs/python_utils`
## Import
### From files inside the libs folder
* `from python_utils.utils.all import *`
### Outside
* `import sys; sys.path.append('libs'); from python_utils.utils.all import *`
## Update your submodules
* `git submodule update --remote --merge`
## Remove a submodule
Taken from https://gist.github.com/myusuf3/7f645819ded92bda6677?permalink_comment_id=3915500#gistcomment-3915500:
* `git submodule deinit -f path/to/submodule`
* `rm -rf .git/modules/path/to/submodule`
* `git rm -f path/to/submodule`