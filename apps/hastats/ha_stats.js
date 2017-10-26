/**//* Main APP JS */

var hastats = new Vue({
    el: '#ha-stats',
    data: {
        title: '调度状态查看',
        all_places: all_places,
        current_place: all_places[0],
        current_server: all_places[0].servers[0],
    },
    computed: {
        statsUri: function() {

        },
    },
    watch: {
        
    },
    methods: {
        change_place: function (place) {
            // alert(place);
            this.current_place = place;
            this.current_server = place.servers[0];
            this.change_server(place.servers[0]);
        },
        change_server: function (svr) {
            // alert(host);
            this.current_server = svr;
            srcuri = "../../haadmin/"+svr.host+"/"+svr.port+svr.uri;
            console.log("SRC:>", "../../haadmin/"+svr.host+"/"+svr.port+svr.uri);
            $("#contentframe").attr("src",srcuri);
        },
    }

});

hastats.change_place(all_places[0]);