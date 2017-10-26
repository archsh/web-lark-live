/* Main APP JS */

function build_catalog_url(host, port) {
    return '../../epgloader/' + host + '/' + port + '/vodEPG/jsonp/GetMenuDataAction.action?parentId=0&token=' + Date.now();
}

function build_detail_url(host, port, pid, cnt) {
    // http://stb-epg.tv-cloud.cn:7070/vodEPG/jsonp/GetMoviesByProgramId.action?pid=2000002328&count=20&taxis=asc
    // http://stb-epg.tv-cloud.cn:7070//vodEPG/jsonp/GetVarietyDetail.action?pid=988155&taxis=asc
    return '../../epgloader/' + host + '/' + port + '/vodEPG/jsonp/GetMoviesByProgramId.action?pid=' + pid + '&count=' + cnt + '&taxis=asc';
}

function get_location(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
}

function build_play_url(host, port, uri) {
    l = get_location(uri);
    return '../../hlsplayer/' + host + '/' + port + '/' + l.pathname;
}

var vod_player = new Vue({
    el: '#vod-player',
    data: {
        title: '影视点播预览',
        player: undefined,
        all_places: all_places,
        catalogs: Array,
        movies: Array,
        dataTable: undefined,
        totalCount: 0,
        totalPages: 0,
        current_category: Object,
        current_movie: undefined,
        current_playing: undefined,
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
            console.log("Syncing Channels ...");
            $.getJSON(build_catalog_url(this.current_epg.host, this.current_epg.port), function (data) {
                that.catalogs = data.menus;
                $.notify({
                    icon: "informations",
                    message: "栏目数据从" + that.current_epg.host + ':' + that.current_epg.port + "同步完成。"

                }, {
                    type: "success",
                    timer: 2000,
                    placement: {
                        from: 'bottom',
                        align: 'right'
                    }
                });
                that.change_category(that.catalogs[0]);
            }).fail(function () {
                $.notify({
                    icon: "warning",
                    message: "栏目数据同步失败。请检查相关服务器：<b>" + that.current_epg.host + ':' + that.current_epg.port + "</b>。"

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
        show_details: function(pid) {
            var that = this;
            this.current_movie = undefined;
            $.notify({
                // icon: "informations",
                message: "影片详情从" + that.current_epg.host + ':' + that.current_epg.port + "读取中……"

            }, {
                type: "info",
                timer: 500,
                placement: {
                    from: 'bottom',
                    align: 'left'
                }
            });
            $.getJSON(build_detail_url(this.current_epg.host, this.current_epg.port, pid, 100), function (data) {
                that.current_movie = data;
                // console.log('Movie Details:', data);
                $.notify({
                    icon: "informations",
                    message: "影片详情从" + that.current_epg.host + ':' + that.current_epg.port + "读取完成。"

                }, {
                    type: "success",
                    timer: 1000,
                    placement: {
                        from: 'bottom',
                        align: 'right'
                    }
                });
                $("#MovieDetailsModal").modal({keyboard:false});
                $('#show_tab_details').tab('show');
            }).fail(function () {
                $.notify({
                    icon: "warning",
                    message: "影片详情读取失败。请检查相关服务器：<b>" + that.current_epg.host + ':' + that.current_epg.port + "</b>。"

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
        get_movies: function () {
            var that = this;
            if (this.dataTable) {
                this.dataTable.ajax.reload();
            } else {
              var col_render = function ( data, type, row, meta ) {
                return '<a v-on:click="show_details('+row.pid+')" href="#details:'+row.pid+'" data-toggle="modal" data-target="#MovieDetails">'+data+'</a>';
              };
                var dtable = $('#datatables').DataTable({
                    pagingType: "full_numbers",
                    // scrollY: 400,
                    lengthMenu: [
                        [20, 40, 100],
                        [20, 40, 100]
                    ],
                    ordering: false,
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "按片名搜索",
                        sProcessing: "加载中...",
                        sLengthMenu: "显示 _MENU_ 项结果",
                        sZeroRecords: "没有匹配结果",
                        sInfo: "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                        sInfoEmpty: "显示第 0 至 0 项结果，共 0 项",
                        sInfoFiltered: "(由 _MAX_ 项结果过滤)",
                        sInfoPostFix: "",
                        // sSearch: "搜索:",
                        sUrl: "",
                        sEmptyTable: "栏目数据为空",
                        sLoadingRecords: "载入中...",
                        sInfoThousands: ",",
                        oPaginate: {
                            sFirst: "首页",
                            sPrevious: "上页",
                            sNext: "下页",
                            sLast: "末页"
                        },
                        oAria: {
                            sSortAscending: ": 以升序排列此列",
                            sSortDescending: ": 以降序排列此列"
                        }
                    },
                    processing: true,
                    serverSide: true,
                    ajax: function (data, callback, settings) {
                        $.get('../../epgloader/' + that.current_epg.host + '/' + that.current_epg.port + '/vodEPG/jsonp/SearchProgramByMovieClassify.action', {
                            cid: that.current_category.id,
                            currentPage: data.start / data.length + 1,
                            pageSize: data.length,
                            taxis: 'asc',
                            countRecord: 500,
                            startRecord: 0,
                            types: data.search.value ? 'programname:' + data.search.value : ""
                        }, function (res) {
                            callback({
                                recordsTotal: res.totalCount,
                                recordsFiltered: res.totalCount,
                                data: res.movieInfoProxy.programs
                            });
                        });
                    },
                    columns: [{data: "pid", orderable: false},
                        {data: "programname", orderable: false},
                        {data: "remark", orderable: false},
                        {data: "movieclass", orderable: false},
                        {data: "years", orderable: false},
                        {data:null, orderable: false, render: function(){
                            return '<button class="btn btn-sm btn-info btn-just-icon btn-simple btn-fab btn-fab-mini"><i class="material-icons">launch</i></button>';
                        }}]
                });
                this.dataTable = dtable;
                dtable.on( 'click', 'button', function () {
                    var data = dtable.row($(this).parents('tr')).data();
                    // console.log(data);
                    that.show_details(data.pid);
                    // return false;
                });
                $('.card .material-datatables label').addClass('form-group');
            }
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
        change_category: function (cata) {
            this.current_category = cata;
            this.get_movies();
        },
        play_movie: function(movie) {
            console.log('Playing:', movie);
            this.current_playing = movie;
            if (Hls.isSupported()) {
                $('#show_tab_playing').tab('show');
                if (this.player) {
                    this.player.destroy();
                }
                var video = document.getElementById('Hvideo');
                var hls = new Hls();
                var that = this;
                var full_url = build_play_url(this.current_lvs.host, this.current_lvs.port, movie.guid);
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
                $.notify({
                    icon: "warning",
                    message: "播放错误：<b>HLS Not Supported!</b>。"

                }, {
                    type: "warning",
                    timer: 3000,
                    placement: {
                        from: 'bottom',
                        align: 'right'
                    }
                });
            }
        },
    },
});

$(document).ready(function () {
    vod_player.getCatalogs();
    $('#MovieDetailsModal').on('hidden.bs.modal', function (e) {
        if(vod_player.player){
            vod_player.player.destroy();
            vod_player.player = undefined;
        }
    })
});
