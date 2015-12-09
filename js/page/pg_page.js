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
	    g_start();
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