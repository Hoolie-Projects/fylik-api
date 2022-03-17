#!/bin/bash

# Set NODE_ENV variable
export NODE_ENV='development'

# Remove old sources
rm -rf dist

# Compile the project
tsc
link-module-alias

# Run the project
node dist/main
