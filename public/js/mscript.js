var validator = new FormValidator('enter_code', [{
	  name: 'digit1',   
	  rules: 'integer|greater_than[9]'
	},{
	  name: 'digit2',   
	  rules: 'integer|greater_than[9]'
	},{
	  name: 'digit3',   
	  rules: 'integer|greater_than[9]'
	},{
	  name: 'digit4',   
	  rules: 'integer|greater_than[9]'
	}], 
	function(errors, event) {
		if (errors.length > 0) {
			$('.error').show();
		}
});


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


$(document).ready(function(){
	
	$('#toTop').click();
	
	$('#page1').bind('touchstart',function(){
		//loading
		//send code
		navigation($('#page2'),$('#page1'),false);
	});
	
});

