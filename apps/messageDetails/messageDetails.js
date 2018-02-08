define([
    'Http',
    'config',
    'TemplateProxy',
    'text!apps/messageDetails/details.html',
    'text!apps/download.html',
    'Utils',
    'cookie'
], function (http, config, tplProxy, tpl, downloadTpl, utils, cookie) {
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
            if(!$.cookie('token')){
              tplProxy.html.call(that.option.downloadDom, downloadTpl, {}, {config: config, $:$});
            }
            return that._render();
        },
        option: {
          //hash参数
          urlParams: {},
          //认证详情Url
          CERTIFIED_DETAILS_URL: "../../apps/certifiedDetails/certifiedDetails.html?enterpriseId=",
          //消息详情接口地址
          ENTERPRISE_MESSAGE_ADDRESS: config.FANS_BASE_URL + 'zhsapp/pushtask/detail',
          //内容
          dom:  $('.content'),
          //标题
          headerDom: $("header"),
          //提示下载
          downloadDom: $(".download")
        },
        /**
         * 渲染消息详情
         * */
        _render: function(urlParams) {
            var that = this;
            var option = that.option;
            //获取消息详情
            http.get(option.ENTERPRISE_MESSAGE_ADDRESS, {
                data: {
                    pushTaskId: option.urlParams.pushTaskId
                },
                success: function (res) {
                    res.data.CERTIFIED_DETAILS_URL = option.CERTIFIED_DETAILS_URL + res.data.base.fkEnterpriseId;
                    tplProxy.html.call(option.dom, tpl, res.data, {config: config, $:$});
                }
            });
            return that;
        }
    };
})
;