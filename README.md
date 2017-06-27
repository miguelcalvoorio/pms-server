# pms-server

# Git basic commands
http://rogerdudler.github.io/git-guide/

# Git first configuration
git reset
git clean -xffd
git pull <remote repository> master

To close issues include "Close #<issue>" in the commit comment

# First installation
1. npm install

# Exectution for testing
nmp start

# Start MongoDB
./pmsdatabase

# Start MongoDB command line
mongo
db.users.remove({}) // Delete all users documents

# Considerations
1. Reconfigure in config.json database path
2. Reconfigure secret key in config.json