/*
	Author: Stéphane Bascher
	Plugin VLC Media Player for Sarah
	
	Date: January-14-2015
	Version: 1.0: 
	Creation of the module
	
	Date: February-06-2015
	Version: 1.1
	Reverse full-screen message.
	save_mode changed to safe_mode and added in the documentation.
	
	Date: February-25-2015
	Version: 1.2
	askFor Method. Modify the position of the end() method in the AskMe
	
*/


// Global variables
var SARAH,
	 vlc,
	 db,
	 msg,
	 lang,
	 debug,
	 exec = require('child_process').exec,
	 Datastore = require('./lib/nedb'),
	 fs = require('fs');


// Init Sarah	 
exports.init = function(sarah){
  SARAH = sarah;
  vlcInit(SARAH);
}


// Init vlcPlayer	
var vlcInit = function(SARAH, callback) {
	// init global variables
	SARAH.context.vlcPlayer = {};
	// init nedb database in memory
	db = new Datastore();
	// callback if required
	if (callback) callback();
}


// Actions Sarah
exports.action = function(data, callback, config, SARAH){
	
	// ? Are you nuts ? leave back home.
	if (data.command === undefined)
		return callback({});
	
	// table of properties
	var _vlcConf = {
		filePath:  function (mode) {switch (mode || SARAH.context.vlcPlayer.vlc_search_mode) {
										case 'music_by_artist': case 'music_by_album': case 'music_by_title': return this.HTTP_musicPath();
										case 'video_by_category': case 'video_by_genre': case 'video_by_name': return this.HTTP_videoPath();
										case 'radio_by_category': case 'radio_by_genre': case 'radio_by_name': return this.HTTP_radioPath();
										case 'picture_by_category': case 'picture_by_genre': case 'picture_by_name': return this.HTTP_picturePath();
										case 'TVchannel_by_category': case 'TVchannel_by_genre': case 'TVchannel_by_name': return this.HTTP_TVchannelPath();
										}},
		path: config.modules.vlcPlayer['path'] || '',
		host: config.modules.vlcPlayer['host'] || 'locahost',
		port: config.modules.vlcPlayer['port'] || '8085',
		mode: config.modules.vlcPlayer['mode'] || 'http',
	    instance: config.modules.vlcPlayer['instance'] || 'one',
		username: config.modules.vlcPlayer['username'] || '',
		password: config.modules.vlcPlayer['password'] || 'vlcremote',
		HTTP_musicPath: function () {return get_relative_path(this.path, this.musicPath )},
		musicPath: config.modules.vlcPlayer['music_path'] || '',
		HTTP_videoPath: function () {return get_relative_path(this.path, this.videoPath )},
		videoPath: config.modules.vlcPlayer['video_path'] || '',
		picturePath: config.modules.vlcPlayer['picture_path'] || '',
		HTTP_picturePath: function () {return get_relative_path(this.path, this.picturePath )},
		radioPath: config.modules.vlcPlayer['radio_path'] || '',
		HTTP_radioPath: function () {return get_relative_path(this.path, this.radioPath )},
		TVchannelPath: config.modules.vlcPlayer['TVchannel_path'] || '',
		HTTP_TVchannelPath: function () {return get_relative_path(this.path, this.TVchannelPath )},
		autostart: config.modules.vlcPlayer['playlist_autostart'] || 'true',
		language: config.modules.vlcPlayer['language'] || 'FR_fr',
		debug: config.modules.vlcPlayer['debug'] || 'false',
		audio_type: config.modules.vlcPlayer['pl_list_music_type'] || '.xspf,.m3u,.m3u8,.html',
		video_type: config.modules.vlcPlayer['pl_list_video_type'] || '.avi',
		radio_type: config.modules.vlcPlayer['pl_list_radio_type'] || '.xspf',
		picture_type: config.modules.vlcPlayer['pl_list_picture_type'] || '.jpg',
		TVchannel_type: config.modules.vlcPlayer['pl_list_TVchannel_type'] || '.m3u',
		safe_mode: config.modules.vlcPlayer['safe_mode'] || 'true'
	};
	
	// localized messages
	lang =_vlcConf.language; // Added for cron...
	msg = require('./lib/lang/' + _vlcConf.language);
	// mode debug
	debug = _vlcConf.debug;
	if (debug == 'true') console.log(msg.localized('debug'));
	
	// table of actions
	var tblActions = {
		// Begin Search lazy actions
		search_music_by_artist: function() {setlazy('music_by_artist', _vlcConf.filePath('music_by_artist'), msg.localized('music_by_artist'))},
		search_music_by_album: function() {setlazy('music_by_album', _vlcConf.filePath('music_by_album'), msg.localized('music_by_album'))},
		search_music_by_title: function() {setlazy( 'music_by_title', _vlcConf.filePath('music_by_title'), msg.localized('music_by_title'))},
		search_video_by_category: function() {setlazy('video_by_category', _vlcConf.filePath('video_by_category'), msg.localized('video_by_category'))},
		search_video_by_genre: function() {setlazy('video_by_genre', _vlcConf.filePath('video_by_genre'), msg.localized('video_by_genre'))},
		search_video_by_name: function() {setlazy('video_by_name', _vlcConf.filePath('video_by_name'), msg.localized('video_by_name'))},
		search_radio_by_category: function() {setlazy('radio_by_category', _vlcConf.filePath('radio_by_category'), msg.localized('radio_by_category'))},
		search_radio_by_genre: function() {setlazy('radio_by_genre', _vlcConf.filePath('radio_by_genre'), msg.localized('radio_by_genre'))},
		search_radio_by_name: function() {setlazy('radio_by_name', _vlcConf.filePath('radio_by_name'), msg.localized('radio_by_name'))},		
		search_picture_by_category: function() {setlazy('picture_by_category', _vlcConf.filePath('picture_by_category'), msg.localized('picture_by_category'))},
		search_picture_by_genre: function() {setlazy('picture_by_genre', _vlcConf.filePath('picture_by_genre'), msg.localized('picture_by_genre'))},
		search_picture_by_name: function() {setlazy('picture_by_name', _vlcConf.filePath('picture_by_name'), msg.localized('picture_by_name'))},	
		search_TVchannel_by_category: function() {setlazy('TVchannel_by_category', _vlcConf.filePath('TVchannel_by_category'), msg.localized('TVchannel_by_category'))},
		search_TVchannel_by_genre: function() {setlazy('TVchannel_by_genre', _vlcConf.filePath('TVchannel_by_genre'), msg.localized('TVchannel_by_genre'))},
		search_TVchannel_by_name: function() {setlazy('TVchannel_by_name', _vlcConf.filePath('TVchannel_by_name'), msg.localized('TVchannel_by_name'))},				
		// End Search lazy actions
		// Begin Search actions
		begin: function() {first_pl_list(data.pos || 1,_vlcConf.filePath())},
		end: function() {first_pl_list(data.pos || 35,_vlcConf.filePath())},
		up: function() {first_pl_list(data.pos || 13,_vlcConf.filePath(),data.sens || 'up')},
		down: function() {first_pl_list(data.pos || 13,_vlcConf.filePath(),data.sens || 'down')},
		// End Search actions
		// Let Sarah searches alone
		random_pl_list: function() {random_pl_list(_vlcConf.filePath())},
		// Random play
		random_play: function() {	var tts = ((vlc_config_get_infos().random) ? msg.localized('random_off') : msg.localized('random_on'));
									SARAH.speak ( tts, function () {vlc.playlist.random();
																	vlc_config('set_infos', vlc_set_config_infos('random',((vlc_config_get_infos().random) ? false : true)));
									});
								},
		// Clear play lists
		empty: function() {SARAH.speak ( msg.localized('empty'), function () {vlc.playlist.empty()})},
		//play
		play: function() {SARAH.speak ( msg.localized('lecture'), function () {vlc.status.play()})},
		// Repeat
		repeat: function() { 	var tts = ((vlc_config_get_infos().repeat) ? msg.localized('repeat_off') : msg.localized('repeat_on'));
								SARAH.speak ( tts, function () { vlc.playlist.repeat();
																 vlc_config('set_infos', vlc_set_config_infos('repeat',((vlc_config_get_infos().repeat) ? false : true)));
																});
							},
		// loop					
		loop:  function() {     var tts = ((vlc_config_get_infos().loop) ? msg.localized('loop_off') : msg.localized('loop_on'));
								SARAH.speak ( tts, function () {
									vlc.playlist.loop();
									vlc_config('set_infos', vlc_set_config_infos('loop',((vlc_config_get_infos().loop) ? false : true)));
								});
							},
		// volume up from lazy		
		volumeUp:function() {   var conf = vlc_config_get_infos();
								confvol =  parseInt(((data.key) ? data.key : 25));
								if ((conf.volume + Math.ceil(confvol / 2.552)) > 110)
									SARAH.speak (msg.localized('set_volume_maxi'));
								else {
									vlc.status.volumeUp(confvol);
									confvol = Math.ceil(confvol / 2.552);
									vlc_config('set_infos', vlc_set_config_infos('volume',(((conf.volume + confvol) > 110) ? 110 : (confvol + conf.volume))));
									SARAH.speak ((vlc_config_get_infos().volume).toString());
								}
							},
		// volume down from lazy	
		volumeDown:function() { var conf = vlc_config_get_infos();
								confvol =  parseInt(((data.key) ? data.key : 25));
								vlc.status.volumeDown(confvol);
								confvol = Math.ceil(confvol / 2.552);
								vlc_config('set_infos', vlc_set_config_infos('volume',(((conf.volume - confvol) < 0) ? 0 : (conf.volume - confvol))));
								if ((conf.volume - confvol) < 0)
									SARAH.speak (msg.localized('set_volume_mini'));
								else
									SARAH.speak ((vlc_config_get_infos().volume).toString());
							  },
		// volume max
		volumeMax:function() {SARAH.speak ( msg.localized('volume_maxi'), function () { 
											vlc.status.volume(110);
											vlc_config('set_infos', vlc_set_config_infos('volume',110));
											})},
		// volume mini
		volumeMini:function() {SARAH.speak ( msg.localized('volume_mini'), function () {
											vlc.status.volume(0);
											vlc_config('set_infos', vlc_set_config_infos('volume',0));
											})},
		// volume lazy
		volume: function() {setlazyvolume(msg.localized('ready_volume'))},
		// Next pl
		next: function() { vlc.playlist.next()},
		// Previous pl
		previous: function() { vlc.playlist.previous()},
		// Stop pl
		stop: function() {SARAH.speak ( msg.localized('stop'), function () {vlc.status.stop()})},
		// Pause pl
		pause: function() {SARAH.speak ( msg.localized('pause'), function () {vlc.status.pause()})},
		// resume pl
		resume: function() {SARAH.speak ( msg.localized('reprise'), function () {vlc.status.resume()})},
		// switch play/pause
		inverse: function() {  SARAH.speak (  msg.localized('toggle'), function () {vlc.status.togglePause()});},
		// sort pl, not works
		sort: function() {	//seams not working regarding several posts on the net, 
							//maybe one day, a new version... but it should working like that.
							mode = ['id', 'name', null, 'author', null, 'random', null, 'track']
							.indexOf((data.mode).toLowerCase());
							vlc.status.sort(mode || 7)},	
		
		// Seek lazy 
		seekMode: function() {setlazyseek(msg.localized('seek_mode'))},
		// Seek up 
		seekUp: function() {switch (SARAH.context.vlcPlayer.vlc_search_mode) {
										case 'video_by_category': case 'video_by_genre': case 'video_by_name': 
										data.key *= 50;
										break;
									}; vlc.status.seekUp(data.key || 10)},
		// Seek down 
		seekDown: function() {switch (SARAH.context.vlcPlayer.vlc_search_mode) {
										case 'video_by_category': case 'video_by_genre': case 'video_by_name': 
										data.key *= 50;
										break;
									}; vlc.status.seekDown(data.key || 10)},
		// Seek down maxi
		seekDownMaxi: function() {SARAH.speak ( msg.localized('seek_maxi'), function () {vlc.status.seekDown(data.key || 2000)})},
		// full screen
		full_screen_movie: function() { 
								var tts = ((vlc_config_get_infos().fullscreen) ? msg.localized('fullscreen_off') : msg.localized('fullscreen_on'));
								SARAH.speak ( tts, function () { 
										vlc.status.fullscreen();
										vlc_config('set_infos', vlc_set_config_infos('fullscreen',((vlc_config_get_infos().fullscreen) ? false : true)));
								});
							},
		// Direct music
		set_music: function()  {set_media('music', data.key,_vlcConf.HTTP_musicPath())},
		// Direct video
		set_video: function() {set_media('video', data.key,_vlcConf.HTTP_videoPath())},
		// Direct radio
		set_radio: function() {set_media('radio', data.key,_vlcConf.HTTP_radioPath())},
		// Direct picture
		set_picture: function() {set_media('picture', data.key,_vlcConf.HTTP_picturePath())},
		// Direct TV
		set_TVchannel: function() {set_media('TVchannel', data.key,_vlcConf.HTTP_TVchannelPath())},
		// start vlc
		start_vlc: function() {if (SARAH.context.vlcPlayer.vlcExeChild) 
								return SARAH.speak (msg.localized('vlc_already_started'));
								start_vlc_load_nedb (_vlcConf);
							  },
		// auto start off conf
		auto_start_off: function() { SARAH.speak (msg.localized('auto_start_off'), function () {config.modules.vlcPlayer.playlist_autostart = "false"})},
		// auto start on conf
		auto_start_on: function() { SARAH.speak (msg.localized('auto_start_on'), function () {config.modules.vlcPlayer.playlist_autostart = "true"})},
		// http mode conf
		vlc_http_mode: function() { SARAH.speak (msg.localized('http_mode'), function () {config.modules.vlcPlayer.mode = "http"})},
		// normal mode conf
		vlc_normal_mode: function() { SARAH.speak (msg.localized('normal_mode'), function () {config.modules.vlcPlayer.mode = "normal"})},
		// set lazy conf
		config_mode: function() {setlazyconfig(msg.localized('config_mode'))},
		// Save config in sarah.prop
		config_save: function() {SARAH.speak (msg.localized('config_save'), function () {SARAH.ConfigManager.save()})},
		// conf not saved
		config_not_save: function() {SARAH.speak (msg.localized('config_not_save'))},
		// status conf
		config_status: function() {config_status(config.modules.vlcPlayer)},
		// stop vlc
		stop_vlc: function() { SARAH.speak (msg.localized('vlc_stop'), function () { stop_vlc(function (err) {
									switch (err) {
										case true: SARAH.speak ( msg.localized('vlc_stop_error')); break;
										default: SARAH.speak ( msg.localized('vlc_stopped'), function() {vlcInit(SARAH)}); break;
								}
								});})},
		// pl replay json
		pl_replay: function() { pl_last_replay()},
		// Restart vlc
		stop_start_vlc: function() { SARAH.speak ( msg.localized('vlc_stop_start'), function ()  {
										stop_vlc(function (err) {
											switch (err) {
												case true: 	SARAH.speak ( msg.localized('vlc_stop_error')); 
															break;
												default: 	SARAH.speak ( msg.localized('vlc_stopped'), function() {
																vlcInit(SARAH, function () { 
																	start_vlc_load_nedb (_vlcConf);
																});
															}); 
															break;
											}
											}); 
									})}
	};
	
	if (debug == 'true') console.log("data.command: " + data.command);
	
	if (!SARAH.context.vlcPlayer.vlcExeChild && data.config != 'true')
		// Load VLC and nedb if not started
		start_vlc_load_nedb (_vlcConf, function () {
			if (db) {
				db.count({}, function (err, count) {
					if (count == 0) 
						return SARAH.speak ( msg.err_localized('no_playlists_in_db'));	
					
					if (!vlc) 
							vlc = require('./lib/vlc-node/vlc-node')({	username:_vlcConf.username, 
																		password: _vlcConf.password, 
																		host: _vlcConf.host, 
																		port: _vlcConf.port});
					
					// Init the saved mode Json profile only if required "safe_mode" property
					if (_vlcConf.safe_mode)
						init_vlc_mode();
					
					// let's do it but not for 'start vlc', it's already done just before
					if ((data.command != 'start_vlc') && (data.command != 'stop_start_vlc'))
						tblActions[data.command]();
				});
			} else
				return SARAH.speak ( msg.localized('lost_playlists'));
		});
	else  // let's do it
		tblActions[data.command]();
	
	// return fucking callback
	callback({});
}


