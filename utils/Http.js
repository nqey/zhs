/**
 * Created by liyin 2017年11月25日 09:45:06
 */
define(['jquery', 'Cache', 'Utils', 'config'], function ($, cacheUtils, utils, config) {

    return {
        options: {
            type: 'GET',
            dataType: 'json',
            /**异步加载*/
            async: true,
            /**超时时间10秒*/
            timeout: 10000,
            /**允许带cookie跨域*/
            xhrFields: {
                withCredentials: true
            }
        },
        _checkLogin: function (code) {
            if (code == '401') {
                var href = window.location.href;
                window.location.replace("./login.html?redirect=" + encodeURIComponent(href));
                return false;
            }
            return true;
        },
        /**
         * 调用ajax，get，post提供参数：
         * @param : url - 调用接口地址
         * @param : opt
         *      success: 调用成功回调;
         *      error: 调用失败时候回调;
         *      cache: 是否讲请求的数据缓存,默认不缓存;
         *      cacheTimeout: 缓存数据失效时间(单位秒), 默认1小时;
         *      data : 请求接口参数;
         *      test : 模拟测试，不发起真正的HTTP请求，那直接返回成功，但没有任何数据返回，需要开发者自行写打桩数据
         */
        ajax: function (url, opt) {
            opt = $.extend({domain: config.DOMAIN}, this.options, opt);
            opt.data = opt.data || {};
            /*允许跨域带cookie*/
            opt.xhrFields = {withCredentials: true};
            opt.traditional = true;
            opt.timeout = opt.timeout || 30000;

            var that = this,
                success = opt.success || function () {},
                error = opt.error || function () {},
                cache = opt.cache || false,
                key = cache && (location.href + '_' + url + '_' + utils.toQueryString(opt.data));

            if (cache) {
                var data = cacheUtils.getValue(key)
                /*先从缓存里面取, 如果取到就直接返回,没取到就发起http请求去取,再存入*/
                if (data != null) {
                    success(data);
                    return;
                }
            }

            opt.success = function (res) {
                /*未登录,跳转到登录页面*/
                if (!that._checkLogin(res.code)) {
                    return;
                }

                if (res.success) {
                    /*如果设置了缓存就把数据存入缓存*/
                    if (cache) {
                        cacheUtils.setValue(key, res, opt.cacheTimeout > 0 ? opt.cacheTimeout : 3600);
                    }
                    success(res);
                } else {
                    error(res);
                }
            };

            opt.error = function (XMLHttpRequest, textStatus, errorThrown) {
                if (error && typeof error === "function") {
                    error(XMLHttpRequest, textStatus, errorThrown)
                } else {
                    error(XMLHttpRequest.responseJSON);
                }
            }

            if (opt.test) {
                success();
            } else {
                $.ajax(url, opt);
            }
        },
        get: function (url, opt) {
            opt.type = 'GET';
            this.ajax(url, opt);
        },
        post: function (url, opt) {
            opt.type = 'POST';
            this.ajax(url, opt);
        },
        postWithFiles: function (url, files, opt) {
            opt = $.extend({}, this.options, opt);
            opt.data = opt.data || {};

            if (opt.test) {
                return opt.success();
            }

            var that = this,
                xhr = new XMLHttpRequest(),
                formData = new FormData(),
                success = opt.success || function () {
                    },
                error = opt.error || function () {
                    };

            xhr.open("post", url, true);
            xhr.withCredentials = true;
            //可以设置自定义标头
            files.each(function () {
                var name = $(this).attr("name");
                $.each(this.files, function () {
                    formData.append(name, this);
                })
            });

            $.each(opt.data, function (key, value) {
                switch ($.type(value)) {
                    case "array":
                        $.each(value, function (index, d) {
                            formData.append(key, d);
                        })
                        break;
                    case "object":
                        $.each(value, function (_key, d) {
                            formData.append(_key, d);
                        })
                        break;
                    default:
                        formData.append(key, value);
                        break;
                }
            });

            xhr.send(formData);

            xhr.onload = function (e) {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var result = xhr.responseText;
                    if (typeof result == "string") {
                        result = JSON.parse(result);
                    }

                    /*未登录,跳转到登录页面*/
                    if (!that._checkLogin(result.code)) {
                        return;
                    }
                    success(result);
                }
            }
            xhr.ontimeout = error;
            xhr.onerror = error;
            // xhr.upload.onprogress = function(e) { ... };
        }
    }
});


