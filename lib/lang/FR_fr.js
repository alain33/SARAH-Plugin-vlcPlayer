
/*
messages
*/
var messages = {
	vlc_started: "lecteur vlc démarré.",
	vlc_stopped: "lecteur vlc stoppé",
	vlc_stop: "j'arrète le lecteur vlc",
	vlc_stop_start: "je redémarre le lecteur vlc",
	vlc_already_started: "le lecteur vlc est déjà démarré.",
	start_vlc_first: "Le lecteur vlc n'est pas démarré.",
	done: "ajouté et terminé.",
	more: "ajouté.",
	cancel: "annulé.",
	add_end: "Ajout terminé",
	debug: "vlc: mode debug activé.",
	config_mode: "mode configuration, je t'écoute",
	config_save: "configuration vlc sauvegardée.",
	config_not_save: "Si la configuration a été modifiée, elle n'est pas sauvegardée. Elle sera active jusqu'au prochain redémarrage de Sarah.",
	auto_start_off: "Auto start désactivé",
	auto_start_on: "Auto start activé",
	http_mode: "mode H.T.T.P activé.",
	normal_mode: "mode normal activé.",
	music_by_artist: "Recherche de musique par artiste, comment dois-je chercher?",
	music_by_title: "Recherche de musique par titre, comment dois-je chercher?",
	music_by_album: "Recherche de musique par album, comment dois-je chercher?",
	video_by_category: "Recherche d'une vidéo par catégorie, comment dois-je chercher?",
	video_by_name: "Recherche d'une vidéo par nom, comment dois-je chercher?",
	video_by_genre: "Recherche d'une vidéo par genre, comment dois-je chercher?",
	radio_by_name: "Recherche de radio par nom, comment dois-je chercher?",
	radio_by_category: "Recherche de radio par catégorie, comment dois-je chercher?",
	radio_by_genre: "Recherche de radio par genre, comment dois-je chercher?",
	picture_by_category: "Recherche de photos par catégorie, comment dois-je chercher?",
	picture_by_name: "Recherche de photos par nom, comment dois-je chercher?",
	picture_by_genre: "Recherche de photos par genre, comment dois-je chercher?",
	TVchannel_by_category: "Recherche de chaine par catégorie, comment dois-je chercher?",
	TVchannel_by_name: "Recherche de chaine par nom, comment dois-je chercher?",
	TVchannel_by_genre: "Recherche de chaine par genre, comment dois-je chercher?",
	ready_volume: "Mode variateur de volume, je t'écoute.",
	volume_mini: "Volume minimum",
	volume_maxi: "Volume maximum",
	set_volume_mini: "Volume minimum",
	set_volume_maxi: "Volume maximum",
	repeat_on: "répétition activée",
	repeat_off: "répétition désactivée",
	loop_on: "répètition de la play list activée",
	loop_off: "répètition de la play list désactivée",
	random_on: "mode aléatoire activée",
	random_off: "mode aléatoire désactivée",
	fullscreen_off: "vidéo en écran normal",
	fullscreen_on: "vidéo en plein écran",
	toggle: "j'inverse",
	seek_mode: "mode recherche de plage de lecture, je t'écoute.",
	seek_maxi: "je reviens au début",
	pause: "Pause",
	reprise: "Reprise",
	stop: "lecture stoppée",
	lecture: "lecture",
	empty: "J'ai vidé les play list",
	category_music: " Artiste: ",
	genre_music: "Album: ",
	section_music: " Section: ",
	music: " Musique: ",
	category_vid: " Catégorie: ",
	genre_vid: "Genre: ",
	section_vid: " Section: ",
	video: " Video: ",
	category_radio: " Catégorie: ",
	genre_radio: "Genre: ",
	section_radio: " Section: ",
	radio:  " Radio: ",
	category_picture: " Catégorie: ",
	genre_picture: "Genre: ",
	section_picture: " Section: ",
	picture:  " Photo: ",
	category_TVchannel: " Catégorie: ",
	genre_TVchannel: "Genre: ",
	section_TVchannel: " Section: ",
	TVchannel: " Chaine: ",
	done_random: "Super! Alors quelque chose de bien, voyons voir..., je met",
	pl_list_replay: "Je rejoue",
	wakeup_save: "enregistré",
	wakeup_replaced: "remplacer pour",
	display_volume: "volume à"
}

