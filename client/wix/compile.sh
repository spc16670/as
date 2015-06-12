echo 'Make sure the GUIDs of the components are changed!'
echo 'Make sure the GUID of the UPGRADE_NO stays the same!'
echo 'Make sure variables are set use build the correct version of the software!'
echo '__________________________________________________________________________'

WIX_INSTALL=/cygdrive/d/Programs/Wix/bin

case "$1" in
  64) echo "64"
    $WIX_INSTALL/candle.exe -dPlatform="x64" Ageascope.wxs
    $WIX_INSTALL/light.exe Ageascope.wixobj
    ;;
  32) echo "32" 
    $WIX_INSTALL/candle.exe -dPlatform="x86" Ageascope.wxs
    $WIX_INSTALL/light.exe Ageascope.wixobj
    ;;
  *) echo 'specify platform: 64 | 32 ' ;
esac
