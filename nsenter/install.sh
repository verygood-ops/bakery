#!/bin/bash

## shameless copied from https://github.com/berresch/Docker-Enter-Demo.git
## shamelessly copied from https://github.com/jpetazzo/nsenter

curl https://www.kernel.org/pub/linux/utils/util-linux/v2.24/util-linux-2.24.tar.gz | tar -zxf-
cd util-linux-2.24
./configure --without-ncurses
make nsenter
sudo cp nsenter /usr/local/bin
cd .. && rm -rf util-linux-2.24