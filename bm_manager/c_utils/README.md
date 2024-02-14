# c_utils
C utils I like to have.
## Add to your repo
As submodule
* `git submodule add https://github.com/lakazatong/c_utils libs/c_utils`

As source
* `git clone https://github.com/lakazatong/c_utils libs/c_utils`
## Include
In your repo
* `#include "libs/c_utils/all.h"`

In the libs folder
* `#include "../c_utils/all.h"`

## Run isolated test
`make && test.exe`

You would need a way to run make on Windows. Remove the .exe extension in the Makefile for Linux.
## Update submodules
* `git submodule update --remote --merge`
## Remove the submodule
* `path=libs/c_utils && git submodule deinit -f path && rm -rf .git/modules/path && git rm -f path`

Taken from [here](https://gist.github.com/myusuf3/7f645819ded92bda6677?permalink_comment_id=3915500#gistcomment-3915500).
