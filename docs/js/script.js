var piano = new Nexus.Piano('#piano',{
    size: [500,120],
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

var attack = new Nexus.Slider('#attack', { mode:'absolute', size: [120, 20] });
attack.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AA, v*127);
    envADSR.setAttackRate(v*200); drawADSR();
})

var decay = new Nexus.Slider('#decay', { mode:'absolute', size: [120, 20] });
decay.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AB, v*127);
    envADSR.setDecayRate(v*200); drawADSR();
})

var sustain = new Nexus.Slider('#sustain', { mode:'absolute', size: [120, 20] });
sustain.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AC, v*127);
    envADSR.setSustainLevel(v); drawADSR();
})

var release = new Nexus.Slider('#release', { mode:'absolute', size: [120, 20] });
release.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AD, v*127);
    envADSR.setReleaseRate(v*200); drawADSR();
})

var ratioA = new Nexus.Slider('#ratioASlider', { mode:'absolute', size: [120, 20] });
ratioA.on('change',function(v) {
    // HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_??, v*127);
    envADSR.setTargetRatioA(0.001 * (Math.exp(12.0*v)-1.0)); drawADSR();
})

var ratioDR = new Nexus.Slider('#ratioDRSlider', { mode:'absolute', size: [120, 20] });
ratioDR.on('change',function(v) {
    // HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_??, v*127);
    envADSR.setTargetRatioDR(0.001 * (Math.exp(12.0*v)-1.0)); drawADSR();
})

var slider1 = new Nexus.Slider('#slider1', { value: 0.25, mode:'absolute', size: [120, 20] });
slider1.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AE, v*127);
})

var slider2 = new Nexus.Slider('#slider2', { value: 0.25, mode:'absolute', size: [120, 20] });
slider2.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AF, v*127);
})

var slider3 = new Nexus.Slider('#slider3', { value: 0.75, mode:'absolute', size: [120, 20] });
slider3.on('change',function(v) {
    HoxtonOwl.midiClient.sendCc(7, v*127);
})

var select1 = new Nexus.Select('#select1', {size: [120, 30], options: ['Phaser', 'Delay', 'Overdrive','Chorus']})
select1.on('change', function(v) {
    var value = Math.floor((v.index+0.5)*127/4);
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AG, value);
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
    Flotr.draw(document.getElementById('container20130623'), [ envPlot ], { colors: ['#22bbbb'], xaxis: { ticks: [] }, yaxis: { max: 1.0, min: 0, ticks: []} });
}


$(document).ready(function() {
    connectToOwl();

    envADSR = new ADSR;
    attack.value = 0.1;
    decay.value = 0.1;
    sustain.value = 0.9;
    release.value = 0.1;
    ratioA.value = 1;
    ratioDR.value = 1;

});