/*
Errors messages
*/
var error_messages = {
	vlc_no_path: "Aucun répertoire pour vlc",
	vlc_no_started: "Erreur vlc: ",
	vlc_no_password: "le mot de passe pour le lecteur vlc est incorrect.",
	path_musics: "vlc est démarré mais il y a une erreur dans le répertoire d'accès aux musiques.",
	path_videos: "vlc est démarré mais il y a une erreur dans le répertoire d'accès aux vidéos.",
	path_radios: "vlc est démarré mais il y a une erreur dans le répertoire d'accès aux radios.",
	path_pictures: "vlc est démarré mais il y a une erreur dans le répertoire d'accès aux photos.",
	path_TVchannel: "vlc est démarré mais il y a une erreur dans le répertoire d'accès aux chaines de télévision.",
	no_playlists_in_db: "je suis désolé mais il n'y a aucune play list à jouer.",
	lost_playlists: "J'ai perdu les informations sur les listes de lecture. Redémarre le lecteur s'il te plait.",
	no_title: "Il n'y a aucune play list avec les critères définis",
	vlc_stop_error: "Je n'ai pas réussi à stopper le lecture vlc",
	no_media_category: "Il n'y a pas d'information par catégorie pour ce type de média. Choisis un autre mode de recherche, s'il te plait.",
	no_media_artist: "Il n'y a pas d'information par artiste pour la musique. Choisis un autre mode de recherche, s'il te plait.",
	no_media_album: "Il n'y a pas d'information par album pour la musique. Choisis un autre mode de recherche, s'il te plait.",
	no_media_genre: "Il n'y a pas d'information par genre pour ce type de média. Choisis un autre mode de recherche, s'il te plait.",
	no_media_title: "Il n'y a aucun titre de musique disponible, je ne peux pas faire de recherche.",
	no_media_name: "Il n'y a aucun média disponible pour ce type, je ne peux pas faire de recherche.",
	pl_list_replay_error: "Je suis désolé, je ne peux pas retrouver la play list qui est sauvegardée.",
	replay_no_pl_list: "Je suis désolé, aucune play list n'est sauvegardée.",
	wakeup_no_date: "Je suis désolé, le format de la date est incorrecte.",
	wakeup_no_info: "Je suis désolé, le format du média est incorrect",
	err_findplugin: "La programmation a échouée, il n'existe pas de module"
}



/* 
"Real name", "Spoked by Sarah" Table
Add the exact Category, Genre, Name and the defined speech
See the examples and/or remove them if you want
*/
var natural_voice = {
	"Bird York": "beurde yorque",
	"Seven Pounds": "Séveune Pound",
	"Le meilleur de Seven Pounds": "Le meilleur de Séveune Pound"
}




/* 
Lexic for the search
I did'nt tried but for me no problem to add other more letters
*/
var lexic = {
	1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E', 6: 'F', 7: 'G', 8: 'H', 9: 'I',
	10: 'J', 11: 'K', 12: 'L', 13: 'M', 14: 'N', 15: 'O', 16: 'P', 17: 'Q', 18: 'R', 19: 'S', 
	20: 'T', 21: 'U', 22: 'V', 23: 'W', 24: 'X', 25: 'Y', 26: 'Z', 
	27: '1', 28: '2', 29: '3', 30: '4', 31: '5', 32: '6', 33: '7', 34: '8', 35: '9'
}


	
exports.localized = function(msg){ return messages[msg]} 
exports.err_localized = function(msg){ return error_messages[msg]} 
exports.lexic = function(msg){ return lexic[msg]} 
exports.tbl_lexic = function(){ return lexic} 
exports.natural_voice = function(natural){ return natural_voice[natural]} 
