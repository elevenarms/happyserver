

var sound = document.getElementsByTagName("audio")[0];
var currentPage = '#splash_page';
var inTransition = false;			// used to prevent multi-tap on pages
var cameraUp = false;					// tracks whether or not video is up, also prevents multi-tap on video_page
var countTime = 900; 					// length of time (ms) between each count in countdown
var photoReviewTime = 0;			// length of time (ms) user has to review the #video_page after snapshot is taken
var idleTimeoutTime = 15000;	// length of time (ms) a user can be idle for restart

// if pageChangeTime is changed, you must also change the -webkit-animation-duration for .slide_up, .slide_down, .in, and .out classes
var pageChangeTime = 900; 		// length of time for page change animations

var running = false;

// DOCUMENT.READY
//************************************************
$(document).ready(function(){
	
	
			
	setInterval(function(){
		if (running) { return false; }
		$.get('/start.json',function(result){
			if (result.start) {
				running = true;
				$('#splash_page').click();
			}
		});
	},5000);
	

	
	
	
	// IDLE TIMER
	//******************************
	// $(document).bind("idle.idleTimer", function(){
	// 	if (currentPage == '#splash_page') { return false; }
	// 	
	// 	cricketNav('#splash_page',currentPage,true); // navigation to splash 
	// 	
	// 	if ($('#video_page').hasClass('slide_up')) { 
	// 		setTimeout(closeVideo,pageChangeTime); // navigation to splash from video
	// 	}
	// });
	// 
	// $(document).bind("active.idleTimer", function(){
	// 	
	// });
	// 
	// $.idleTimer(idleTimeoutTime);
	//******************************
	// END IDLE TIMER
	
});


// NAVIGATION BEHAVIOR
//************************************************
$('#splash_page').click(function(){ // step 1: Go to Instructions
	cricketNav('#edu_page',currentPage,false); // navigation
	
	setTimeout(function(){
		$('#edu_page').click();
	},5000);
		
	setTimeout(function(){
		$('#video_page').click();
	},8000);
		
	setTimeout(function(){
		$('#photo_page').click();
		running = false;
	},20000);
	
});

$('#edu_page').click(function(){ // step 2: Go to Video
	openVideo(); // navigation
});

$('#video_page').click(function(){ // step 3: Take Photo and go to Photo page
	if (cameraUp) { return false; } // prevents taking multiple photos
	cameraUp = true;
	
	takePhoto(); // countdown, take snapshot, manipulate it, post it everywhere
	
	setTimeout(function(){
		setTimeout(closeVideo, pageChangeTime);			// slide down video
	},countTime*3+photoReviewTime);
});

$('#photo_page').click(function(){ // step 4: Back to Splash and reset
	cricketNav('#splash_page',currentPage,true);// navigation
});


function cricketNav(to,from,ifReverse) {
	if ((inTransition)||(to == from)) { return false; } // prevents multi-tap
	inTransition = true;
	
	navigation($(to),$(from),ifReverse); 
	currentPage = to;
	
	setTimeout(function(){
		inTransition = false;
	},pageChangeTime);
}

function takePhoto() {
	//$('#camera_icon').addClass('camera_icon_active'); // active state on - to become touchstart event
	
	countdown();
	
	setTimeout(function(){
		snapshot();											// capture shot from video
		sound.play();
		$('#video_overlay').show();			// show snapshot
		$('#flash').show().fadeOut(300);// flash
		count = 0;
	},countTime*3);
	
	//$('#camera_icon').removeClass('camera_icon_active'); // active state off - to become touchend event
}

function openVideo() {
	if (inTransition) { return false; } // prevents multi-tap
	inTransition = true;

	$('#video_page').removeClass('slide_down').addClass('slide_up'); // open the video
	setTimeout(function(){
		inTransition = false;
		cricketNav('#photo_page',currentPage,false); // navigation
	},pageChangeTime);
}

function closeVideo() { // animate video down
	$('#video_page').removeClass('slide_up').addClass('slide_down'); // close the video
	setTimeout(function(){// wait for animation end
		cameraUp = false; 	// tell other pages about it
		$('#video_overlay').hide();
	},pageChangeTime);
}


// POST IMAGE
//************************************************
function postImage() { // post photo around
  var toPost = imgMan2.src;
  
  $.ajax({url: "/upload",
    type: 'POST',
    data: {filename: "test", data: toPost},
    success: function(data, status, xhr) {
			// $('#photo_page').click();
			// running = false;
    }
  });
}


// VIDEO PAGE
//************************************************
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia;

var video = document.querySelector('#cricket_video');			// video element
var img = document.querySelector('#video_overlay');				// video_overlay element (for snapshot on video_page)
var imgMan1 = document.querySelector('#photo_review');		// photo_review element (for review on photo_page)
var imgMan2 = document.querySelector('#photo_post');			// photo_post element (for mobile/desktop viewing)
var canvas = document.querySelector('#cricket_canvas');		// canvas element
var canvas2 = document.querySelector('#cricket_canvas2');	// 2nd canvas element
var button = document.querySelector('#camera_button');		// iphone camera button element
var ctx = canvas.getContext('2d');												// canvas context (for saving, manipulating)
var ctx2 = canvas2.getContext('2d');											// 2nd canvas context (for saving, manipulating)
var localMediaStream = null;

var photo_overlay = new Image();
photo_overlay.src = 'img/goldOverlay1.png';
var photo_overlay2 = new Image();
photo_overlay2.src = 'img/goldOverlay2.png';

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
		canvas.width = 640;
		canvas.height = 480;
		canvas2.width = 480;
		canvas2.height = 640;
		// img.height = video.videoHeight;
		// img.width = video.videoWidth;
		// imgMan2.height = video.videoWidth;
		// imgMan2.width = video.videoHeight;
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
		//ctx.translate(0, 0);													// translate origin to bottom left corner
    ctx.drawImage(photo_overlay, 0, 0);						// draw overlay in bottom left corner
		imgMan1.src = canvas.toDataURL('image/png');	// post canvas to #photo_review

		ctx2.translate(240, 320); 										// translate origin to center
 		ctx2.rotate(3*Math.PI / 2); 									// rotate 270deg
		//ctx2.scale(1, -1);														// scale vertically for mirror image
		ctx2.translate(-320, -240);
    ctx2.drawImage(video, 0, 0);						// draw image to canvas at compensated image origin
		ctx2.globalCompositeOperation = 'source-atop';// set composite mode
    ctx2.drawImage(photo_overlay2, 0, 0);		// draw overlay in bottom left corner
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


// NAVIGATION STYLE
//************************************************
function navigationEnd(elemIn,elemOut,goingBack) { // navigation cleanup
	elemOut.removeClass('in');
	elemIn.removeClass('out');
	
	if (!goingBack) {
		elemIn.removeClass('reverse');
		elemOut.removeClass('reverse');
	}
}

function navigation(elemIn,elemOut,goingBack) {
	navigationEnd(elemIn,elemOut,goingBack);
	
	$(':focus').trigger('blur');
	
	elemIn.addClass('in');
	elemOut.addClass('out');
	
	goingBack = goingBack ? goingBack : false;

	if (goingBack) {
		elemIn.addClass('reverse');
		elemOut.addClass('reverse');
	}
	
	return true;
}