/*
Method init_vlc_mode
Init VLC with the saved configuration
*/
var init_vlc_mode = function () {
	
	//set vlc mode
	var vlc_conf = vlc_config_get_infos();	
	vlc.status.volume(vlc_conf.volume);
	if (vlc_conf.fullscreen) vlc.status.fullscreen();
	if (vlc_conf.repeat) vlc.playlist.repeat();
	if (vlc_conf.loop) vlc.playlist.loop();
	if (vlc_conf.random) vlc.playlist.random();
	
}



/*
Method pl_last
Retrieve or save the last playlist played.
Save in a Json file.

@param:
action: action called in the _json table
pl_list: The pl_list to save
*/
var pl_last = function (action, pl_list) {
	
	var _json = {
		 file:  function () {return __dirname + '/pl_infos.json'},
		 get_infos: function () {try { var json = JSON.parse(fs.readFileSync(this.file(),'utf8')) } catch (err) {return} return json},
		 set_infos: function () {fs.writeFileSync(this.file(), JSON.stringify(pl_list), 'utf8')}
	};
	
	if (typeof pl_list === 'function') 
		return pl_list(_json[action]());
	else
		return _json[action]();
}


/*
Method vlc_config
Retrieve or save  vlc config.
Save in a Json file.

@param:
action: action called in the  _configjson table
config: The config to save
*/
var vlc_config = function (action, config) {
	
	var _configjson = {
		 file:  function () {return __dirname + '/vlc_config.json'},
		 get_infos: function () {try {
										var json = JSON.parse(fs.readFileSync(this.file(),'utf8')) 
									 } catch (err) 
									 {
										 config = {volume: 50, fullscreen:false, repeat:false, loop:false, random:false};
										 this.set_infos();
										 return;
									 } 
									 return json},
		 set_infos: function () {fs.writeFileSync(this.file(), JSON.stringify(config), 'utf8')}
	};
	
	if (typeof config === 'function') 
		return config(_configjson[action]());
	else
		return _configjson[action]();
}


