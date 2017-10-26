/* Main APP JS */

function build_catalog_url(host, port) {
    return '../../epgloader/' + host + '/' + port + '/liveEPG/liveChannels.json?token=' + Date.now();
}

function build_epg_event_url(host, port, dateday, chnId) {
    return '../../epgloader/' + host + '/' + port + '/liveEPG/jsonp/GetMovieList.action?curdate=' + dateday + '&catalogid=' + chnId + '&sort=asc&isCache=true'
}

function build_dateinfo_url(host, port) {
    return '../../epgloader/' + host + '/' + port + '/liveEPG/jsonp/GetDateInfo.action?days=7&token=' + Date.now();
}

function build_play_url(host, port, uri) {
    return '../../hlsplayer/' + host + '/' + port + '/' + uri;
}

function get_days() {
    myDate = Date.now();

}

var epg_player = new Vue({
    el: '#epg-player',
    data: {
        title: '直播回看预览',
        player: undefined,
        all_places: all_places,
        catalogs: Array,
        days: Object,
        current_playing: Object,
        events: Object,
        current_channel: undefined,
        current_place: all_places[0],
        current_epg: all_places[0].epg_servers[0],
        current_lvs: all_places[0].lvs_servers[0],
    },
    computed: {
        livePlayURL: function () {
            return 'http://' + this.current_host + ':' + this.current_channel.liveport + this.current_channel.liveurl;
        },
        allCatalogs: function () {
            return this.catalogs;
        },
    },
    watch: {
        catalogs: function (v) {
            // console.log(v);
        }
    },
    methods: {
        getCatalogs: function () {
            var that = this;
            that.catalogs = Array;
            // that.days = Object;
            console.log("Syncing Channels ...");
            $.getJSON(build_catalog_url(this.current_epg.host, this.current_epg.port), function (data) {
                // this.$set(this.catalogs, 'list', data.catalog);
                that.catalogs = data.catalog;
                // console.log(that.catalogs);
                // $.each(that.catalogs, function(idx, cata){
                // 	console.log(idx, cata.catalogname);
                // });
                $.notify({
                    icon: "informations",
                    message: "频道数据从" + that.current_epg.host + ':' + that.current_epg.port + "同步完成。"

                }, {
                    type: "success",
                    timer: 2000,
                    placement: {
                        from: 'bottom',
                        align: 'right'
                    }
                });
                that.switch_channel(that.catalogs[0].secondChannel[0]);
            }).fail(function () {
                $.notify({
                    icon: "warning",
                    message: "频道数据同步失败。请检查相关服务器：<b>" + that.current_epg.host + ':' + that.current_epg.port + "</b>。"

                }, {
                    type: "warning",
                    timer: 3000,
                    placement: {
                        from: 'bottom',
                        align: 'right'
                    }
                });
            });
        },
        change_place: function (place) {
            this.current_place = place;
            this.current_lvs = place.lvs_servers[0];
            this.current_epg = place.epg_servers[0];
            this.getCatalogs();
        },
        change_lvs: function (lvs) {
            this.current_lvs = lvs;
        },
        change_epg: function (epg) {
            this.current_epg = epg;
            this.getCatalogs();
        },
        play_tv_event: function (evt) {
            var that = this;
            this.current_playing.eventname = evt.moviename;
            this.current_playing.url = evt.netaddress;
            if (Hls.isSupported()) {
                if (this.player) {
                    this.player.destroy();
                    console.log('Previous HLS destroyed!!!!!');
                }
                var video = document.getElementById('Hvideo');
                var hls = new Hls();
                var that = this;
                var full_url = build_play_url(this.current_lvs.host, this.current_lvs.port, this.current_playing.url);
                console.log('Full URL:' + full_url);
                hls.loadSource(full_url);
                hls.attachMedia(video);
                this.player = hls;
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    video.play();

                });
                hls.on(Hls.Events.ERROR, function (event, data) {
                    var errorType = data.type;
                    var errorDetails = data.details;
                    var errorFatal = data.fatal;
                    $.notify({
                        icon: "warning",
                        message: "播放错误：<b>" + that.current_lvs.host + ':' + that.current_lvs.port + that.current_playing.url + "</b>。"

                    }, {
                        type: "warning",
                        timer: 3000,
                        placement: {
                            from: 'bottom',
                            align: 'right'
                        }
                    });
                });
            } else {
                this.message = 'HLS Not Supported!';
            }

        },
        switch_channel: function (channel) {
            var that = this;
            this.current_channel = channel;
            this.current_playing = Object;
            this.events = Object;
            full_url = build_play_url(this.current_lvs.host, this.current_lvs.port, this.current_channel.hiscatalogpicurl1);
            this.days = Object;
            this.current_playing = {
                catalogid: channel.catalogid,
                catalogname: channel.catalogname,
                eventname: 'LIVE',
                url: channel.hiscatalogpicurl1,
            };
            // fetch(build_dateinfo_url(this.current_epg.host, this.current_epg.port))
            // .then(function(resp){
            // 	resp.json().then(
            // 		function(data){
            // 			that.days = data.timeInfo;
            // 			console.log("Days:", that.days);
            // 		}
            // 	);
            // },function(resp){
            // 	console.log(resp.text);
            // }).catch(function(err){
            // 	console.log(err);
            // });

            // for() {
            //
            // }

            $.getJSON(build_dateinfo_url(this.current_epg.host, this.current_epg.port), function (data) {
                that.days = data.timeInfo;
                $.each(that.days.weekDate, function (idx, dday) {
                    // console.log(dday);
                    $.getJSON(build_epg_event_url(that.current_epg.host, that.current_epg.port, dday[1], that.current_playing.catalogid), function (evtdata) {
                        that.events[dday[1]] = evtdata.movie;
                        console.log(that.events);
                        that.$forceUpdate();
                    });
                });
            });

            if (Hls.isSupported()) {
                if (this.player) {
                    this.player.destroy();
                    console.log('Previous HLS destroyed!!!!!');
                }
                var video = document.getElementById('Hvideo');
                var hls = new Hls();
                var that = this;
                // var full_url = 'hlsplayer/'+this.current_host+'/'+this.current_channel.liveport+this.current_channel.liveurl;
                console.log('Full URL:' + full_url);
                // this.message += '\n Loading: '+full_url;
                hls.loadSource(full_url);
                hls.attachMedia(video);
                this.player = hls;
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    video.play();

                });
                hls.on(Hls.Events.ERROR, function (event, data) {
                    var errorType = data.type;
                    var errorDetails = data.details;
                    var errorFatal = data.fatal;
                    // this.message += '\n' + data.type + ':' + data.details;
                    // console.log(event);
                    // console.log(data);
                    $.notify({
                        icon: "warning",
                        message: "播放错误：<b>" + that.current_lvs.host + ':' + that.current_lvs.port + that.current_channel.hiscatalogpicurl1 + "</b>。"

                    }, {
                        type: "warning",
                        timer: 3000,
                        placement: {
                            from: 'bottom',
                            align: 'right'
                        }
                    });
                });
            } else {
                this.message = 'HLS Not Supported!';
            }
        },
        load_tv_events: function (dateday) {
            var that = this;
            $.notify({
                icon: "informations",
                message: "Loading: <b>" + that.current_epg.host + ':' + that.current_epg.port + '/' + that.current_channel.catalogid + '?day=' + dateday + "</b>。"

            }, {
                type: "info",
                timer: 2000,
                placement: {
                    from: 'bottom',
                    align: 'right'
                }
            });
        }
    },
});

epg_player.getCatalogs();
