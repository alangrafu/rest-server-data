#!/bin/bash

ruby -rubygems dataset.rb -e development &
python dataproxy/app.py &

