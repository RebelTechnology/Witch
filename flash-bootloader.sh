#!/bin/bash

openocd -f openocd_f4.cfg -c "program docs/binaries/MidiBoot-Witch.bin verify reset exit 0x08000000"
