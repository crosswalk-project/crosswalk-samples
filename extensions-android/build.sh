#!/bin/bash

# Need to set Environment variables
# CROSSWALK_APP_TOOLS_CACHE_DIR=<path>: Keep downloaded files in this dir

# directory containing this script
PROJECT_DIR=$(cd $(dirname $0) ; pwd)

EXTENSION_SRC=$PROJECT_DIR/xwalk-echo-extension-src
APP_SRC=$PROJECT_DIR/xwalk-echo-app

# get Ivy
if [ ! -f $EXTENSION_SRC/tools/ivy-2.4.0.jar ] ; then
  echo
  echo "********* DOWNLOADING IVY..."
  echo
  wget http://www.mirrorservice.org/sites/ftp.apache.org/ant/ivy/2.4.0/apache-ivy-2.4.0-bin.zip
  mv apache-ivy-2.4.0-bin.zip $EXTENSION_SRC/tools
  cd $EXTENSION_SRC/tools
  unzip apache-ivy-2.4.0-bin.zip
  mv apache-ivy-2.4.0/ivy-2.4.0.jar .
fi

# build the extension
echo
echo "********* BUILDING EXTENSION..."
echo
cd $EXTENSION_SRC
ant

# location of latest crosswalk zip 
XWALK_ZIP=`find $CROSSWALK_APP_TOOLS_CACHE_DIR -name 'crosswalk-*.zip' |sort -r |sed -n '1p'`

# build the apks
echo
echo "********* BUILDING ANDROID APK FILES..."
cd $PROJECT_DIR
$CROSSWALK_APP_TOOLS_CACHE_DIR/crosswalk-app-tools/src/crosswalk-pkg --crosswalk=$XWALK_ZIP --platforms=android --android=$1 --targets=$2 --enable-remote-debugging $APP_SRC

