
var cc;

var piano = new Nexus.Piano('#piano',{
    size: [480, 120],
    mode: 'button',
    lowNote: 24,
    highNote: 60
})

piano.on('change',function(v) {
    if(v.state)
	HoxtonOwl.midiClient.sendNoteOn(v.note, 100);
    else
	HoxtonOwl.midiClient.sendNoteOff(v.note, 0);
})

var mod = new Nexus.Position('#mod',{
    size: [100,120], mode:'relative', y:0, maxX:0.99});
mod.on('change',function(v) {
    console.log(v);
    HoxtonOwl.midiClient.sendPb((v.x - 0.5)*8192*2);
    HoxtonOwl.midiClient.sendCc(1, v.y*127);
});

var attack = new Nexus.Slider('#attack', { mode:'absolute', size: [240, 20] });
attack.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.ATTACK, v*127);
    envADSR.setAttackRate(v*200); drawADSR();
})

var decay = new Nexus.Slider('#decay', { mode:'absolute', size: [240, 20] });
decay.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.DECAY, v*127);
    envADSR.setDecayRate(v*200); drawADSR();
})

var sustain = new Nexus.Slider('#sustain', { mode:'absolute', size: [240, 20] });
sustain.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.SUSTAIN, v*127);
    envADSR.setSustainLevel(v); drawADSR();
})

var release = new Nexus.Slider('#release', { mode:'absolute', size: [240, 20] });
release.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.RELEASE, v*127);
    envADSR.setReleaseRate(v*200); drawADSR();
})

var ratioA = new Nexus.Slider('#ratioASlider', { mode:'absolute', size: [240, 20] });
ratioA.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.ATTACK_CURVE, v*127);
    envADSR.setTargetRatioA(0.001 * (Math.exp(12.0*v)-1.0)); drawADSR();
})

var ratioDR = new Nexus.Slider('#ratioDRSlider', { mode:'absolute', size: [240, 20] });
ratioDR.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.RELEASE_CURVE, v*127);
    envADSR.setTargetRatioDR(0.001 * (Math.exp(12.0*v)-1.0)); drawADSR();
})

var extL = new Nexus.Slider('#extL', { value: 0.25, mode:'absolute', size: [240, 20] });
extL.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.EXTL_AMOUNT, v*127);
})

var extR = new Nexus.Slider('#extR', { value: 0.25, mode:'absolute', size: [240, 20] });
extR.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.EXTR_AMOUNT, v*127);
})

var waveshape = new Nexus.Slider('#waveshape', { value: 0, mode:'absolute', size: [240, 20] });
waveshape.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.WAVESHAPE, v*127);
})

var gain = new Nexus.Slider('#gain', { value: 0.75, mode:'absolute', size: [240, 20] });
gain.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.GAIN, v*127);
})

var lfo1curve = new Nexus.Slider('#lfo1curve', { max: 127, value: 32, mode:'absolute', size: [240, 20] });
lfo1curve.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.LFO1_SHAPE, v);
})

var lfo2curve = new Nexus.Slider('#lfo2curve', { max: 127, value: 0, mode:'absolute', size: [240, 20] });
lfo2curve.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.LFO2_SHAPE, v);
})

var select1 = new Nexus.Select('#select1', {size: [240, 30], options: ['Phaser', 'Delay', 'Overdrive','Chorus']})
select1.on('change', function(v) {
    var value = Math.floor((v.index+0.5)*127/4);
    HoxtonOwl.midiClient.sendCc(cc.FX_SELECT, value);
})

var pb_range = new Nexus.Slider('#pb_range', { min: 0, max: 127, value: 2, mode:'absolute', size: [240, 20] });
pb_range.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(101, 0);
    HoxtonOwl.midiClient.sendCc(100, 0); // RPN 0 Pitch Bend Range
    HoxtonOwl.midiClient.sendCc(06, v);
})

