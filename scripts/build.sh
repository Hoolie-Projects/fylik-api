#!/bin/bash

# Set NODE_ENV variable
export NODE_ENV='production'

# Compile the project
tsc
link-module-alias
