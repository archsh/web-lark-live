/* Data */

var all_places = [
    {
        place: '成都',
        epg_servers: [
            {host: '10.255.199.60', port: 7070},
            {host: '10.255.199.130', port: 7070},
            {host: '10.255.199.3', port: 7081},
            {host: '10.255.199.4', port: 7081},
            {host: '10.255.199.5', port: 7081},
            {host: '10.255.199.6', port: 7081},
            {host: '10.255.199.3', port: 8081},
            {host: '10.255.199.4', port: 8081},
            {host: '10.255.199.86', port: 8081},
            {host: '10.255.199.86', port: 7081},
        ],
        lvs_servers: [
            {host: '10.255.199.60', port: 1220},
            {host: '10.255.199.130', port: 1220},
            {host: '10.255.196.15', port: 1220},
            {host: '10.255.196.16', port: 1220},
            {host: '10.255.196.21', port: 1280},
            {host: '10.255.196.22', port: 1280},
            {host: '10.255.196.23', port: 1280},
            {host: '10.255.196.24', port: 1280},
            {host: '10.255.196.25', port: 1280},
            {host: '10.255.97.19', port: 1208},
            {host: '10.255.97.20', port: 1208},
            {host: '10.255.97.21', port: 1208},
            {host: '10.255.97.22', port: 1208},
            {host: '10.255.97.23', port: 1208},
            {host: '10.255.97.24', port: 1208},
            {host: '10.255.196.11', port: 1220},
        ]
    },
    {
        place: '科大',
        epg_servers: [
            {host: '10.235.1.26', port: 7081},
        ],
        lvs_servers: [
            {host: '10.235.1.26', port: 1220},
        ]
    },
    {
        place: '武汉',
        epg_servers: [
            {host: '172.15.2.243', port: 7070},
            {host: '172.15.2.244', port: 7091},
            {host: '172.15.2.244', port: 7081},
            {host: '172.15.2.245', port: 7081},
            {host: '172.15.2.245', port: 7091},
        ],
        lvs_servers: [
            {host: '172.15.2.243', port: 1220},
        ]
    },
    {
        place: '昆明',
        epg_servers: [
            {host: '101.36.101.20', port: 7070},
            {host: '101.36.101.28', port: 7880},
            {host: '101.36.101.28', port: 7081},
            {host: '101.36.101.27', port: 7880},
            {host: '101.36.101.27', port: 7081},

        ],
        lvs_servers: [
            {host: '101.36.101.30', port: 1220},
        ]
    },
    {
        place: '重庆',
        epg_servers: [
            {host: '101.36.99.139', port: 7070},
            {host: '101.36.99.131', port: 7081},
            {host: '101.36.99.132', port: 7081},
        ],
        lvs_servers: [
            {host: '101.36.99.139', port: 1220},
        ]
    },
    {
        place: '贵阳',
        epg_servers: [
            {host: '172.20.1.78', port: 7070},
            {host: '172.20.1.79', port: 7070},
            {host: '172.20.1.78', port: 7780},
            {host: '172.20.1.79', port: 7780},
        ],
        lvs_servers: [
            {host: '172.20.1.78', port: 1220},
        ]
    },
    {
        place: '长沙',
        epg_servers: [
            {host: '172.21.1.136', port: 7070},
            {host: '172.21.1.131', port: 7081},
            {host: '172.21.1.132', port: 7081},
        ],
        lvs_servers: [
            {host: '172.21.1.136', port: 1220},
        ]
    },
];