var mod_range = new Nexus.Slider('#mod_range', { min: 0, max: 16384, value: 8192, mode:'absolute', size: [240, 20] });
mod_range.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(101, 0);
    HoxtonOwl.midiClient.sendCc(100, 5); // RPN 5 Modulation Depth Range
    HoxtonOwl.midiClient.sendCc(06, (v>>7) & 0x7f);
    HoxtonOwl.midiClient.sendCc(38, v & 0x7f);
})

var dyn_range = new Nexus.Slider('#dyn_range', { min: 0, max: 127, value: 72, mode:'absolute', size: [240, 20] });
dyn_range.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.DYNAMIC_RANGE, v);
})

function noteToFrequency(note){
    return 440 * Math.pow(2, (note - 69) / 12);
}
function frequencyToNote(freq){
    return 12 * Math.log2f(freq / 440) + 69;
}

var coarse_tune = new Nexus.Slider('#coarse_tune', { min: -64, max: 63, value: 0, step: 1, mode:'absolute', size: [240, 20] });
coarse_tune.on('change',function(value) {
    value += 64;
    HoxtonOwl.midiClient.sendCc(101, 0);
    HoxtonOwl.midiClient.sendCc(100, 2); // RPN 2 Coarse Tune
    HoxtonOwl.midiClient.sendCc(06, value);
    if(fine_tune)
	fine_tune.value = 0;
})

var coarse_tune_number = new Nexus.Number('#coarse_tune_number');
coarse_tune_number.link(coarse_tune);

var fine_tune = new Nexus.Slider('#fine_tune', { min: -100, max: 100, value: 0, step: 0.0122, mode:'absolute', size: [240, 20] });
fine_tune.on('change',function(value) {
    value = 8192 + (value * 8192) / 100;
    HoxtonOwl.midiClient.sendCc(101, 0);
    HoxtonOwl.midiClient.sendCc(100, 1); // RPN 1 Fine Tune
    HoxtonOwl.midiClient.sendCc(06, (value>>7) & 0x7f);
    HoxtonOwl.midiClient.sendCc(38, value & 0x7f);
    var hz = noteToFrequency(69 + coarse_tune.value + fine_tune.value/100);
    $("#tuning").html(hz.toPrecision(5)+" Hz");
})

var fine_tune_number = new Nexus.Number('#fine_tune_number');
fine_tune_number.link(fine_tune);     

var parameterA = new Nexus.Dial('#parameterA', { value: 0.5, mode:'absolute', size: [80, 80] });
parameterA.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_A, v*127);
})

var parameterB = new Nexus.Dial('#parameterB', { value: 0.5, mode:'absolute', size: [80, 80] });
parameterB.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_B, v*127);
})

var parameterC = new Nexus.Dial('#parameterC', { value: 0.5, mode:'absolute', size: [80, 80] });
parameterC.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_C, v*127);
})

var parameterD = new Nexus.Dial('#parameterD', { value: 0.5, mode:'absolute', size: [80, 80] });
parameterD.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_D, v*127);
})

var parameterE = new Nexus.Dial('#parameterE', { value: 0.5, mode:'absolute', size: [80, 80] });
parameterE.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_E, v*127);
})


var attenuvertA = new Nexus.Dial('#attenuvertA', { max: 127, value: 97, mode:'absolute', size: [80, 80] });
attenuvertA.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.ATTENUATE_A, v);
})

var attenuvertB = new Nexus.Dial('#attenuvertB', { max: 127, value: 97, mode:'absolute', size: [80, 80] });
attenuvertB.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.ATTENUATE_B, v);
})

var attenuvertC = new Nexus.Dial('#attenuvertC', { max: 127, value: 97, mode:'absolute', size: [80, 80] });
attenuvertC.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.ATTENUATE_C, v);
})

var attenuvertD = new Nexus.Dial('#attenuvertD', { max: 127, value: 97, mode:'absolute', size: [80, 80] });
attenuvertD.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(cc.ATTENUATE_D, v);
})

var button1 = new Nexus.Button('#button1', {mode: 'button'});
button1.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(v ? OpenWareMidiControl.PATCH_BUTTON_ON : OpenWareMidiControl.PATCH_BUTTON_OFF, 4);
})

