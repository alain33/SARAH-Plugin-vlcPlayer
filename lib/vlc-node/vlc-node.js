var Q = require('../q/q'),
	QHttp = require('../q-io/http'),
	url = require('url'),
	path = require('path'),
	util = require('util');

var Client = module.exports = function (opts) {
	//Dirty hack, should fix this. One day, promised
	obj = this;

	if (!(this instanceof Client)) {
		return new Client(opts);
	}
	opts = opts || {};

	this._base = this.base || util.format('http://%s:%d',
		opts.host || 'localhost',
		opts.port || 8080
	);
	
	this._authHeader = util.format('Basic %s',
		new Buffer(opts.username || '' + ':' + opts.password || '').toString('base64')
	);

	// STATUS RESOURCE (almost everything is lumped onto this resource.)
	this.status = this.request.bind(this, 'status');
	this.playlist = this.request.bind(this, 'status');
	
	//Force the data object to update with new data from VLC
	this.status.forceUpdate = this.request.bind(this, 'status', {command: 'status'});

	//Overal commands
	this.status.fullscreen = this.request.bind(this, 'status', {command: 'fullscreen'});
	this.status.play = this.request.bind(this, 'status', {command: 'pl_play'});
	this.status.pause = this.request.bind(this, 'status', {command: 'pl_pause'});
	this.status.stop = this.request.bind(this, 'status', {command: 'pl_stop'});
	this.status.resume = this.request.bind(this, 'status', {command: 'pl_forceresume'});
	this.status.volume = function (vol) {return obj.request('status', {command: 'volume', val: Math.ceil(vol * 2.552)}); };
	this.status.volumeUp = function (vol) {return obj.request('status', {command: 'volume', val: '+' + vol})};
	this.status.volumeDown = function (vol) {return obj.request('status', {command: 'volume', val: '-' + vol})};
	this.status.fullscreen = this.request.bind(this, 'status', {command: 'fullscreen'});
	this.status.seekUp = function (value) {return obj.request('status', {command: 'seek', val: '+' + value})};
	this.status.seekDown = function (value) {return obj.request('status', {command: 'seek', val: '-' + value})};
	
	this.status.togglePause = function(){
		if(obj.status.data && obj.status.data.state === 'playing'){
			return obj.status.pause();
		}
		else{
			return obj.status.play();
		}
	};

	//Playlist specific
	this.playlist.next = this.request.bind(this, 'status', {command: 'pl_next'});
	this.playlist.previous = this.request.bind(this, 'status', {command: 'pl_previous'});
	this.playlist.empty = this.request.bind(this, 'status', {command: 'pl_empty'});
	this.playlist.random = this.request.bind(this, 'status', {command: 'pl_random'});
	this.playlist.loop = this.request.bind(this, 'status', {command: 'pl_loop'});
	this.playlist.repeat = this.request.bind(this, 'status', {command: 'pl_repeat'});
	this.playlist.add = function (pl_list) {return obj.request('status', {command: 'in_play', input: pl_list})};
	this.status.sort = function (mode) {return obj.request('status', {command: 'pl_sort', id: 0, val: mode})};
	
	this.status.forceUpdate();
}

// Base vlc api request.
Client.prototype.request = function (resource, opts) {
	var client = this;
	var reqUrl = url.resolve(this._base, util.format('/requests/%s.json', resource))
	if(opts.command != "status"){
		reqUrl = reqUrl + url.format({query:opts})
	}

	var promise = QHttp.request({
		url: reqUrl,
		headers: {
			'Authorization' : this._authHeader
		}
	})
	.catch(function(){
					console.log('VLC is not reachable! Check your configuration!')})
	.then(function(res){return res.body.read()})
	.then(function(data){client.status.data = JSON.parse(data.toString());});

	return promise;
}
