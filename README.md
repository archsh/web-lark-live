# WEB LARK - Utilities on WEB

## Deploy (Nginx)

1. Copy the full directory into a path, eg: /data/web-lark;

2. Configure nginx, add locations into server config:

```
######## WEB LARK Configuration ################################################################
location /lark {
        alias /export/data/htmldocs/web-lark;
        index index.html index.htm;
}

location ~ /lark/hlsplayer/([0-9.a-z]+)/([0-9]+)/(.*)$ {
        rewrite ^/lark/hlsplayer/([0-9.a-z]+)/([0-9]+)/(.*)$ /$3 break;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_cache_key $3;
        proxy_cache cache_live;
        proxy_cache_valid  3s;
        proxy_cache_lock on;
        proxy_cache_lock_timeout 5s;
        proxy_pass http://$1:$2;
        proxy_intercept_errors on;
        error_page 301 302 307 = @handle_redirect;
}
location ~ /lark/epgloader/([0-9.a-z]+)/([0-9]+)/(.*)$ {
        rewrite ^/lark/epgloader/([0-9.a-z]+)/([0-9]+)/(.*)$ /$3 break;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_pass http://$1:$2;
        proxy_intercept_errors on;
        error_page 301 302 307 = @handle_redirect;
}
location @handle_redirect {
        set $saved_redirect_location '$upstream_http_location';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_cache_key $uri;
        proxy_cache cache_live;
        proxy_cache_valid  3s;
        proxy_cache_lock on;
        proxy_cache_lock_timeout 5s;
        proxy_pass $saved_redirect_location;
 }

```

## Access:

Open your browser to access: `http://IPADDR:PORT/lark/`


## Enjoy.