var button2 = new Nexus.Button('#button2', {mode: 'button'});
button2.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(v ? OpenWareMidiControl.PATCH_BUTTON_ON : OpenWareMidiControl.PATCH_BUTTON_OFF, 5);
})

var button3 = new Nexus.Button('#button3', {mode: 'button'});
button3.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(v ? OpenWareMidiControl.PATCH_BUTTON_ON : OpenWareMidiControl.PATCH_BUTTON_OFF, 6);
})

var button4 = new Nexus.Button('#button4', {mode: 'button'});
button4.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(v ? OpenWareMidiControl.PATCH_BUTTON_ON : OpenWareMidiControl.PATCH_BUTTON_OFF, 7);
})

var scope = new Nexus.Oscilloscope('#scope',{
  'size': [300,150]
})
var gram = new Nexus.Spectrogram('#gram',{
  'size': [300,150]
})
var scopebutton = new Nexus.Toggle('#scopebutton',{
    'size': [20,20],
    'state': false
})
scopebutton.on('change',function(v) {
    console.log(v);
    if(v === true){
	var context = new window.AudioContext()
		var constraints = { video: false,
				    // audio: true };
			    audio: {
			  	echoCancellation: false,
			  	autoGainControl: false,
			  	noiseSuppression: false,
			  	latency: 0
			    }
			  };
	// navigator.mediaDevices.getUserMedia(constraints, function(stream) {
	navigator.getUserMedia(constraints, function(stream) {
	    var source = context.createMediaStreamSource(stream);
	    scope.connect(source);
	    gram.connect(source);
	    console.log('scope connected')
	}, function (error) {
	    console.error("getUserMedia error:", error);
	});
	context.resume();
    }else{
	scope.disconnect();
	gram.disconnect();
	console.log('scope disconnected')
    }
});

function controlChange(status, controller, value){
    var ch = parseInt(status)&0x0f;
    controller = parseInt(controller);
    console.log("received CC "+ch+":"+controller+":"+value);
    switch(controller){
    case cc.EXTL_AMOUNT:
	extL.value = value/127;
	break;
    case cc.EXTR_AMOUNT:
	extR.value = value/127;
	break;
    case cc.ATTACK:
	attack.value = value/127;
	break;
    case cc.DECAY:
	decay.value = value/127;
	break;
    case cc.SUSTAIN:
	sustain.value = value/127;
	break;
    case cc.RELEASE:
	release.value = value/127;
	break;
    case cc.ATTENUATE_A:
	attenuvertA.value = value;
	break;
    case cc.ATTENUATE_B:
	attenuvertB.value = value;
	break;
    case cc.ATTENUATE_C:
	attenuvertC.value = value;
	break;
    case cc.ATTENUATE_D:
	attenuvertD.value = value;
	break;
    case cc.WAVESHAPE:
	waveshape.value = value/127;
	break;
    case cc.LFO1_SHAPE:
	lfo1curve.value = value;
	break;
    case cc.LFO2_SHAPE:
	lfo2curve.value = value;
	break;
    case cc.FX_SELECT:
	select1.selectedIndex = Math.floor(value*4/127);
	break;
    case cc.DYNAMIC_RANGE:
	dyn_range.value = value;
	break;
    }
}

function loadPatch(name){
    var url = "patches/"+name+".syx";
    console.log("loading patch "+url);
    sendProgramFromUrl(url)
	.then(function(){ sendProgramRun(); }, function(err){ console.error(err); });			    
}

function storePatch(name, slot){
    var url = "patches/"+name+".syx";
    console.log("storing patch "+url);
    sendProgramFromUrl(url)
	.then(function(){ sendProgramStore(slot); }, function(err){ console.error(err); });			    
}

function loadResource(name, slot){
    var url = "patches/"+name+".syx";
    console.log("storing resource "+url);
    sendResourceFromUrl(url)
	.then(function(){ console.log("loaded"); }, function(err){ console.error(err); });
}

