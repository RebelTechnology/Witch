#!/bin/bash

OWLPORT=`amidi -l|grep OWL|sed 's/.*\(hw:.*\),.*/\1/g'`
FW=docs/binaries/Witch_v22_0_0.bin

echo Connecting to $OWLPORT

# reset to bootloader
amidi -p $OWLPORT -S f07d527ef7

while true; do
    if(amidi -l|grep OWL-BOOT); then
	break
    fi
    echo -n .
done

OWLPORT=`amidi -l|grep OWL|sed 's/.*\(hw:.*\),.*/\1/g'`

FirmwareSender -in $FW -out "OWL-BOOT*" -flash `crc32 $FW` && \
amidi -p $OWLPORT -S f07d527df7
