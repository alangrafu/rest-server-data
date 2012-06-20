#!/bin/bash

ruby -rubygems registerServer.rb -e development &
python dataproxy/app.py &