function storeResource(name, slot){
    var url = "patches/"+name+".syx";
    console.log("storing resource "+url);
    sendResourceFromUrl(url)
	.then(function(){ sendResourceSave(slot); }, function(err){ console.error(err); });
}

function setButton(bid, ison){
    HoxtonOwl.midiClient.sendCc(ison ? OpenWareMidiControl.PATCH_BUTTON_ON :
				OpenWareMidiControl.PATCH_BUTTON_OFF, bid+3);
}

function drawAllADSR() {
    envADSR.setAttackRate(attack.value*200);
    envADSR.setDecayRate(decay.value*200);
    envADSR.setSustainLevel(sustain.value);
    envADSR.setReleaseRate(release.value*200);
    envADSR.setTargetRatioA(0.001 * (Math.exp(12.0*ratioASlider.value)-1.0));
    envADSR.setTargetRatioDR(0.001 * (Math.exp(12.0*ratioDRSlider.value)-1.0));
    drawADSR();
}

function drawADSR() {
    if(!$('#adsr').is(":visible"))
	return;
    var val;
    var envPlot = [];
    envADSR.reset();
    envADSR.gate(1);
    envPlot.push([0, 0]);
    var idx;
    for (idx = 1; idx < 400; idx++)
	envPlot.push([idx, envADSR.process()]);
    envADSR.gate(0);
    for (idx = 400; idx < 600; idx++)
	envPlot.push([idx, envADSR.process()]);
    
    // plot linear
    // colours: nexus azure #22bbbb, bootstrap grey dark: #5a5c69, secondary: #858796
    var options = {
	colors: ['#858796'],
	grid: { show: false },
	xaxis: { showLabels: false },
	yaxis: { max: 1.0, min: 0, showLabels: false }
    };
    Flotr.draw(document.getElementById('adsr'), [ envPlot ], options);
}

function showPatch(pid){
    $('.multi-collapse').collapse('hide');
    if(pid == 1){
	$('#cardSubtract').collapse('show');
	$('#cardAdsr').collapse('show');
	$('#cardLfo').collapse('show');
	$('#cardFx').collapse('show');
    }else if(pid == 2){
	$('#cardVosim').collapse('show');
	$('#cardAdsr').collapse('show');
	$('#cardLfo').collapse('show');
	$('#cardFx').collapse('show');
    }else if(pid == 3){
	$('#cardWavebank').collapse('show');
	$('#cardAdsr').collapse('show');
	$('#cardLfo').collapse('show');
	$('#cardFx').collapse('show');
    }else if(pid == 4){
	$('#cardQuadsampler').collapse('show');
	$('#cardFx').collapse('show');
    }else if(pid == 0){
	$('#cardIntro').collapse('show');	
    }
}

function msb16(value){
    return ((value*8192) >> 8) & 0xff;
}

function lsb16(value){
    return (value*8192) & 0xff;
}

