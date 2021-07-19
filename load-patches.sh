#!/bin/bash

for nm in wavetable1 wavetable2 sample1 sample2 sample3 sample4
do
    echo Storing resource $nm
    FirmwareSender -out "OWL*"  -in docs/resources/$nm.wav -name $nm.wav
    sleep 2
done

FirmwareSender -out "OWL-*" -in docs/binaries/SubTractExpression.bin -store 1
sleep 2
FirmwareSender -out "OWL-*" -in docs/binaries/VosimExpression.bin -store 2
sleep 2
FirmwareSender -out "OWL-*" -in docs/binaries/WaveBankExpression.bin -store 3
sleep 2
FirmwareSender -out "OWL-*" -in docs/binaries/QuadSamplerExpression.bin -store 4
sleep 2

FirmwareSender -out "OWL-*" -in docs/binaries/SubTractPerformance.bin -store 5
sleep 2
FirmwareSender -out "OWL-*" -in docs/binaries/VosimPerformance.bin -store 6
sleep 2
FirmwareSender -out "OWL-*" -in docs/binaries/WaveBankPerformance.bin -store 7
sleep 2
FirmwareSender -out "OWL-*" -in docs/binaries/QuadSamplerPerformance.bin -store 8
sleep 2
