/*
=====================
Setup home page
=====================
*/
$(document).ready(function () {
    if (checkBrowser())
        initPage();
});


/*
=====================
Setup page
=====================
*/
function initPage()
{
	$('#credits-box').hide();
	$('#signinDiv').hide();

	//Username and password form
	$('#playermail').focus(function(){ $(this).val('');});
	$('#playerpassword').focus(function(){ $(this).val('');});
	
	//Show/hide credits 
	$('#credits_footer').live('click', function() {
		$('#credits-box').slideToggle(100);
	});
	

	//Submit login, load
	$('#submitLogin').click(function() {

	    $.ajax({
	        type: "POST",
	        url: 'serverSide/g_login.php',
	        async: false,
	        data: 'login=1&loginType=normal&usermail=' + $('#usermail').val() + '&userpassword=' + $('#userpassword').val(),
	        success: function (data) {
	            
	            datap = JSON.parse(data);
	            
	            if (datap['success'] === 'success') {
	                $('#load').remove();
	                $('#loginInfo').remove();
	                $('.loginTable').remove();
	                $('#loadOutput').css('visibility', 'visible');
	                g_start();
	            }
	            else {
	                $('#loadOutput').css('visibility', 'visible');
	                $('#loadOutput').html('<div style="color:white; font-size:12px; font-family:cgothic;">Sorry. You must register in order to play this game.</div>');
	                setTimeout(function () { $('#loadOutput').html(''); $('#loadOutput').css('visibility', 'hidden'); }, 4000);
	            }
	        }
	    });
	});
	

	//Sign in
	$('.signin').click(function () {

	    $('#signinOutput').html('');

	    $('#loginDiv').hide(1, function () {
	        $('#signinDiv').show();
	        if(!$('#signinform').is('visible'))
	            $('#signinform').show();
	    });
	    
		$('#returnToLogin').live('click', function () {
		    $('#signinDiv').hide(1, function () {
		        $('#loginDiv').show();
		    });
		});

		$('#playerpasswordcpy').focus(function () {
		    $(this).val('');
		}).focusout(function () {
            if($(this).val() == '')
		        $(this).val('repeat password');
		}).keyup(function () {
		    $(this).prop({ 'type': 'password'});
		});

	});
	
}



/*
=====================
AJAX - New user
=====================
*/
function __signinUser()
{
	$.ajax({
		type:"POST",
		url: "serverSide/g_login.php",
		async: false,
		data: "signin=1&playernick=" + $('#playernick').val() + "&playermail=" + $('#playermail').val() + "&playerpassword=" + $('#playerpassword').val() + "&playerpasswordcpy=" + $('#playerpasswordcpy').val(),
		success: function (data) {
		    $('#signinOutput').html('');
		    data = Math.floor(data);
		    if (data == 1) {
		        $('#playerpassword').css('border', '2px solid red');
		        $('#playerpasswordcpy').css('border', '2px solid red');
		        $('#signinOutput').html('<div style="color:red; font-family:cgothic; font-size:12px;">Passwords don\'t match. Check your fields.</div>');
		    }
		    if (data == 2)
		        $('#signinOutput').html('<div style="color:red; font-family:cgothic; font-size:12px;">This user already exists.</div>');
		    if (data == 3) {
		        $('#signinOutput').html('<div style="color:green; font-family:cgothic; font-size:12px;">Thank you. Login using these credentials to start</div>');
		        $('#signinform').hide();
		    }
		    if (data == 0)
		        $('#signinOutput').html('<div style="color:red; font-family:cgothic; font-size:12px;">Invalid fields</div>');
		}
	});
	return;
}




function checkBrowser() {
    return true;
}