function storeSettings(resolve){
    var name = $('#patchname').text() + ".cfg";
    console.log("storing settings for patch "+name);
    var cfg = [
	0xb0, 7, msb16(waveshape.value), lsb16(waveshape.value),
	0xb0, 8, msb16(attack.value), lsb16(attack.value),
	0xb0, 9, msb16(decay.value), lsb16(decay.value),
	0xb0,10, msb16(sustain.value), lsb16(sustain.value),
	0xb0,11, msb16(release.value), lsb16(release.value),
	// 0xb0,12, msb16(ratioA.value), lsb16(ratioA.value),
	// 0xb0,13, msb16(ratioDR.value), lsb16(ratioDR.value),
	0xb0,14, msb16(extL.value), lsb16(extL.value),
	0xb0,15, msb16(extR.value), lsb16(extR.value),
	0x0B, 0xb0, cc.ATTENUATE_A, attenuvertA.value,
	0x0B, 0xb0, cc.ATTENUATE_B, attenuvertB.value,
	0x0B, 0xb0, cc.ATTENUATE_C, attenuvertC.value,
	0x0B, 0xb0, cc.ATTENUATE_D, attenuvertD.value,
	0x0B, 0xb0, cc.LFO1_SHAPE, lfo1curve.value,
	0x0B, 0xb0, cc.LFO2_SHAPE, lfo2curve.value,
	0x0B, 0xb0, cc.DYNAMIC_RANGE, dyn_range.value,
	0x0B, 0xb0, cc.FX_SELECT, Math.floor((select1.selectedIndex+0.5)*127/4)
	// 0xb0,16, msb16(attenuvertA.value/127), lsb16(attenuvertA.value/127),
	// 0xb0,17, msb16(attenuvertB.value/127), lsb16(attenuvertB.value/127),
	// 0xb0,18, msb16(attenuvertC.value/127), lsb16(attenuvertC.value/127),
	// 0xb0,19, msb16(attenuvertD.value/127), lsb16(attenuvertD.value/127),
	// 0xb0,20, msb16(lfo1curve.value/127), lsb16(lfo1curve.value/127),
	// 0xb0,21, msb16(lfo2curve.value/127), lsb16(lfo2curve.value/127),
    ];
    var promise = new Promise((resolve, reject) => {
	var data = new Uint8Array(cfg);
	resolve = sendDataChunks(0, packageSysexData(data), resolve);
	resolve && resolve();
    });
    promise.then(function(){
	console.log("saving resource "+name);
	sendResourceSave(name);
    }, function(err){ console.error(err); });
}

$(document).ready(function() {

    cc = {
	GAIN:                    7,
	FX_AMOUNT:               OpenWareMidiControl.PATCH_PARAMETER_E,  // 24
	WAVESHAPE:               OpenWareMidiControl.PATCH_PARAMETER_H,  // 13
	STEREO_MIX:              OpenWareMidiControl.PATCH_PARAMETER_H,  // 13
	ATTACK:                  OpenWareMidiControl.PATCH_PARAMETER_AA, // 75
	DECAY:                   OpenWareMidiControl.PATCH_PARAMETER_AB, // 76
	SUSTAIN:                 OpenWareMidiControl.PATCH_PARAMETER_AC, // 77
	RELEASE:                 OpenWareMidiControl.PATCH_PARAMETER_AD, // 78
	ATTACK_CURVE:            OpenWareMidiControl.PATCH_PARAMETER_AE, // 79
	RELEASE_CURVE:           OpenWareMidiControl.PATCH_PARAMETER_AF, // 80
	EXTL_AMOUNT:             OpenWareMidiControl.PATCH_PARAMETER_AG, // 81
	EXTR_AMOUNT:             OpenWareMidiControl.PATCH_PARAMETER_AH, // 82

	ATTENUATE_A:             OpenWareMidiControl.PATCH_PARAMETER_BA, // 83
	ATTENUATE_B:             OpenWareMidiControl.PATCH_PARAMETER_BB, // 84
	ATTENUATE_C:             OpenWareMidiControl.PATCH_PARAMETER_BC, // 85
	ATTENUATE_D:             OpenWareMidiControl.PATCH_PARAMETER_BD, // 86

	LFO1_SHAPE:              OpenWareMidiControl.PATCH_PARAMETER_BE, // 87
	LFO2_SHAPE:              OpenWareMidiControl.PATCH_PARAMETER_BF, // 88

	FX_SELECT:               OpenWareMidiControl.PATCH_PARAMETER_BG, // 89
	DYNAMIC_RANGE:           OpenWareMidiControl.PATCH_PARAMETER_BH, // 90
    };

    connectToOwl();

    // $('#collapse2').collapse('show');
    envADSR = new ADSR;
    attack.value = 0.2;
    decay.value = 0.2;
    sustain.value = 0.8;
    release.value = 0.2;
    // ratioA.value = 1;
    // ratioDR.value = 1;
    ratioA.value = 0.2;
    ratioDR.value = 0.2;
    // $('#collapse2').toggleClass('show');
    // document.getElementById('collapse2').hide();
    // $('#collapse2').hide();
    // $('#accordionMain .accordion-body').hide()
    showPatch(0);
});