/*
Method vlc_config_get_infos
get info in Json file
*/
var vlc_config_get_infos = function (){
	var conf = vlc_config('get_infos');
	return ((!conf) ? vlc_config('get_infos') : conf );
}

/*
Method vlc_set_config_infos
set a object table with the configuration
*/
var vlc_set_config_infos = function (type, value) {
	
	var _infos = {
		volume : ((type == 'volume') ? value : vlc_config_get_infos().volume),
		fullscreen: ((type == 'fullscreen') ? value : vlc_config_get_infos().fullscreen),
		repeat: ((type == 'repeat') ? value : vlc_config_get_infos().repeat),
		loop: ((type == 'loop') ? value : vlc_config_get_infos().loop),
		random: ((type == 'random') ? value : vlc_config_get_infos().random)
	};
	
	return _infos;
}



/*
Method get_relative_path
Retrieve the playlist relative path.

@param:
vlc_path: Path VLC
media_path: The medai path saved in nedb
*/
var get_relative_path = function (vlc_path, media_path) {
	
	var relatif_path,
	    nbOccurs = ((vlc_path.endsWith('/')) ? vlc_path.split('/').length : vlc_path.split('/').length - 1),
		media_path = (media_path).slice(3);
		
	for (i=0;i<nbOccurs;i++) 
		relatif_path = ((relatif_path) ? relatif_path+'../' : '../');
	
	return relatif_path + media_path;
}



/*
Method get_config_status
Get the config status of vlcPlayer and VLC

@param:
state: The key of the tbl_state table
config: vlcPlayer prop config
callback: callback method executed after getting the state
*/
var get_config_status = function (state, config, callback) {
	
	var tbl_state = {
		run: function () {return  ((SARAH.context.vlcPlayer.vlcExeChild) ? msg.localized('vlc_started') : msg.localized('vlc_stopped'))},
		autostart: function () {return  ((config.playlist_autostart == 'true')  ? msg.localized('auto_start_on') : msg.localized('auto_start_off'))},
		mode: function () {return  ((config.mode == 'http')  ? msg.localized('http_mode') : msg.localized('normal_mode'))},
		modeRepeat: function () {return  ((vlc_config_get_infos().repeat)  ? msg.localized('repeat_on') : msg.localized('repeat_off'))},
		modeLoop: function () {return  ((vlc_config_get_infos().loop)  ? msg.localized('loop_on') : msg.localized('loop_off'))},
		modeRandom: function () {return  ((vlc_config_get_infos().random)  ? msg.localized('random_on') : msg.localized('random_off'))},
		modefullscreen: function () {return  ((vlc_config_get_infos().fullscreen)  ? msg.localized('fullscreen_on') : msg.localized('fullscreen_off'))},
		volume: function () {return  msg.localized('display_volume') + ' ' + (vlc_config_get_infos().volume).toString()}
	};
	
	return callback(tbl_state[state]());
}



/*
Method config_status
Current status of the vlc player.
This coding way is made to leave a tempo between each speech of Sarah

@param:
config: vlcPlayer prop config
*/
var config_status = function (config) {

	get_config_status('run',config , function (state) {
		SARAH.speak(state, function () {
			setTimeout(function(){ 
				get_config_status('autostart',config , function (state) {
					SARAH.speak(state, function () {
						setTimeout(function(){ 
							get_config_status('mode',config , function (state) {
								SARAH.speak(state, function () {
									setTimeout(function(){ 
										get_config_status('modeRepeat',config , function (state) {
											SARAH.speak(state, function () {
												setTimeout(function(){ 
													get_config_status('modeLoop',config , function (state) {
														SARAH.speak(state, function () {
															setTimeout(function(){ 
																get_config_status('modeRandom',config , function (state) {
																	SARAH.speak(state, function () {
																		setTimeout(function(){ 
																			get_config_status('modefullscreen',config , function (state) {
																				SARAH.speak(state, function () {
																					setTimeout(function() { 
																						get_config_status('volume',config , function (state) {
																							SARAH.speak(state);
																						});
																					}, 1000);
																				});
																			});
																		}, 1000);
																	});	
																});
															}, 1000);
														});	
													});
												}, 1000);
											});
										});
									}, 1000);
								});
							});
						}, 1000);
					});
				});				
			}, 1000);
		});
	});
}



