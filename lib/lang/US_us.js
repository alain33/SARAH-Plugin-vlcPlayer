
/*
messages
*/
var messages = {
	vlc_started: "vlc player started.",
	vlc_stopped: "vlc player stopped",
	vlc_stop: "I'm stopping vlc player",
	vlc_stop_start: "I'm restarting vlc player",
	vlc_already_started: "vlc player is already started",
	start_vlc_first: "vlc player is not started.",
	done: "Added and done.",
	more: "added.",
	cancel: "cancelled.",
	add_end: "added end",
	debug: "vlc: debug mode on.",
	config_mode: "configuration mode, i lessen to you",
	config_save: "configuration vlc saved.",
	config_not_save: "If the configuration is modified, it is not saved. it actives until the next start of Sarah.",
	auto_start_off: "Auto start inactive",
	auto_start_on: "Auto start active",
	http_mode: "mode H.T.T.P activated.",
	normal_mode: "mode normal activated.",
	music_by_artist: "Search music by artiste, how i have to search?",
	music_by_title: "Search music by title, how i have to search?",
	music_by_album: "Search music by album, how i have to search?",
	video_by_category: "Search video by category, how i have to search?",
	video_by_name: "Search video by name, how i have to search?",
	video_by_genre: "Search video by genre, how i have to search?",
	radio_by_name: "Search radio by name, how i have to search?",
	radio_by_category: "Search radio by category, how i have to search?",
	radio_by_genre: "Search radio by genre, how i have to search?",
	picture_by_category: "Search picture by category,how i have to search?",
	picture_by_name: "Search picture by name, how i have to search?",
	picture_by_genre: "Search picture by genre, how i have to search?",
	TVchannel_by_category: "Search tv channel by category, how i have to search?",
	TVchannel_by_name: "Search tv channel by name, how i have to search?",
	TVchannel_by_genre: "Search tv channel by genre, how i have to search?",
	ready_volume: "Volume variation mode, i lessen to you",
	volume_mini: "Volume minimum",
	volume_maxi: "Volume maximum",
	set_volume_mini: "Volume minimum",
	set_volume_maxi: "Volume maximum",
	repeat_on: "repeat mode activated",
	repeat_off: "repeat mode inactivated",
	loop_on: "repeat play list mode activated",
	loop_off: "repeat play list mode inactivated",
	random_on: "random mode activated",
	random_off: "random mode inactivated",
	fullscreen_off: "video in normal screen",
	fullscreen_on: "video in full screen",
	toggle: "Reverse",
	seek_mode: "mode seek, i lessen to you",
	seek_maxi: "back to the beginning",
	pause: "Pause",
	reprise: "Reprise",
	stop: "lecture stopped",
	lecture: "lecture",
	empty: "I have cleared play list",
	category_music: " Artiste: ",
	genre_music: "Album: ",
	section_music: " Section: ",
	music: " Music: ",
	category_vid: " Category: ",
	genre_vid: "Genre: ",
	section_vid: " Section: ",
	video: " Video: ",
	category_radio: " Category: ",
	genre_radio: "Genre: ",
	section_radio: " Section: ",
	radio:  " Radio: ",
	category_picture: " Category: ",
	genre_picture: "Genre: ",
	section_picture: " Section: ",
	picture:  " Picture: ",
	category_TVchannel: " Category: ",
	genre_TVchannel: "Genre: ",
	section_TVchannel: " Section: ",
	TVchannel: " Channel: ",
	done_random: "Super!.. Then something good. let see..., I'm choosing",
	pl_list_replay: "i replay",
	wakeup_save: "saved",
	wakeup_replaced: "replaced for",
	display_volume: "volume to"
}

/*
Errors messages
*/
var error_messages = {
	vlc_no_path: "No folder for vlc",
	vlc_no_started: "vlc error: ",
	vlc_no_password: "the vlc password is not correct.",
	path_musics: "vlc is started but there is an error in the access folder of musics.",
	path_videos: "vlc is started but there is an error in the access folder of videos.",
	path_radios: "vlc is started but there is an error in the access folder of radios.",
	path_pictures: "vlc is started but there is an error in the access folder of pictures.",
	path_TVchannel: "vlc is started but there is an error in the access folder of TV channels.",
	no_playlists_in_db: "I am sorry but there is no play list to play.",
	lost_playlists: "I have lost play list informations. Restart the player please.",
	no_title: "There is no play list with the defined criteria",
	vlc_stop_error: "I didn't stopped the player",
	no_media_category: "There is no information by category for this type of media. Choose another search mode please.",
	no_media_artist: "There is no information by artiste for the music. Choose another search mode please.",
	no_media_album: "There is no information by album for the music. Choose another search mode please.",
	no_media_genre: "There is no information by genre for this type of media. Choose another search mode please.",
	no_media_title: "There is no play list, I can't do a search.",
	no_media_name: "There is no play list for this type of media, I can't do a search.",
	pl_list_replay_error: "I am sorry, I can't find the saved play list.",
	replay_no_pl_list: "I am sorry, no play list saved.",
	wakeup_no_date: "I am sorry, the date format is incorrect.",
	wakeup_no_info: "I am sorry, le media  format is incorrect.",
	err_findplugin: "programme is not set, there is no module"
}



/* 
"Real name", "Spoked by Sarah" Table
Add the exact Category, Genre, Name and the defined speech
See the examples and/or remove them if you want
*/
var natural_voice = {
	"Bird York": "beurde yorque",
	"Seven Pounds": "Séveune Pound",
	"Le meilleur de Seven Pounds": "Le meilleur de Séveune Pound",
    "John Newman": "John Nioumane",
	"Mike And The Mechanics": "Maïke and the Mécanique",
	"Silent Running": "Silente Reunnigue",
	"Breakfast in America": "Brékfeust ine América",
	"Crime of the Century": "Craillme of the Century",
	"It Was The Best Times (Double)": "It Waz The Baist Taillme",
	"Some Things Never Change": "Some Tsigue Néveur Tchange",
	"Mr And Mrs Smith": "Misteur And Missiz Smisse"
}




/* 
Lexical for the search
I didn't tried but for me no problem to add more letters
*/
var lexic = {
	1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F', 7: 'G', 8: 'H', 9: 'I',
	10: 'J', 11: 'K', 12: 'L', 13: 'M', 14: 'N', 15: 'O', 16: 'P', 17: 'Q', 18: 'R', 19: 'S', 
	20: 'T', 21: 'U', 22: 'V', 23: 'W', 24: 'X', 25: 'Y', 26: 'Z'
}


	
exports.localized = function(msg){ return messages[msg]} 
exports.err_localized = function(msg){ return error_messages[msg]} 
exports.lexic = function(msg){ return lexic[msg]} 
exports.tbl_lexic = function(){ return lexic} 
exports.natural_voice = function(natural){ return natural_voice[natural]} 
