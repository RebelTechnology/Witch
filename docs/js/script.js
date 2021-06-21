var piano = new Nexus.Piano('#piano',{
    'size': [500,120],
    'mode': 'button',  // 'button', 'toggle', or 'impulse'
    'lowNote': 24,
    'highNote': 60
})

piano.on('change',function(v) {
    console.log(v);
    if(v.state)
	HoxtonOwl.midiClient.sendNoteOn(v.note, 100);
    else
	HoxtonOwl.midiClient.sendNoteOff(v.note, 0);
    // there's a bug in keyboard that sends out velocity up to 128
    // HoxtonOwl.midiClient.sendNoteOn(data.note, Math.min(data.on, 127));
})

var mod = new Nexus.Position('#mod',{size: [120,120], mode:'relative', y:0, maxX:0.99});
mod.on('change',function(v) {
    console.log(v);
    HoxtonOwl.midiClient.sendPb((v.x - 0.5)*8192*2);
    HoxtonOwl.midiClient.sendCc(1, v.y*127);
});

var adsr = {
    attack:  0.1,
    decay: 0.1,
    sustain: 0.9,
    release: 0.1
};

function makeEnvelope(adsr){
    return [
	{ x: 0, y: 0 },
	{ x: adsr.attack/4, y: 0.95 },
	{ x: adsr.attack/4 + adsr.decay/4, y: adsr.sustain },
	{ x: 3/4, y: adsr.sustain },
	{ x: 3/4 + adsr.release/4, y: 0 }
    ];
}

var envelope = new Nexus.Envelope('#envelope',{
    'size': [300,120],
    'noNewPoints': true,
    'points': makeEnvelope(adsr)
})

// envelope.on('change',function(v) {
    // console.log(v);
    // envelope.movePoint(0, 0, 0);
    // envelope.movePoint(1, v[1].x, 0.95);
    // envelope.movePoint(2, v[2].x, v[2].y);
    // envelope.movePoint(3, v[3].x, v[3].y);
// })

var attack = new Nexus.Slider('#attack', { value: adsr.attack, mode:'absolute', size: [20, 120] });
attack.on('change',function(v) {
    adsr.attack = v;
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AA, v*127);
    // if(adsr.attack+adsr.decay+adsr.release > 1)
    // 	decay.value = Math.max(0, 1 - (adsr.attack + adsr.release));
    // 	// adsr.decay = Math.max(0, 1 - adsr.attack - adsr.release);
    // 	// if(adsr.decay == 0)
    // 	//     adsr.release = Math.max(0, 1 - adsr.attack);
    // else
    envelope.setPoints(makeEnvelope(adsr));
})

var decay = new Nexus.Slider('#decay', { value: adsr.decay, mode:'absolute', size: [20, 120] });
decay.on('change',function(v) {
    adsr.decay = v;
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AB, v*127);
    // if(adsr.attack+adsr.decay+adsr.release > 1)
    // 	release.value = Math.max(0, 1 - (adsr.attack + adsr.decay));
    // else
    envelope.setPoints(makeEnvelope(adsr));
})

var sustain = new Nexus.Slider('#sustain', { value: adsr.sustain, mode:'absolute', size: [20, 120], max: 0.95 });
sustain.on('change',function(v) {
    adsr.sustain = v;
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AC, v*127);
    envelope.setPoints(makeEnvelope(adsr));
})

var release = new Nexus.Slider('#release', { value: adsr.release, mode:'absolute', size: [20, 120] });
release.on('change',function(v) {
    adsr.release = v;
    HoxtonOwl.midiClient.sendCc(OpenWareMidiControl.PATCH_PARAMETER_AD, v*127);
    // if(adsr.attack+adsr.decay+adsr.release > 1)
    // 	attack.value = Math.max(0, 1 - (adsr.decay + adsr.release));
    // else
    envelope.setPoints(makeEnvelope(adsr));
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

$(document).ready(function() {
    connectToOwl();
});