/*
Method start_vlc_load_nedb
First start vlc then populate nedb, order by:
- musics
- videos
- radios
- pictures
- TV channels

@param:
_vlcConf: table of properties
callback: function executed after starting vlc and populating nedb
*/
var start_vlc_load_nedb = function (_vlcConf,callback) {
	
	// start vlc
	start_vlc (	
	_vlcConf.path,
	_vlcConf.host,
	_vlcConf.port,
	_vlcConf.mode,
	_vlcConf.autostart,
	_vlcConf.password,
	function (err) {
		if (err) 
			SARAH.speak ( msg.err_localized('vlc_no_path'));
		else {
			// Get Play lists after vlc player has been started
			get_pl_list(_vlcConf.audio_type, _vlcConf.musicPath, function (no_error) { 
				if (debug == 'true') console.log("no_error audio: " + no_error);
				switch (no_error) {
				case false:
					  console.log(msg.err_localized('path_musics'));	
				case true:
				default:
					get_pl_list(_vlcConf.radio_type, _vlcConf.radioPath, function (no_error) { 
						if (debug == 'true') console.log("no_error radio: " + no_error);
						switch (no_error) {
						case false: 
									console.log( msg.err_localized('path_radios'));
						case true:	
						default:			
							get_pl_list(_vlcConf.video_type, _vlcConf.videoPath, function (no_error) { 
								if (debug == 'true') console.log("no_error video: " + no_error);
								switch (no_error) {
								case false:
									  console.log (msg.err_localized('path_videos'));	
								case true:
								default:
									get_pl_list(_vlcConf.picture_type, _vlcConf.picturePath, function (no_error) { 
										if (debug == 'true') console.log("no_error picture: " + no_error);
										switch (no_error) {
										case false:
											  console.log( msg.err_localized('path_pictures'));		
										case true:
										default:
											get_pl_list(_vlcConf.TVchannel_type, _vlcConf.TVchannelPath, function (no_error) { 
												if (debug == 'true') console.log("no_error TV channels: " + no_error);
												switch (no_error) {
												case false:
													  console.log( msg.err_localized('path_TVchannel'));		
												case true:
												default:
														SARAH.speak ( msg.localized('vlc_started'),function() {
														if (callback) callback()});
														break;
												}	
											});
											break;	
										}
									});
									break;
								}
							});
							break;
						}
					});	
					break;	
				}
			});
		}
	});	
}



/*
Set the context with the lazy to search for play lists
*/
var setlazy = function (mode, path, tts) {
		
	is_pl_list_available (path, function (count) {
		var err_tts;
		switch (count) {
			case -1:
				SARAH.speak(msg.err_localized('lost_playlists'));
				break;
			case 0:
				switch (mode) {
					case 'music_by_artist': case 'video_by_category': case 'radio_by_category': case 'picture_by_category': case 'TVchannel_by_category':
						err_tts = ((mode == 'music_by_artist') ? msg.err_localized('no_media_artist') : msg.err_localized('no_media_category'));
						break;
					case 'music_by_album': case 'video_by_genre': case 'radio_by_genre': case 'picture_by_genre': case 'TVchannel_by_genre':
						err_tts = ((mode == 'music_by_album') ? msg.err_localized('no_media_album') : msg.err_localized('no_media_genre'));
						break;
					case 'music_by_title': case 'video_by_name': case 'radio_by_name': case 'picture_by_name': case 'TVchannel_by_name':
						err_tts = ((mode == 'music_by_title') ? msg.err_localized('no_media_title') : msg.err_localized('no_media_name'));
						break;
				}
				SARAH.speak(err_tts);
				break;
			default:
				SARAH.speak(tts, function(){
					SARAH.context.vlcPlayer.vlc_search_mode = mode;
					SARAH.remote({'context' : 'lazyvlcSearch.xml'});
					});
				break;
		}
	});
}



/*	
Set the context with the lazy to modify the volume
*/
var setlazyvolume = function (tts) {
	SARAH.speak(tts, 
		function(){
			SARAH.remote({'context' : 'lazyvlcVolume.xml'});
		});
}


/*	
Set the context with the lazy to set the configuration
*/
var setlazyconfig = function (tts) {
	SARAH.speak(tts, 
		function(){
			SARAH.remote({'context' : 'lazyvlcConfig.xml'});
		});
}



/*
Set the context with the lazy to modify the position playing
*/
var setlazyseek = function (tts) {
	SARAH.speak(tts, 
		function(){
			SARAH.remote({'context' : 'lazyvlcSeek.xml'});
		});
}



/*
Stop vlc player
*/
var stop_vlc = function (callback) {
	
	var process = '%CD%/plugins/vlcPlayer/lib/vbs/vlcStop.vbs';
	if (debug == 'true') console.log("process: " + process);

	var execproc = exec(process, function (error, stdout, stderr) {
		if (error) {
			console.log(msg.err_localized('vlc_stop_error') + ' ' + error);
			callback (true);
		} else
			callback ();
	});
}



/*
Start vlc player
As the option --one-instance is hard coded, no more than one instance can be created.
You can modify that to start an instance of vlc for each call of this method 
but take care of the number of processes and it cans make mistake in the development. 
*/
var start_vlc  = function(path, host, port, mode, autostart, password, callback) {
	
	if (path === undefined)
		return callback(true);
	
	path = (( path.slice(-1) != '/') ? path+"/"  : path);
	var process = ((mode == 'http') ? "\"" + path + "vlc\" -I http" : "\"" + path + "vlc\" --extraintf=http");	
	// --http-password
	process = ((autostart == 'true') ? 
		 process + " --playlist-autostart --one-instance --http-host=" + host + " --http-port=" + port + " --http-password=" + password :
		 process + " --no-playlist-autostart --one-instance --http-host=" + host + " --http-port=" + port + " --http-password=" + password );

	if (debug == 'true') console.log("process: " + process);

	SARAH.context.vlcPlayer.vlcExeChild = exec(process, function (error, stdout, stderr) {
			if (error)
				// Error on start
				console.log(msg.err_localized('vlc_no_started') + error);
		});
	
	callback();
}


/*
Method: is_pl_list_available
Search if there is media for the type in nedb and return the number of records.

@param:
path: folder path regarding media type
callback: set the lazyvlcSearch
*/
var is_pl_list_available = function (path, callback) {
	
	var dbtype = path.split('/').pop();
	db.count({Type: dbtype}, function (err, count) {
		if (err){
			console.log("Enable to retrieve the Play lists, error: " + err);
			count = -1;
		}
		callback(count);
	});	
}	




/*
 * Replay the last play list saved in the pl_infos.json file
 * @param none
*/
var pl_last_replay = function () {
	
	var pl_infos = pl_last('get_infos'); 
	if (pl_infos) {
		db.findOne({Type: pl_infos.Type, Name: pl_infos.Name, File: pl_infos.File}, function (err, doc) {
			if (err){
				console.log("Enable to retrieve Play lists, error: " + err);
				return;
			}
			
			if (!doc){
				SARAH.speak(msg.err_localized('pl_list_replay_error'));
				return;
			}
			SARAH.context.vlcPlayer.vlc_search_mode = pl_infos.Mode;
			SARAH.speak(msg.localized('pl_list_replay') + ' ' + native_info('get_tts',doc),function(){
				pl_infos.Path = (( (pl_infos.Path).slice(-1) == '/') ? pl_infos.Path : pl_infos.Path + '/');
				if (debug == 'true') console.log("Replay play list: " + pl_infos.Path + doc.File);
					setTimeout(function(){ 
						vlc.playlist.add(pl_infos.Path + doc.File);	
						SARAH.remote({'context' : 'default'});
					}, 3000);
			});
		});	
	} else 
		SARAH.speak(msg.localized('replay_no_pl_list'));
}


