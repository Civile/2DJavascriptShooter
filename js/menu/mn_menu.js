


//Const
var LOADGAME = 'loadgame';
var SETTINGS = 'settings';
var LOGOUT = 'logout';
var RANKS = 'ranks'
var CREDITS = 'credits';
var HELP = 'help';
var LOGOUT = 'logout';
var MENU_GAME = '#menu_game';

var RANKS_PAD = '#ranks_pad';
var SETTINGS_PAD = '#settings_pad';
var HELP_PAD = '#help_pad';
var CREDITS_PAD = '#credits_pad';
var LOADGAME_PAD = '#loadgame_pad';
var ACCOUNT_PAD = '#account_pad';

function __mainMenu()
{

    this.isOpened = false;
	this.lastOpen = null;
	this.menuIsActive = true;
	this.loading = false;


	/*
	==========================================
	Check if is open
	==========================================
	*/
	this.isOpen = function ()
	{
		return $(MENU_GAME)[0];
	}




	/*
	==========================================
	Close main menu
	==========================================
	*/
	this.close = function ()
	{
		m_pauseGame(false, 'play');

		if (this.isOpen(SETTINGS_PAD))
			$(SETTINGS_PAD).remove();

		$(MENU_GAME).fadeOut('fast', function () {
			$(this).remove();
		});

		//ADD: unbind di tutti gli ascoltatori
		
		$(MENU_GAME + ' .button').unbind('click');
		this.isOpened = false;
		this.togglePads();
		this.lastOpen = null;
	}




	/*
	==========================================
	Load main menu
	==========================================
	*/
	this.load = function (anim)
	{
	    
		if (!this.isOpened)
		{
		    this.isOpened = true;
			if(game.playing)
				m_pauseGame(false, 'pause');
			if (!anim)
				$('#window').append('<div id="' + MENU_GAME.replace("#", "") + '">\
					<div class="menu_game title">Menu</div>\
					<div class="menu_game button" id="' + LOADGAME + '">Load game \\ Survival</div>\
					<div class="menu_game button" id="' + RANKS + '">Ranks</div>\
					<div class="menu_game button" id="' + SETTINGS + '">Settings</div>\
					<div class="menu_game button" id="' + CREDITS + '">Credits and GUIDE</div>\
					<div class="menu_game logo" id=""><img src="src/page/game_logo.png"></img></div>\
				</div>');
			else {
				if (anim == 'left')
					$('#window').append('<div id="' + MENU_GAME.replace("#", "") + '">\
					<div class="menu_game title">Menu</div>\
					<div class="menu_game button" id="' + LOADGAME + '">Load game \\ Survival</div>\
					<div class="menu_game button" id="' + RANKS + '">Ranks</div>\
					<div class="menu_game button" id="' + SETTINGS + '">Settings</div>\
					<div class="menu_game button" id="' + CREDITS + '">Credits and GUIDE</div>\
					<div class="menu_game logo" id=""><img src="src/page/game_logo.png"></img></div>\
				</div>');
				$('#' + MENU_GAME.replace("#", "")).hide().show({
					duration: 800,
					easing:'left'
				});
			}
            
			this.appendListener();
		}
		else
			this.close();
		keyEsc = false;
	}





	/*
	==========================================
	Main listener
	==========================================
	*/
	this.appendListener = function ()
	{        
		self = this;
		
		$(MENU_GAME + ' .button').click(function () {

			op = $(this).attr('id');
			if (self.loading)
				return;

			s_loadSoundHandler('M_MENU_CLICK');
			
			if (op == LOADGAME) {
				if (self.lastOpen != LOADGAME || self.lastOpen == null) {
					self.togglePads(self.callLoadPad());
					$('#' + LOADGAME).addClass('button_active');
					self.lastOpen = LOADGAME_PAD;
				}
			}
			else if (op == SETTINGS) {
				if (self.lastOpen != SETTINGS_PAD || self.lastOpen == null) {
					$('#' + SETTINGS).addClass('button_active');
					self.togglePads(self.loadSettings());
					self.lastOpen = SETTINGS_PAD;
				}
			}
			else if (op == HELP) {
				if (self.lastOpen != HELP_PAD || self.lastOpen == null) {
					$('#' + HELP).addClass('button_active');
					self.togglePads(self.callHelpPad());
					self.lastOpen = HELP_PAD;
				}
			}
			else if (op == LOGOUT) {
				if (self.lastOpen != LOGOUT || self.lastOpen == null) {
					$('#' + LOGOUT).addClass('button_active');
					self.togglePads();
					self.lastOpen = LOGOUT;
				}
			}
			else if (op == CREDITS) {
				if (self.lastOpen != CREDITS_PAD || self.lastOpen == null) {
					$('#' + CREDITS).addClass('button_active');
					self.togglePads(self.creditsPad());
					self.lastOpen = CREDITS_PAD;
				}
			}
			else if (op == RANKS) {
				if (self.lastOpen != RANKS_PAD || self.lastOpen == null) {
					$('#' + RANKS).addClass('button_active');
					self.togglePads(self.ranksPad());
					self.lastOpen = RANKS_PAD;
				}
			}
		});
	}




	/*
	==========================================
	Show/hide inactive pads
	==========================================
	*/
	this.togglePads = function (callback)
	{
		var self = this;
		var lastPadId = this.lastOpen;
		if ( !this.lastOpen )
			return;

		$((lastPadId[0] != '#' ? '#' : '' ) + '' + (lastPadId.replace("_pad", ""))).removeClass('button_active').addClass('button');
		$(lastPadId).animate(
			 { right: '-400px' },
			 40,
			 function () {
				 $(lastPadId).remove();
				 self.menuIsActive = true;
				 if (callback)
					 callback();
			 });


	}






	/*
	==========================================
	SETTINGS
	==========================================
	*/
	this.loadSettings = function ()
	{
		self = this;
		this.loading = true;
		
		$(MENU_GAME).animate({ right: '420px' }, 500, function ()
		{   
			$(WINDOW_WND).append('<div id="' + SETTINGS_PAD.replace("#", "") + '">\
			<h1>Video</h1>\
				\
				<div class="section">\
					\
					<div>\
						<div style="float:right;"><input type="checkbox" id="set_smoke" style="margin-top:0px; float:right;" ' + (rSettings.renderSmoke == true ? "checked" : null) + '></div>\
						<div class="title">Enable smoke</div>\
						<div class="description"><a>Enable smoke sprites (may decrease the efficiency)</a></div>\
						 <div class="cl"></div>\
						<div style="float:right;">\
						<select id="resolution" style="width:100px;">\
							<option id="990x430" ' + ($(WINDOW_WND).width() == '790' ? 'selected' : null) + '>790x430</option>\
							<option id="990x430" '+ ($(WINDOW_WND).width() == '990' ? 'selected' : null) +'>990x430</option>\
							<option id="1240x730" '+ ($(WINDOW_WND).width() == '1240' ? 'selected' : null) + '>1240x430</option>\
						 </select>\
						</div>\
						<div class="title">Resolution</div>\
						<div class="description"><a>Modify window resolution</a></div>\
					</div>\
			</div>\
			<h1>Audio</h1>\
						<div class="section">\
							<div>\
								<div style="float:right;"><div id="sound-volume"></div></div>\
								<div class="title">Sound volume</div>\
								<div class="description">Handle game\'s sounds</div>\
								<div class="cl"></div>\
								<div style="float:right;"><div id="music-volume"></div></div>\
								<div class="title">Music volume</div>\
								<div class="description">Handle soundtrack\'s volume</div>\
						</div>\
			</div>');

			$(SETTINGS_PAD).animate({
				opacity: 0.8
			}, 100);
			setTimeout(function () { self.loading = false; }, 1000);
			self.settingsAppendListener();
		});
	}





	/*
	==========================================
	SETTINGS LISTENER
	==========================================
	*/
	this.settingsAppendListener = function ()
	{
		//AUDIO
		$("#sound-volume").slider({
			value: sSettings.sound_volume,
			min: 0,
			max: 1,
			step: 0.01,
			slide: function (event, ui) {
				sSettings.sound_volume = ui.value;
			}
		});
		$("#music-volume").slider({
			value: s_stGetVolume(),
			min: 0,
			max: 1,
			step: 0.01,
			slide: function (event, ui) {
				s_stSetVolume(ui.value);
			}
		});
		$('.ui-slider-handle').width(10);


		//VIDEO
		//Enable\disable smoke's sprite rendering
		$('#set_smoke').change(function () {
			if ($(this).attr('checked')) {
				rSettings.renderSmoke = true;
			}
			else
				rSettings.renderSmoke = false;
		});

		//Resolution
		$('#resolution').change(function () {
			var option = '';
			option += $('#resolution :selected').text();
			switch (option) {
				case '1240x430':
					$(WINDOW_WND).width('1240px');
					$(WINDOW_WND).height('430px');
					break;
				case '990x430':
					$(WINDOW_WND).width('990px');
					$(WINDOW_WND).height('430px');
					break;
				case '790x430':
					$(WINDOW_WND).width('790px');
					$(WINDOW_WND).height('430px');
					break;
			}
		   
			camera.update();
		});

	}









	/*
	==========================================
	HELP
	==========================================
	*/
	this.callHelpPad = function ()
	{
		this.loading = true;

		$(MENU_GAME).animate({ right: '420px' }, 500, function ()
		{
			$(WINDOW_WND).append('\
				<div id="' + HELP_PAD.replace("#", "") + '">\
					<h1>Game instructions</h1>\
					<div class="section"></div>\
				</div>');
			
			$(HELP_PAD).animate({ opacity: 0.8 }, 200);
			setTimeout(function () { self.loading = false; }, 1000);
		});
	}




	/*
	==========================================
	LOADGAME
	==========================================
	*/
	this.callLoadPad = function () {

		var output = new String();
		this.loading = true;

		$('#' + LOADGAME).html('Load game \\ Survival&nbsp; <img src="src/page/ajax-loader.gif">');

	    //Open pad
		$(MENU_GAME).animate({ right: '420px' }, 500, function () {
		    $(WINDOW_WND).append('\
						<div id="' + LOADGAME_PAD.replace("#", "") + '">\
						<h1>Survival mode</h1>\
						<div class="section">\
							<div class="title">Fight until you die and collect points, weapons and ammos to join the rank list<br/></div>\
							<div class="thumb"><img id="S1" src="src/maps/thumbs/mthumb_s1.png" gType="'+ SURVIVAL + '" title="Stairs of death"/></div>\
						</div>\
					</div>');

		    $(LOADGAME_PAD).animate({ opacity: 0.8 }, 200);
		    self.loadGameListener();
		    $('#' + LOADGAME).html('Load game \\ Survival');
		});

		setTimeout(function () { self.loading = false; }, 1000);


		

		
	}


	this.loadGameListener = function () {

		var self = this;

		$('#loadgame_pad .thumb').click(function () {

			var map = $(this).find('img').attr('id');
			var gType = $(this).find('img').attr('gType');
			if (map) {
				g_loadGame(map, gType);
				self.close();
			}
		});
	}





	/*
	==========================================
	CREDITS
	==========================================
	*/
	this.creditsPad = function ()
	{
		this.loading = true;

		$(MENU_GAME).animate({ right: '420px' }, 500, function () {
			
			$(WINDOW_WND).append('\
				<div id="' + CREDITS_PAD.replace("#", "") + '">\
					<h1>Keys</h1>\
						<div class="section">\
						<div class="title"><b>Movements</b></div>\
							<div class="info">Left -> keyLeft </div>\
							<div class="info">Right -> keyRight </div>\
							<div class="info">Jump -> keyUp </div>\
							<div class="info">Crouch -> keyDown </div>\
							<div class="info">Sprint -> shift + keyLeft or keyRight </div>\
							<div class="info">Shoot -> ctrl </div>\
							<div class="info">Rocketcamera -> C (follow a flying rocket) </div>\
							<div class="info">Inventary -> I </div>\
							<div class="info">Pause -> P </div>\
                            <div class="info">Menu -> ESC </div>\
                            <div class="info"><b>Weapons:</b></div><div class="info">1 (pistol) 2 (shotgun) 3 (machinegun) 4 (rocket) 5 (holegenerator) </div>\
					</div>\
					<h1>Credits</h1>\
					<div class="section">\
						<div class="title"><b>Coding</b></div>\
							<div class="info">Civile</div>\
							<div class="info">Davide Pagliara</div>\
							<div class="info">BlackHole particles animation by Marko &#352;valjek</div>\
							<div class="info">A special thanks goes to freesfx.co.uk</div>\
							<div class="info">Tecnologies: javascript/jquery, canvas API, css3, HTML5, php/mySQL</div>\
							<div class="info" style="display:inline-block; width:90%; border-top:1px solid white; padding:2px; margin-top:10px;">\
							<img src="src/page/civile-logo.png" />\
							<img src="src/page/logo_html5.png" height="50px" width="45px"/>\
							<img src="src/page/logo_jquery.png" height="40px" width="45px"/>\
							<img src="src/page/logo_chrome.png" height="50px" width="50px"/>\
							</div>\
					</div>\
				</div>');
			$(CREDITS_PAD).animate({ opacity: 0.8 }, 200);
			setTimeout(function () { self.loading = false; }, 1000);
		});
	}







	/*
	==========================================
	RANKS
	==========================================
	*/
	this.ranksPad = function () {

		$('#' + RANKS).html('Ranks&nbsp; <img src="src/page/ajax-loader.gif">');
		this.loading = true;

		$(MENU_GAME).animate({ right: '420px' }, 500, function () {

			$.ajax({
				type: 'POST',
				url: 'serverSide/g_ranks.php',
				data: 'getRank=1',
				success: function (data) {

					$(WINDOW_WND).append('\
					<div id="' + RANKS_PAD.replace("#", "") + '">\
						<h1>Ranks</h1>\
						<div class="section">\
							<div class="description"><a>Ranks for survival mode </a></div>'+data+'\
						</div>\
					</div>');

					$(RANKS_PAD).animate({ opacity: 0.8 }, 200);
					$('#' + RANKS).html('Ranks');
					setTimeout(function () { self.loading = false; }, 1000);
				}
			});

			
			
		});
	}

}
