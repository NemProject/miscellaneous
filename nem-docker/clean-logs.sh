#!/bin/bash

# delete log files older than the 9th logfile
find . -regextype posix-awk -regex '.*(servant|nis)-[[:digit:]]{2}.log' -exec rm \{\} \;