/*
For fun!
Let Sarah searching for a play list alone!
*/
var random_pl_list = function (path) {
	
	var dbtype = path.split('/').pop();

	// The type of the search is defined at the call of the lazy and saved in the SARAH.context.vlcPlayer.vlc_search_mode
	db.count({Type: dbtype}, function (err, count) {	
		db.find({Type: dbtype}, function (err, docs) {
			if (err){
				console.log("Enable to retrieve Play lists, error: " + err);
				return;
			}
			
			var random_pl = Math.floor((Math.random() * count) + 1),
							doc = docs[random_pl-1];
			SARAH.speak(msg.localized('done_random') + ' ' + native_info('get_tts',doc),function(){
				path = (( path.slice(-1) == '/') ? path : path + '/');
				if (debug == 'true') console.log("Random play list: " + path + doc.File);
					setTimeout(function(){ 
						vlc.playlist.add(path + doc.File);	
						pl_last('set_infos', {"Mode": SARAH.context.vlcPlayer.vlc_search_mode, "Type":doc.Type, "Category": ((doc.Category)?doc.Category:null), "Genre": ((doc.Genre[0])?doc.Genre[0]:null), "Name": doc.Name, "Path": path, "File" : doc.File});
						SARAH.remote({'context' : 'default'});
					}, 3000);
			});
		});	
	});
}




/*
Method: native_info 
Return localized messages/values regarding the play list type

@param:
	action: the prop name to return the information
    doc: the document in the nedb database
*/
var native_info = function (action, doc) {
	
	var pl_type = {		
		get_searchcontext: function () {
			switch (SARAH.context.vlcPlayer.vlc_search_mode) {
				case 'music_by_artist': case 'video_by_category': case 'radio_by_category': case 'picture_by_category':  case 'TVchannel_by_category': return doc.Category.slice(0,1).toUpperCase();
				case 'music_by_album': 	case 'video_by_genre': case 'radio_by_genre': case 'picture_by_genre': case 'TVchannel_by_genre': return doc.Genre[0].slice(0,1).toUpperCase();	   
				case 'music_by_title': case 'video_by_name': case 'radio_by_name': case 'picture_by_name':  case 'TVchannel_by_name': return doc.Name.slice(0,1).toUpperCase();
		}},
		get_criterion: function () {   
			switch (SARAH.context.vlcPlayer.vlc_search_mode) {
				case 'music_by_artist': case 'video_by_category': case 'radio_by_category': case 'picture_by_category': case 'TVchannel_by_category': return doc.Category;
				case 'music_by_album': 	case 'video_by_genre': case 'radio_by_genre':  case 'picture_by_genre': case 'TVchannel_by_genre': return doc.Genre[0];	   
				case 'music_by_title': case 'video_by_name': case 'radio_by_name': case 'picture_by_name': case 'TVchannel_by_name': return doc.Name;
		}},
		get_localized_message: function (type, next) {
			switch (type) {
				case 'category':
					switch (SARAH.context.vlcPlayer.vlc_search_mode) {
						case 'music_by_artist': case 'music_by_album': case 'music_by_title':
							return ((msg.localized('category_music')) ? msg.localized('category_music') : '');
						case 'video_by_category': case 'video_by_genre': case 'video_by_name':
							return ((msg.localized('category_vid')) ? msg.localized('category_vid') : '');
						case 'radio_by_category': case 'radio_by_genre': case 'radio_by_name':
							return ((msg.localized('category_radio')) ? msg.localized('category_radio') : '');
						case 'picture_by_category': case 'picture_by_genre': case 'picture_by_name':
							return ((msg.localized('category_picture')) ? msg.localized('category_picture') : '');
						case 'TVchannel_by_category': case 'TVchannel_by_genre': case 'TVchannel_by_name':	
							return ((msg.localized('category_TVchannel')) ? msg.localized('category_TVchannel') : '');
					}
				case 'genre':
					switch (SARAH.context.vlcPlayer.vlc_search_mode) {
						case 'music_by_artist': case 'music_by_album': case 'music_by_title':
									return ((!next) 
												? ((msg.localized('genre_music')) ? msg.localized('genre_music') : '')
												: ((msg.localized('section_music')) ? msg.localized('section_music') : ''));
						case 'video_by_category': case 'video_by_genre': case 'video_by_name':
									return ((!next) 
												? ((msg.localized('genre_vid')) ? msg.localized('genre_vid') : '')
												: ((msg.localized('section_vid')) ? msg.localized('section_vid') : ''));
						case 'radio_by_category': case 'radio_by_genre': case 'radio_by_name':
									return ((!next) 
												? ((msg.localized('genre_radio')) ? msg.localized('genre_radio') : '')
												: ((msg.localized('section_radio')) ? msg.localized('section_radio') : ''));
						case 'picture_by_category': case 'picture_by_genre': case 'picture_by_name':
									return ((!next) 
												? ((msg.localized('genre_picture')) ? msg.localized('genre_picture') : '')
												: ((msg.localized('section_picture')) ? msg.localized('section_picture') : ''));
						case 'TVchannel_by_category': case 'TVchannel_by_genre': case 'TVchannel_by_name':
									return ((!next) 
												? ((msg.localized('genre_TVchannel')) ? msg.localized('genre_TVchannel') : '')
												: ((msg.localized('section_TVchannel')) ? msg.localized('section_TVchannel') : ''));
					}
				case 'name':
					switch (SARAH.context.vlcPlayer.vlc_search_mode) {
						case 'music_by_artist': case 'music_by_album': case 'music_by_title':
							return ((msg.localized('music')) ? msg.localized('music') : '');
						case 'video_by_category': case 'video_by_genre': case 'video_by_name':
							return ((msg.localized('video')) ? msg.localized('video') : '');								
						case 'radio_by_category': case 'radio_by_genre': case 'radio_by_name':
							return ((msg.localized('radio')) ? msg.localized('radio') : '');
						case 'picture_by_category': case 'picture_by_genre': case 'picture_by_name':
							return ((msg.localized('picture')) ? msg.localized('picture') : '');
						case 'TVchannel_by_category': case 'TVchannel_by_genre': case 'TVchannel_by_name':
							return ((msg.localized('TVchannel')) ? msg.localized('TVchannel') : '');
					}	
		}},		
		get_tts: function () {
			switch (SARAH.context.vlcPlayer.vlc_search_mode) {
					case 'music_by_artist': case 'video_by_category': case 'radio_by_category': case 'picture_by_category': case 'TVchannel_by_category':
							return ((msg.natural_voice(doc.Category)) ? msg.natural_voice(doc.Category) : doc.Category) 
									+ ". " + pl_type.get_Genres() +  pl_type.get_localized_message('name') + ((msg.natural_voice(doc.Name)) 
									? msg.natural_voice(doc.Name) 
									: doc.Name)  + ".";
					case 'music_by_album': case 'video_by_genre': case 'radio_by_genre': case 'picture_by_genre': case 'TVchannel_by_genre':
							return	pl_type.get_Genres() + pl_type.get_localized_message('name') + ((msg.natural_voice(doc.Name)) 
									 ? msg.natural_voice(doc.Name) 
									 : doc.Name)  + ". "
									 + ((doc.Category) 
									   ? ((msg.natural_voice(doc.Category)) ? pl_type.get_localized_message('category') + msg.natural_voice(doc.Category) : pl_type.get_localized_message('category') + doc.Category) : '');
					case 'music_by_title': case 'video_by_name': case 'radio_by_name': case 'picture_by_name': case 'TVchannel_by_name':
							return ((msg.natural_voice(doc.Name)) 
									? msg.natural_voice(doc.Name) 
									: doc.Name)
										  + ". " + pl_type.get_Genres() 
										  + ((doc.Category) 
											 ? ((msg.natural_voice(doc.Category)) ? pl_type.get_localized_message('category') + msg.natural_voice(doc.Category) : pl_type.get_localized_message('category') + doc.Category) : '');	
		}},
		get_Genres: function () {
							var Genre;
							doc.Genre.forEach(function (o) {
								  Genre = ((!Genre) 
								  ? pl_type.get_localized_message('genre') 
								  : (Genre + pl_type.get_localized_message('genre',true)))
								  + ((msg.natural_voice(o)) 
												 ? msg.natural_voice(o) 
												 : o) + "."; 
							});
							Genre = ((Genre) ? Genre : '');
							return Genre;
		}
	};
	
	return pl_type[action]();
	
}



