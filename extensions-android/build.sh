#!/bin/bash

# Usage:
USAGE="./build.sh -v <version> -a <arch> -m <mode>"

# directory containing this script
PROJECT_DIR=$(cd $(dirname $0) ; pwd)

EXTENSION_SRC=$PROJECT_DIR/xwalk-echo-extension-src
APP_SRC=$PROJECT_DIR/xwalk-echo-app

XWALK_VERSION="15.44.384.13"
ARCH="x86"
MODE="embedded"

while getopts v:a:m: opt
do
  case "$opt" in 
  v)  XWALK_VERSION=$OPTARG;;
  a)  ARCH=$OPTARG;;
  m)  MODE=$OPTARG;;
  *)  echo "$USAGE"
      exit 1;;
  esac
done

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

cp -r $EXTENSION_SRC/xwalk-echo-extension $APP_SRC

# 64bit support
echo $ARCH |grep "64" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  XWALK_ZIP="$CROSSWALK_APP_TOOLS_CACHE_DIR/crosswalk-${XWALK_VERSION}-64bit.zip"
else
  XWALK_ZIP="$CROSSWALK_APP_TOOLS_CACHE_DIR/crosswalk-${XWALK_VERSION}.zip"
fi

# check whether downloaded crosswalk android file exist
if [ -f $XWALK_ZIP ]; then
  XWALK_VERSION=$XWALK_ZIP
fi

# build the apks
echo
echo "********* BUILDING ANDROID APK FILES..."
cd $PROJECT_DIR
crosswalk-pkg --crosswalk=$XWALK_VERSION --platforms=android --android=$MODE --targets=$ARCH --enable-remote-debugging $APP_SRC

