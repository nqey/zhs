/**
 * Created by liyin 2017年12月14日 16:11:18
 */
define(['jquery'], function ($) {


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    return {
        dateFormat: function (date, fmt) {
            fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
            return new Date(date).Format(fmt);
        },
        toQueryString: function (data) {
            var queryString = [];
            switch ($.type(data)) {
                case "array":
                    $.each(data, function (index, value) {
                        var d = $.toQueryString(value);
                        if (d && d !== 0) {
                            queryString.push(d);
                        }
                    })
                    break;
                case "object":
                    $.each(data, function (key, value) {
                        switch ($.type(value)) {
                            case "array":
                                $.each(value, function (i, v) {
                                    (v != null || v !== "") && queryString.push(key + "=" + v);
                                })
                                break;
                            case "object":
                                $.each(value, function (i, v) {
                                    (v != null || v !== "") && queryString.push(i + "=" + v);
                                })
                                break;
                            case "function":
                            case "undefined":
                            case "error":
                            case "regexp":
                                break;
                            default:
                                (value != null || value !== "") && queryString.push(key + "=" + value);
                                break;
                        }
                    });
                    break;
                case "function":
                case "undefined":
                case "error":
                case "regexp":
                    return "";
                default:
                    return data;
            }
            return queryString.join("&");
        },
        getUrlParams: function () {
            var search = window.location.search,
                r = {};
            if (!search || search.length < 3) {
                return r;
            }
            $.each(search.slice(1, search.length).split("&"), function (i, k) {
                var p = k.split("="),
                    key = p[0],
                    value = p[1];
                if (value) {
                    if (r[key] != null) {
                        r[key] = [value].concat(r[key]);
                    } else {
                        r[key] = value;
                    }
                }
            })
            return r;
        },
        getUrlHashParams: function () {
            var searchsplits = window.location.href.split("?"),
                search = searchsplits.length > 1 ? searchsplits[1] : ''
            r = {};
            if (!search || search.length < 3) {
                return r;
            }
            $.each(search.slice(0, search.length).split("&"), function (i, k) {
                var p = k.split("="),
                    key = p[0],
                    value = p[1];
                if (value) {
                    if (r[key] != null) {
                        r[key] = [value].concat(r[key]);
                    } else {
                        r[key] = value;
                    }
                }
            })
            return r;
        },
        addUrlHashParams: function (params) {
            return this.setUrlHashParams($.extend(this.getUrlHashParams(), params));
        },
        setUrlHashParams: function (params) {
            var queryString = this.toQueryString(params);
            if (queryString) {
                queryString = "?" + queryString;
            }
            history.replaceState(null, document.title, location.pathname + location.hash.split('?')[0] + queryString);
            return this;
        },
        scrollTo: function (target) {
            var _t = $(target);
            scrollTo(0, _t.offset().top - document.body.clientHeight / 2);
            _t.focus();
            return this;
        },
        length: function (data) {
            data = data || '';
            if ($.type(data) == 'object') {
                var i = 0;
                $.each(data, function () {
                    i++;
                })
                return i;
            } else {
                return data.length;
            }
        },
        download: function (url, data) {
            var tempForm = document.createElement("form");
            tempForm.id = "tempForm1";
            tempForm.method = "post";
            tempForm.action = url;
            tempForm.target = "下载";
            function _appendNode(key, value) {
                var hideInput = document.createElement("input");
                hideInput.type = "hidden";
                hideInput.name = key;
                hideInput.value = value;
                tempForm.appendChild(hideInput);
            }

            if (data) {
                $.each(data, function (key, value) {
                    switch ($.type(value)) {
                        case "array":
                            $.each(value, function (i, v) {
                                _appendNode(key, v);
                            });
                            break;
                        case "object":
                            $.each(value, function (i, v) {
                                _appendNode(i, v);
                            });
                            break;
                        case "function":
                        case "undefined":
                        case "error":
                        case "regexp":
                            break;
                        default:
                            _appendNode(key, value);
                            break;
                    }
                })
            }
            document.body.appendChild(tempForm);
            tempForm.submit();
            document.body.removeChild(tempForm);
            return this;
        },
    }
});