/*
Method: set_media
Exemple:
The specific play list "The best of Tribute" of the Album "Tribute" for "John Newman"  Artist is searched and added in vlc
Artist:John Newman,Album:Tribute,Title:The best of Tribute

ALL play lists of the Album "Tribute" for "John Newman" Artist are searched and added in vlc
Artist:John Newman,Album:Tribute

ALL play lists of "John Newman" Artist are searched and added in vlc
Artist:John Newman

@Param:
mode: the type of media
key: Define play lists to play where key is the data.key in the xml.
	 By order, depends of the play list type (Music, Video, Radio, Picture)
	 Artist||Category: All Artist/Category found in the nedb database are added as play list
	 Album||Genre: All Albums/Genre found in the nedb database are added as play list
	 Title||Name: The Name found in the nedb database is added as play list
path: the relative folder path to load the play list
*/
var set_media = function (mode, key, path) {
	
	var dbtype = path.split('/').pop(),
		tblmodes = key.split(','),
		Category,
		Genre,
		Name,
		path = (( path.slice(-1) == '/') ? path : path + '/');
	
	tblmodes.forEach(function (o) {
		var forwhat = o.split(':');
		switch (forwhat[0]) {
			case 'Artist': case 'Category': Category = forwhat[1]; break;
			case 'Album': case 'Genre': Genre = forwhat[1]; break;
			case 'Title': case 'Name': Name = forwhat[1]; break;
		}
	});
	
	if (debug == 'true') console.log("Category: " + Category +  ' Genre: ' + Genre + ' Name: ' + Name);
	
	if (Category && Genre && Name) {
		db.findOne({Type: dbtype, Category: Category, Genre: Genre, Name: Name }, function (err, doc) {	
			if (err){
				console.log("Enable to retrieve Play lists, error: " + err);
				return;
			}
			if (!doc){
				SARAH.speak(msg.err_localized('no_title'));
				return;
			}
			
			switch (mode) {
				case 'music': SARAH.context.vlcPlayer.vlc_search_mode = 'music_by_title'; break;
				case 'video': SARAH.context.vlcPlayer.vlc_search_mode = 'video_by_name'; break;
				case 'audio': SARAH.context.vlcPlayer.vlc_search_mode = 'radio_by_name'; break;
				case 'picture': SARAH.context.vlcPlayer.vlc_search_mode = 'picture_by_name'; break;
				case 'TVchannel': SARAH.context.vlcPlayer.vlc_search_mode = 'TVchannel_by_name'; break;
			}
			// only one 
		    SARAH.speak(native_info('get_tts',doc),function(){
				if (debug == 'true') console.log("Add play list file: " + path + doc.File);
					setTimeout(function(){ 
						vlc.playlist.add(path + doc.File);	
						pl_last('set_infos', {"Mode": SARAH.context.vlcPlayer.vlc_search_mode, "Type":doc.Type, "Category": ((doc.Category)?doc.Category:null), "Genre": ((doc.Genre[0])?doc.Genre[0]:null), "Name": doc.Name, "Path": path, "File" : doc.File});
					}, 3000);
			});
		});	
		return;
	}
	
	if (Category && Name) {
		db.findOne({Type: dbtype, Category: Category, Name: Name }, function (err, doc) {	
			if (err){
				console.log("Enable to retrieve Play lists, error: " + err);
				return;
			}
			if (!doc){
				SARAH.speak(msg.err_localized('no_title'));
				return;
			}
			
			switch (mode) {
				case 'music': SARAH.context.vlcPlayer.vlc_search_mode = 'music_by_title'; break;
				case 'video': SARAH.context.vlcPlayer.vlc_search_mode = 'video_by_name'; break;
				case 'audio': SARAH.context.vlcPlayer.vlc_search_mode = 'radio_by_name'; break;
				case 'picture': SARAH.context.vlcPlayer.vlc_search_mode = 'picture_by_name'; break;
				case 'TVchannel': SARAH.context.vlcPlayer.vlc_search_mode = 'TVchannel_by_name'; break;
			}
			// only one 
		    SARAH.speak(native_info('get_tts',doc),function(){
				if (debug == 'true') console.log("Add play list file: " + path + doc.File);
					setTimeout(function(){ 
						vlc.playlist.add(path + doc.File);	
						pl_last('set_infos', {"Mode": SARAH.context.vlcPlayer.vlc_search_mode, "Type":doc.Type, "Category": ((doc.Category)?doc.Category:null), "Genre": ((doc.Genre[0])?doc.Genre[0]:null), "Name": doc.Name, "Path": path, "File" : doc.File});
					}, 3000);
			});
		});	
		return;
	}
	
	if (Name) {
		db.findOne({Type: dbtype, Name: Name }, function (err, doc) {	
			if (err){
				console.log("Enable to retrieve Play lists, error: " + err);
				return;
			}
			if (!doc){
				SARAH.speak(msg.err_localized('no_title'));
				return;
			}
			
			switch (mode) {
				case 'music': SARAH.context.vlcPlayer.vlc_search_mode = 'music_by_title'; break;
				case 'video': SARAH.context.vlcPlayer.vlc_search_mode = 'video_by_name'; break;
				case 'audio': SARAH.context.vlcPlayer.vlc_search_mode = 'radio_by_name'; break;
				case 'picture': SARAH.context.vlcPlayer.vlc_search_mode = 'picture_by_name'; break;
				case 'TVchannel': SARAH.context.vlcPlayer.vlc_search_mode = 'TVchannel_by_name'; break;
			}
			// only one 
		    SARAH.speak(native_info('get_tts',doc),function(){
				if (debug == 'true') console.log("Add play list file: " + path + doc.File);
					setTimeout(function(){ 
						vlc.playlist.add(path + doc.File);	
						pl_last('set_infos', {"Mode": SARAH.context.vlcPlayer.vlc_search_mode, "Type":doc.Type, "Category": ((doc.Category)?doc.Category:null), "Genre": ((doc.Genre[0])?doc.Genre[0]:null), "Name": doc.Name, "Path": path, "File" : doc.File});
					}, 3000);
			});
		});	
		return;
	}
	
	if (Category && Genre) {
		db.find({Type: dbtype, Category: Category, Genre: Genre }, function (err, docs) {	
			if (err){
				console.log("Enable to retrieve Play lists, error: " + err);
				return;
			}
			if (docs.length == 0){
				SARAH.speak(msg.err_localized('no_title'));
				return;
			}
			
			switch (mode) {
				case 'music': SARAH.context.vlcPlayer.vlc_search_mode = 'music_by_album'; break;
				case 'video': SARAH.context.vlcPlayer.vlc_search_mode = 'video_by_genre'; break;
				case 'audio': SARAH.context.vlcPlayer.vlc_search_mode = 'radio_by_genre'; break;
				case 'picture': SARAH.context.vlcPlayer.vlc_search_mode = 'picture_by_genre'; break;
				case 'TVchannel': SARAH.context.vlcPlayer.vlc_search_mode = 'TVchannel_by_genre'; break;
			}
			
			// more than one
			docs.forEach(function (doc) {
				SARAH.speak(native_info('get_tts',doc),function(){
					if (debug == 'true') console.log("Add play list file: " + path + doc.File);
						setTimeout(function(){ 
							vlc.playlist.add(path + doc.File);
							pl_last('set_infos', {"Mode": SARAH.context.vlcPlayer.vlc_search_mode, "Type":doc.Type, "Category": ((doc.Category)?doc.Category:null), "Genre": ((doc.Genre[0])?doc.Genre[0]:null), "Name": doc.Name, "Path": path, "File" : doc.File});
						}, 3000);
				});
			});
		});	
		return;
	}
	
	if (Category) {
		db.find({Type: dbtype, Category: Category }, function (err, docs) {	
			if (err){
				console.log("Enable to retrieve Play lists, error: " + err);
				return;
			}
			if (docs.length == 0){
				SARAH.speak(msg.err_localized('no_title'));
				return;
			}
			
			switch (mode) {
				case 'music': SARAH.context.vlcPlayer.vlc_search_mode = 'music_by_artist'; break;
				case 'video': SARAH.context.vlcPlayer.vlc_search_mode = 'video_by_category'; break;
				case 'audio': SARAH.context.vlcPlayer.vlc_search_mode = 'radio_by_category'; break;
				case 'picture': SARAH.context.vlcPlayer.vlc_search_mode = 'picture_by_category'; break;
				case 'TVchannel': SARAH.context.vlcPlayer.vlc_search_mode = 'TVchannel_by_category'; break;
			}
			
			// more than one
			docs.forEach(function (doc) {
				SARAH.speak(native_info('get_tts',doc),function(){
					if (debug == 'true') console.log("Add play list file: " + path + doc.File);
						setTimeout(function(){ 
							vlc.playlist.add(path + doc.File);	
							pl_last('set_infos', {"Mode": SARAH.context.vlcPlayer.vlc_search_mode, "Type":doc.Type, "Category": ((doc.Category)?doc.Category:null), "Genre": ((doc.Genre[0])?doc.Genre[0]:null), "Name": doc.Name, "Path": path, "File" : doc.File});
						}, 3000);
				});
			});
		});	
		return;
	}
	
}




