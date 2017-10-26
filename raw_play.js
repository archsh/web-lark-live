/* Main APP JS */

var hlsplayer = new Vue({
    el: '#hls-player',
    data: {
        title: '运维直播预览',
        player: undefined,
        all_places: all_places,
        all_channels: all_channels,
        current_place: all_places[0],
        current_server: all_places[0].servers[0],
        current_source: all_channels[0],
        current_channel: all_channels[0].channels[0],
        message: '',
        filterString: '',
    },
    computed: {
        livePlayURL: function () {
            return '../../hlsplayer/' + this.current_server.host + '/' + this.current_server.port + this.current_channel.uri;
        },
        liveOriginalURL: function () {
            return 'http://' + this.current_server.host + ':' + this.current_server.port + this.current_channel.uri;
        },
        filterChannels: function() {
            s = this.filterString;
            console.log('Filter:>', s);
            //var cs =  this.current_source.channels.sort(function(a,b){
            //    if (a.name > b.name ){
            //        return 1;
            //    }else{
            //        return 0;
            //    }
            //});
            var cs = this.current_source.channels;
            rs = cs.filter(function(obj){
                if (s == ''){
                    return true;
                }else if(obj.name.indexOf(s,0) >= 0){
                    return true;
                }
                return false;
            });
            console.log('Result:>', rs);
            return rs;
        },
        
    },
    watch: {
        message: function (msg) {
            this.message = msg;
        },
    },
    methods: {
        change_place: function (place) {
            // alert(place);
            this.current_place = place;
            this.current_server = place.servers[0];
        },
        change_host: function (svr) {
            // alert(host);
            this.current_server = svr;
        },
        change_source: function (source) {
            // alert(source);
            this.current_source = source;
        },
        switch_channel: function (channel) {
            // alert(channel);
            this.current_channel = channel;
            if (Hls.isSupported()) {
                if (this.player) {
                    this.player.destroy();
                }
                var video = document.getElementById('Hvideo');
                var hls = new Hls();
                var that = this;
                var full_url = '../../hlsplayer/' + this.current_server.host + '/' + this.current_server.port + this.current_channel.uri;
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
                    this.message += '\n' + data.type + ':' + data.details;
                    // console.log(event);
                    // console.log(data);
                    $.notify({
                        icon: "warning",
                        message: "播放错误：<b>" + data.type + data.details + "</b>。"

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
                // this.message = 'HLS Not Supported!';
                $.notify({
                    icon: "danger",
                    message: "播放错误：<b> HLS Not Supported! </b>。"

                }, {
                    type: "danger",
                    timer: 3000,
                    placement: {
                        from: 'bottom',
                        align: 'right'
                    }
                });
            }
        }
    },

});

hlsplayer.switch_channel(all_channels[0].channels[0]);
console.log('Go......');
