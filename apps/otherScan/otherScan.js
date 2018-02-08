define([
    'Http',
    'config',
    'TemplateProxy',
    'text!apps/otherScan/details.html',
    'text!apps/otherScan/desciption.html',
    'text!apps/download.html',
    'text!apps/otherScan/logo.html',
    'Utils',
    'cookie'
], function (http, config, tplProxy, tpl, tplD, downloadTpl, logoTpl, utils, dialog, cookie) {
    'use strict'
    return {
        /**
         * 入口函数
         * */
        init: function () {
            var that = this;
            //获取Url参数里包含的查询信息列表
            that.option.urlParams = utils.getUrlParams();
            //非APP进入显示下载提示
            tplProxy.html.call(that.option.downloadDom, downloadTpl, {}, {config: config, $:$});
            return that._render();
        },
        option: {
          //hash参数
          urlParams: null,
          //商品详细接口地址
          GOODS_DETAILS_ADDRESS: config.GOODS_BASE_URL + 'publics/goods/other/getbase',
          //数据加载渲染区域
          detailsDom: $('.os-content'),
          desciptionDom: $('.os-article'),
          downloadDom: $(".download"),
          logoDom: $(".logo")
        },
        /**
         * 渲染画面
         * */
        _render: function(urlParams) {
            var that = this;
            var option = that.option;
            //获取商品详细
            http.get(option.GOODS_DETAILS_ADDRESS, {
                data: {
                    code: option.urlParams.code || ""
                },
                success: function (res) {
                    var data = $.extend({}, res.data);
                    tplProxy.html.call(option.logoDom, logoTpl, data, {config: config, $:$});
                    tplProxy.html.call(option.detailsDom, tpl, data, {config: config, $:$});
                    tplProxy.html.call(option.desciptionDom, tplD, data, {config: config, $:$});
                },
                error:function(res) {
                  //商品详情请求失败
                  dialog.createTipBox({type:'error',str:res.message,hasBtn:false});
                }
            });
            return that;
        }
    };
})
;