/*
Method: first_pl_list recursive method
@Param:
pos: start letter position in the lexic
path: the relative folder path to load the play list
specif: up or down (from the beginning or the end of the play lists found in the db)

Initialize variables and call recursive next_pl_list method.
*/
var first_pl_list = function(pos,path,specif) {
	
	var tbl_lexic = msg.tbl_lexic(),
		sens,
		tbllexic = 0,
		base = new RegExp(msg.lexic(pos), 'i');
		
	if (pos == 1 || (specif && specif == 'up')) sens = "up";
	if (pos == 35 || (specif && specif == 'down')) sens = "down";

	var dbtype = path.split('/').pop();
	path = (( path.slice(-1) == '/') ? path : path + '/');
	for (var o in tbl_lexic) ++tbllexic;
	
	if (debug == 'true')  {
		console.log("path: " + path);
		console.log("dbtype: " + dbtype);
		console.log("sens: " + sens);
		console.log("base: " + base);
		console.log("tbllexic: " + tbllexic);
		console.log("pos: " + pos);
		console.log("mode: " + SARAH.context.vlcPlayer.vlc_search_mode);
	}
	next_pl_list(dbtype,sens,pos,base,tbllexic,path,next_pl_list);
	
}




/*
Method: next_pl_list recursive method.
Called from: first_pl_list
@Param:
dbtype: nedb "Type" field. 
sens: up or down (from the beginning or the end of the play lists found in the db)
lexic_pos: letter counter to start search from.
base: Regular expression letter to search for in the nedb
tblsize: the possible file extensions regarding the dbType field (--> ...type property in the prop)
path: the relative folder path to load the play list
callback: next_pl_list recursive method.

Made to retrieve play lists by Alphabetic order (all types) from A to Z, Z to A or in a 
particular position and one by one.
For each play list found, calls the "askFor" recursive method.
*/
var next_pl_list = function (dbtype, sens, lexic_pos, base, tblsize, path, callback) {
	
	// The type of the search is defined at the call of the lazy and saved in the SARAH.context.vlcPlayer.vlc_search_mode
	switch (SARAH.context.vlcPlayer.vlc_search_mode) {
	case 'music_by_artist': case 'video_by_category': case 'radio_by_category': case 'picture_by_category': case 'TVchannel_by_category':
			db.find({Type: dbtype, Category: base}, function (err, docs) {
				if (err){
					console.log("Enable to retrieve the Play lists, error: " + err);
					return;
				}
		
				askFor(docs,0,msg.lexic(lexic_pos),lexic_pos,path,askFor,function (pos) {
					if (sens == "up") ++pos;
					if (sens == "down") --pos;
					var base = new RegExp(msg.lexic(pos), 'i');
					if (pos <= tblsize && pos >= 1) 
						callback(dbtype,sens,pos,base,tblsize,path,callback) 
				});
			});	
			break;
	case 'music_by_album': case 'video_by_genre': case 'radio_by_genre': case 'picture_by_genre': case 'TVchannel_by_genre':
			db.find({Type: dbtype, Genre: base}, function (err, docs) {	
				if (err){
					console.log("Enable to retrieve the Play lists, error: " + err);
					return;
				}

				askFor(docs,0,msg.lexic(lexic_pos),lexic_pos,path,askFor,function (pos) {
					if (sens == "up") ++pos;
					if (sens == "down") --pos;
					var base = new RegExp(msg.lexic(pos), 'i');
					if (pos <= tblsize && pos >= 1) 
						callback(dbtype,sens,pos,base,tblsize,path,callback) 
				});
			});	
			break;
	case 'music_by_title': case 'video_by_name': case 'radio_by_name': case 'picture_by_name': case 'TVchannel_by_name':	  		
			db.find({Type: dbtype, Name: base}, function (err, docs) {	
				if (err){
					console.log("Enable to retrieve the Play lists, error: " + err);
					return;
				}

				askFor(docs,0,msg.lexic(lexic_pos),lexic_pos,path,askFor,function (pos) {
					if (sens == "up") ++pos;
					if (sens == "down") --pos;
					var base = new RegExp(msg.lexic(pos), 'i');
					if (pos <= tblsize && pos >= 1) 
						callback(dbtype,sens,pos,base,tblsize,path,callback) 
				});
			});	
			break;
	}			
}	


