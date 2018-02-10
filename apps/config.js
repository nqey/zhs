define('config', [], function () {
    var __localUrl = '.test.com',
        __test = (function () {
            return (/lhxmlly.6655.la/.test(window.location.hostname) || /lh-xm.com/.test(window.location.hostname) || /test.com/.test(window.location.hostname)) ? 'test'
                : (/cpsdb.com/.test(window.location.hostname) ? 'online' : 'local')
        })(),
        __quality = {
            s: "25",
            m: '50',
            x: '75'
        };
    return {
        /**
         * 获取图片的全路径
         * @param url ： 图片地址
         * @param quality ： s-小图；m-中图；x-大图；不填-原图
         * @param size ： [height, width]
         */
        getPictureUrl: function (url, size) {
            if (typeof url == "string") {
                return this.IMAGE_SERVER_URL + url + (size ? ('?h=' + size[0] + '&w=' + size[1]) : '');
            }
        },
        /**
         * 获取视频的全路径
         * @param url ： 视频地址
         */
        getPictureVideoUrl: function (url) {
            //TODO:待完善
            if (typeof url == "string") {
                return this.VIDEO_SERVER_URL + url;
            } else {
                var r = [];
                $.each(url, function (k, v) {
                    r.push(this.VIDEO_SERVER_URL + v);
                })
                return r;
            }
        },
        /**
         * 判断浏览器内核
         * return 1:ios 2:android
         */
        androidOrIosSys: function () {
            var browser = {
                versions: function () {
                    var u = navigator.userAgent, app = navigator.appVersion;
                    return {// 移动终端浏览器版本信息
                        trident: u.indexOf('Trident') > -1, // IE内核
                        presto: u.indexOf('Presto') > -1, // opera内核
                        webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
                        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
                        mobile: !!u.match(/AppleWebKit.*Mobile.*/)
                        || !!u.match(/AppleWebKit/), // 是否为移动终端
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
                        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iPhone或者QQHD浏览器
                        iPad: u.indexOf('iPad') > -1, // 是否iPad
                        webApp: u.indexOf('Safari') == -1
                        // 是否web应该程序，没有头部与底部
                    };
                }(),
                language: (navigator.browserLanguage || navigator.language)
                    .toLowerCase()
            }
            if (browser.versions.ios || browser.versions.iPhone
                || browser.versions.iPad) {
                return 1;
            } else if (browser.versions.android) {
                return 2;
            }
        },
        ENTERPRISE_BASE_URL: (function () {
            switch (__test) {
                case 'test':
                    return '//ep.lh-xm.com/';
                case 'online':
                    return '//ep.cpsdb.com/';
                default :
                    return location.hostname.indexOf(__localUrl) >= 0
                        ? '//cps' + __localUrl + '/enterprise/'
                        : '//' + location.hostname + ':8080/enterprise/';
            }
        })(),
        GOODS_BASE_URL: (function () {
            switch (__test) {
                case 'test':
                    return '//g.lh-xm.com/';
                case 'online':
                    return '//g.cpsdb.com/';
                default :
                    return location.hostname.indexOf(__localUrl) >= 0
                        ? '//cps' + __localUrl + '/goods/'
                        : '//' + location.hostname + ':8080/goods/';
            }
        })(),
        FANS_BASE_URL: (function () {
            switch (__test) {
                case 'test':
                    return '//fans.lh-xm.com/';
                case 'online':
                    return '//fans.cpsdb.com/';
                default :
                    return location.hostname.indexOf(__localUrl) >= 0
                        ? '//cps' + __localUrl + '/fans/'
                        : '//' + location.hostname + ':8080/fans/';
            }
        })(),
        IMAGE_SERVER_URL: (function () {
            switch (__test) {
                case 'test':
                    return '//pic.lh-xm.com/';
                case 'online':
                    return '//pic.cpsdb.com/';
                default :
                    return '//pic.lh-xm.com/';
            }
        })(),
        VIDEO_SERVER_URL: (function () {
            switch (__test) {
                case 'test':
                    return '//video.lh-xm.com/';
                case 'online':
                    return '//video.cpsdb.com/';
                default :
                    return '//video.lh-xm.com/';
            }
        })(),
        DOMAIN: (function () {
            switch (__test) {
                case 'test':
                    return 'lh-xm.com';
                case 'online':
                    return 'cpsdb.com';
                default :
                    return 'test.com';
            }
        })()
    }
})