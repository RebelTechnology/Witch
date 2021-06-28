var piano = new Nexus.Piano('#piano',{
    size: [480,120],
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
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AA, v*127);
    envADSR.setAttackRate(v*200); drawADSR();
})

var decay = new Nexus.Slider('#decay', { mode:'absolute', size: [240, 20] });
decay.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AB, v*127);
    envADSR.setDecayRate(v*200); drawADSR();
})

var sustain = new Nexus.Slider('#sustain', { mode:'absolute', size: [240, 20] });
sustain.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AC, v*127);
    envADSR.setSustainLevel(v); drawADSR();
})

var release = new Nexus.Slider('#release', { mode:'absolute', size: [240, 20] });
release.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AD, v*127);
    envADSR.setReleaseRate(v*200); drawADSR();
})

var ratioA = new Nexus.Slider('#ratioASlider', { mode:'absolute', size: [240, 20] });
ratioA.on('change',function(v) {
    // HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_??, v*127);
    envADSR.setTargetRatioA(0.001 * (Math.exp(12.0*v)-1.0)); drawADSR();
})

var ratioDR = new Nexus.Slider('#ratioDRSlider', { mode:'absolute', size: [240, 20] });
ratioDR.on('change',function(v) {
    // HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_??, v*127);
    envADSR.setTargetRatioDR(0.001 * (Math.exp(12.0*v)-1.0)); drawADSR();
})

var extL = new Nexus.Slider('#extL', { value: 0.25, mode:'absolute', size: [240, 20] });
extL.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AE, v*127);
})

var extR = new Nexus.Slider('#extR', { value: 0.25, mode:'absolute', size: [240, 20] });
extR.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AF, v*127);
})

var gain = new Nexus.Slider('#gain', { value: 0.75, mode:'absolute', size: [240, 20] });
gain.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(7, v*127);
})

var select1 = new Nexus.Select('#select1', {size: [240, 30], options: ['Phaser', 'Delay', 'Overdrive','Chorus']})
select1.on('change', function(v) {
    var value = Math.floor((v.index+0.5)*127/4);
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AG, value);
})


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
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_BA, v);
})

var attenuvertB = new Nexus.Dial('#attenuvertB', { max: 127, value: 97, mode:'absolute', size: [80, 80] });
attenuvertB.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_BB, v);
})

var attenuvertC = new Nexus.Dial('#attenuvertC', { max: 127, value: 97, mode:'absolute', size: [80, 80] });
attenuvertC.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_BC, v);
})

var attenuvertD = new Nexus.Dial('#attenuvertD', { max: 127, value: 97, mode:'absolute', size: [80, 80] });
attenuvertD.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_BD, v);
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

function controlChange(status, cc, value){
    var ch = parseInt(status)&0x0f;
    cc = parseInt(cc);
    console.log("received CC "+ch+":"+cc+":"+value);
    switch(cc){
    case OpenWareMidiControl.PATCH_PARAMETER_AA:
	attack.value = value/127;
	break;
    case OpenWareMidiControl.PATCH_PARAMETER_AB:
	decay.value = value/127;
	break;
    case OpenWareMidiControl.PATCH_PARAMETER_AC:
	sustain.value = value/127;
	break;
    case OpenWareMidiControl.PATCH_PARAMETER_AD:
	release.value = value/127;
	break;
    }
}

function loadPatch(name){
    var url = "patches/"+name+".syx";
    console.log("loading patch "+url);
    sendProgramFromUrl(url)
	.then(function(){ sendProgramRun(); }, function(err){ console.error(err); });			    
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


$(document).ready(function() {
    connectToOwl();

    // $('#collapse2').collapse('show');
    envADSR = new ADSR;
    attack.value = 0.2;
    decay.value = 0.2;
    sustain.value = 0.8;
    release.value = 0.2;
    ratioA.value = 1;
    ratioDR.value = 1;
    $('#collapse2').toggleClass('show');
    // document.getElementById('collapse2').hide();
    // $('#collapse2').hide();
    // $('#accordionMain .accordion-body').hide()
    
});