/*
Method: askFor recursive method. 
Called from: next_pl_list
@Param:
	docs: the document table retrieved with criteria.
	pos: counter of number of documents.
	lexic: The letter to search for documents.
	lexic_pos: char counter to start from.
	path: the relative folder path to load the play list
	callback: askefor recursive method. 
	callbackNext: the next_pl_list callback method
	
Ask a question for each play list found in the db, if the answer is:
	'yes': add the play list to vlc and end asking.
	'more': add the play list to vlc and continue asking.
	'end' || 'cancel': same result, end without adding a play list. Only the message changes.

Sorry, unable to localize the answer, but you can modify the value by yourself.
Modify words ONLY at the left on the line under SARAH.askme.
Retrieve the natural voice for a correct speech of the Category, Genre and Play list to the 
<localize>.js file and the "natural_voice" table.
See the documentation for more information about localized messages.
*/
var askFor = function (docs,pos,lexic,lexic_pos,path,callback,callbackNext) {
	
	if (docs.length == 0 ) return callbackNext(lexic_pos);
	if (pos == docs.length) return callbackNext(lexic_pos);
	
	var doc = docs[pos];  
	if (native_info('get_searchcontext',doc) == lexic) {
			if (debug == 'true') console.log("Play list found: " + native_info('get_criterion',doc));
		
			SARAH.askme(native_info('get_tts',doc), { 
					'oui' : 'yes',
					'ajoute' : 'yes',
					'ajoute encore' : 'more',
					'oui et encore' : 'more',
					'non' : 'no',
					'suivant' : 'no',
					'nan' : 'no',
					'ca suffit': 'end',
					'c\est bon': 'end',
					'terminé': 'end',
					'annule' : 'cancel',
					'cancel' : 'cancel'
			}, 0, function(answer, end){
					switch (answer) {
					case 'yes':
						SARAH.speak(msg.localized('done'),function(){
							if (debug == 'true') console.log("Add play list file: " + path + doc.File);
							vlc.playlist.add(path + doc.File);	
							pl_last('set_infos', {"Mode": SARAH.context.vlcPlayer.vlc_search_mode, "Type":doc.Type, "Category": ((doc.Category)?doc.Category:null), "Genre": ((doc.Genre[0])?doc.Genre[0]:null), "Name": doc.Name, "Path": path, "File" : doc.File});
							end();
						});
						break;
					case 'more':
						SARAH.speak(msg.localized('more'),function(){
							if (debug == 'true') console.log("Add play list file: " + path + doc.File);
							vlc.playlist.add(path + doc.File);	
							pl_last('set_infos', {"Mode": SARAH.context.vlcPlayer.vlc_search_mode, "Type":doc.Type, "Category": ((doc.Category)?doc.Category:null), "Genre": ((doc.Genre[0])?doc.Genre[0]:null), "Name": doc.Name, "Path": path, "File" : doc.File});
							end();
						});
						callback(docs,++pos,lexic,lexic_pos,path,callback,callbackNext);
						break;
					case 'end':
						SARAH.speak(msg.localized('add_end'),function(){
							if (debug == 'true') console.log("End adding play list");
							end();
						});
						break;
					case 'cancel':
						SARAH.speak(msg.localized('cancel'),function(){
							if (debug == 'true') console.log("Cancel get play list");
							end();
						});
						break;
					case 'no': 
					default:	
						if (debug == 'true') console.log("Next play list");
						callback(docs,++pos,lexic,lexic_pos,path,callback,callbackNext);
						end();	
						break;
					}
			}); 
	} else
		callback(docs,++pos,lexic,lexic_pos,path,callback,callbackNext);
}





/*
Populate the nedb database with play lists found.
call the recursive "walk" method to search for play list files in tree folders.
The nedb database is loaded in memory only.

Example of records:
Type: Playlists", Category:"John Newman", Genre: ["Tribute"], Name:"Le meilleur de Tribute", File:"John Newman/Tribute/Le meilleur de Tribute.xspf"
Type: Playlists", Category:"John Newman", Genre: ["Tribute"], Name:"Album complet", File:"John Newman/Tribute/Album complet.xspf"
Type: Playlists", Name:"Musique de Films", File:"Musique de Films/Musique de Films.xspf"
Type: Playlists", Category:"Supertramp", Genre: ["Breakfast in America" , "Best songs"], Name:"Full album", File:"Supertramp/Breakfast in America/Best songs/Full album.xspf"
Type: Playlists", Category:"Supertramp", Genre: ["Crime of the Century"], Name:"Crime of the Century", File:"Supertramp/Crime of the Century/Crime of the Century.xspf"

Where:
- Type is the top folder where are located all Categories, Genres and play lists.
- Category is the top folder where are located all Genres (Albums) and play lists for an Category.
- Genre is a table which groups the structure of folders for an album and associated play lists.
- Name is the name of the play list.
- File is the play list file name.

This recursive method accepts the type of play lists defined in the pl_list_audio_type, pl_list_radio_type, pl_list_video_type and pl_list_TVChannel_type properties of the vlcPlayer.prop file

Any way, this method accepts another files types (e.g. mp3, m4a, etc...) in the folders, they are just ignored.
This is made if you want to create and load play lists to the same folder of the songs (or movies, audio...).

Folder structure of the example above:
Playlists/John Newman/Tribute/Le meilleur de Tribute.xspf
Playlists/John Newman/Tribute/Album complet.xspf
Playlists/Musique de Films.xspf
Playlists/Supertramp/Breakfast in America/Best songs/Full album.xspf
Playlists/Supertramp/Crime of the Century/Crime of the Century.xspf
*/
var get_pl_list  = function(type, path, callback) {
	
	if (!path || path == '')
		return callback(true);
		
	path = (( path.slice(-1) == '/') ? path.slice(0,-1) : path);
	if (debug == 'true') console.log("Path: " + path);
	
	var folderType = path.split('/').pop(),
		Mimeplaylist = type.split(',');
	if (debug == 'true') console.log("folderType: " + folderType);

	walk (path, function (err,results) { 
		if (err) {
			console.log(err);
			if (callback) return callback(false);
			else return;
		}
		var pending = results.length;
		if (!pending) 
			if (callback) return callback();
			else return;
		
		results.forEach(function (file) {
			var Mime_playlist;
			for ( z=0; z<Mimeplaylist.length;z++ ) {
				if (file.toLowerCase().indexOf(Mimeplaylist[z].toLowerCase()) != -1) {
					Mime_playlist = Mimeplaylist[z];
					break;
				}	
			}
			
			if (Mime_playlist){	
				var values =  file.split('/').slice(file.split('/').indexOf(folderType) + 1);
				var pl_flagfile = false;
				var pl = {}; 
				pl.Genre = [];
				
				for (a=values.length -1;a >= 0;a--){
					var value = values[a];
					if (!pl_flagfile) {
						pl.File = file.replace(path,'');
						pl.File = (( (pl.File).slice(0,1) == '/') ? (pl.File).slice(1) : pl.File);
						pl.Name = value.replace(Mime_playlist,'');
						if (debug == 'true') console.log("File: " + pl.File);
						if (debug == 'true') console.log("Name: " + pl.Name);
						pl_flagfile = true;
					}
					
					if (pl_flagfile && values.length > 1) {
						switch (a) {
						case 0: 
							pl.Category = value;
							if (debug == 'true') console.log("Category: " + pl.Category);
							break;
						default: 
							if (a <= values.length - 2) {
								pl.Genre.push(value);
								if (debug == 'true') console.log("Genre: " + value);	
							}
							break;
						}
					}
				}
				
				if (pl.Name) {
					pl.Type = folderType;
					if (pl.Genre) pl.Genre.reverse();
					db.insert( pl, function(err, newDoc){
						if (debug == 'true') console.log('Record of ' + newDoc.Name + ' done.');
					});
				}
			}
			
			if (!--pending)
				if (callback) return callback(true);
				else return;
		});
	});
}


/*
Method: walk recursive method.
Called from: get_pl_list
Search for play list files in tree folders.
@Param:
Path: The relative path to start the search
callback: recursive callback
*/
var walk = function(path, callback) {

  var results = [];
  fs.readdir(path, function(err, list) {
	if (err) return callback(err);

	var pending = list.length;
	if (!pending) return callback(null, results);

	list.forEach(function(file) {
	  file = path + "/" + file;
	  fs.stat(file, function(err, stat) {
		if (stat && stat.isDirectory()) {
		  walk(file, function(err, res) {
			results = results.concat(res);
			if (!--pending) callback(null, results);
		  });
		} else {
		  results.push(file);
		  if (!--pending) callback(null, results);
		}
	  });
	});
  });
}



