#!/bin/bash

# directory containing this script
PROJECT_DIR=$(cd $(dirname $0) ; pwd)

EXTENSION_SRC=$PROJECT_DIR/xwalk-audiofs-extension-src
APP_SRC=$PROJECT_DIR/xwalk-player

# get Ivy
if [ ! -d $EXTENSION_SRC/tools ] ; then
  mkdir $EXTENSION_SRC/tools
fi

if [ ! -f $EXTENSION_SRC/tools/ivy-2.4.0-rc1.jar ] ; then
  echo
  echo "********* DOWNLOADING IVY..."
  echo
  wget http://www.mirrorservice.org/sites/ftp.apache.org/ant/ivy/2.4.0-rc1/apache-ivy-2.4.0-rc1-bin.zip
  mv apache-ivy-2.4.0-rc1-bin.zip $EXTENSION_SRC/tools
  cd $EXTENSION_SRC/tools
  unzip apache-ivy-2.4.0-rc1-bin.zip
  mv apache-ivy-2.4.0-rc1/ivy-2.4.0-rc1.jar .
fi

# build the extension
echo
echo "********* BUILDING EXTENSION..."
echo
cd $EXTENSION_SRC
ant

# location of Crosswalk Android (downloaded during extension build)
XWALK_DIR=$EXTENSION_SRC/lib/`ls lib/ | grep 'crosswalk-'`

# build the apks
echo
echo "********* BUILDING ANDROID APK FILES..."
cd $XWALK_DIR
python make_apk.py --enable-remote-debugging --manifest=$APP_SRC/manifest.json --extensions=$EXTENSION_SRC/xwalk-audiofs-extension/

# back to where we started
cd $PROJECT_DIR

# show the location of the output apk files
echo
echo "********* APK FILES GENERATED:"
APKS=`ls $XWALK_DIR/xwalk_player*.apk`
for apk in $APKS ; do
  echo $apk
done
echo
