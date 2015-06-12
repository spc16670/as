APP=ageascope
DEPLOY=/opt/mule-standalone-3.6.1/apps/
TARGET=./target/classes
# CREATE A TEMP FOLDER
TEMP=$TARGET/$APP
mkdir $TEMP
# UNDEPLOY
sudo rm -rf $DEPLOY/$APP-anchor.txt
# MOVE TEMP FOLDER
cd $TEMP
mkdir classes
cp -r ../strata ./classes
cp -r ../../../src/main/app/$APP.xml ./classes
cp -r ../../../src/main/app/*.properties ./classes
cp -r ../../../src/main/app/lib ./classes
cp -r ../../../src/main/resources/static ./classes


cp -r ../../../src/main/app/$APP.xml .
cp -r ../../../src/main/app/*.properties .
cp -r ../../../src/main/app/lib .
mkdir plugin-dependency-lib
mkdir META-INF
echo "mule_export_version=2.0" > ./META-INF/mule_export.properties
echo "mule_exported_projects=$APP" >> ./META-INF/mule_export.properties
# CAHNGE FILE OWNERSHIP
sudo chown -R mule:mule *
# PACK UP THE FILES 
zip -r -9 $APP.zip *
# CHANGE ZIP OWNERSHIP
sudo chown -R mule:mule $APP.zip
# DEPLOY
sudo cp $APP.zip $DEPLOY
# COME OUT
cd -
# CLEAN UP
sudo rm -rf $TEMP
