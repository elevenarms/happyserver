

// VIDEO PAGE
//************************************************
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia;

var video = document.querySelector('#cricket_video');			// video element
var img = document.querySelector('#video_overlay');				// video_overlay element (for snapshot on video_page)
//var imgMan1 = document.querySelector('#photo_review');		// photo_review element (for review on photo_page)
//var imgMan2 = document.querySelector('#photo_post');			// photo_post element (for mobile/desktop viewing)
var canvas = document.querySelector('#cricket_canvas');		// canvas element
//var canvas2 = document.querySelector('#cricket_canvas2');	// 2nd canvas element
var button = document.querySelector('#camera_button');		// iphone camera button element
var ctx = canvas.getContext('2d');												// canvas context (for saving, manipulating)
//var ctx2 = canvas2.getContext('2d');											// 2nd canvas context (for saving, manipulating)
var localMediaStream = null;

var photo_overlay = new Image();
photo_overlay.src = 'img/cricketOverlay1.png';

var count = 0; // prevents multiple taps for video page
var image_base64 = '0';

function countdown() { // countdown
	++count;
	if (count==1){
		$('.countdown_wrapper').html('3');
		setTimeout(function() { 
			$('.countdown_wrapper').html('2');
		},countTime);
		setTimeout(function() { 
			$('.countdown_wrapper').html('1');
		},countTime*2);
		setTimeout(function() { 
			$('.countdown_wrapper').empty();
		},countTime*3);
	}
}

function sizeCanvas(){ // initializes canvas and img
	setTimeout(function(){
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		//canvas2.width = 480;
		//canvas2.height = 640;
		img.height = video.videoHeight;
		img.width = video.videoWidth;
		//imgMan2.height = video.videoWidth;
		//imgMan2.width = video.videoHeight;
	},50);
}

function snapshot() { 
  if (localMediaStream) {
		ctx.save();
		ctx2.save();
	
    ctx.drawImage(video, 0, 0);										// draw image to canvas
    img.src = canvas.toDataURL('image/png');			// post canvas to #video_overlay
		
		ctx.translate(0, 480);												// translate origin to bottom left corner
		ctx.scale(1, -1);															// scale vertically for mirror image
		ctx.drawImage(video, 0, 0, 640, 480); 				// draw image to canvas at compensated canvas origin
		ctx.globalCompositeOperation = 'source-atop';	// set composite mode
		ctx.translate(0, 0);													// translate origin to bottom left corner
    ctx.drawImage(photo_overlay, 0, 0);						// draw overlay in bottom left corner
		imgMan1.src = canvas.toDataURL('image/png');	// post canvas to #photo_review

		ctx2.translate(240, 320); 										// translate origin to center
 		ctx2.rotate(3*Math.PI / 2); 									// rotate 270deg
		ctx2.scale(1, -1);														// scale vertically for mirror image
    ctx2.drawImage(video, -320, -240);						// draw image to canvas at compensated image origin
		ctx2.globalCompositeOperation = 'source-atop';// set composite mode
    ctx2.drawImage(photo_overlay, -320, -240);		// draw overlay in bottom left corner
    imgMan2.src = canvas2.toDataURL('image/png');	// post canvas to #photo_post
		//https://developer.mozilla.org/en-US/docs/Canvas_tutorial/Using_images
		//http://creativejs.com/2012/01/day-10-drawing-rotated-images-into-canvas/
		
		postImage(); 										// post shot to other pages and to the internets
		
		ctx.restore();	// reset canvas
		ctx2.restore();	// reset canvas
  }
}

function hideSnapshot() {
	img.hide();
}

button.addEventListener('click', snapshot, false);

var onFailSoHard = function(e) {
	console.log('Reeeejected!', e);
};

navigator.getUserMedia({video: true}, function(stream) { // initializes video
 	video.src = window.URL.createObjectURL(stream);
 	localMediaStream = stream;
	sizeCanvas();
}, onFailSoHard);

