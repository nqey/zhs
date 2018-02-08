define([
    'Http',
    'config',
    'TemplateProxy',
    'text!apps/goodsCertified/header.html',
    'text!apps/goodsCertified/footer.html',
    'text!apps/goodsCertified/certified.html',
    'text!apps/goodsCertified/goods.html',
    'text!apps/download.html',
    'Utils',
    'cookie'
], function (http, config, tplProxy, headerTpl, footerTpl, certifiedTpl, goodsTpl, downloadTpl, utils, cookie) {
    'use strict'

    return {
        /**
         * 入口函数
         * */
        init: function () {
            var that = this;
            //获取Url参数里包含的查询信息列表
            that.option.urlParams = JSON.parse(decodeURIComponent((utils.getUrlParams().extra)));
            $(".common_cutOff").hide();
            //非APP进入显示下载提示
            if(!$.cookie('token')){
              var downloadtplProxy = tplProxy.getTemplate.call({}, downloadTpl, {}, {config: config, $:$});
              that.option.footerDom.append(downloadtplProxy);
            }
            return that._render()
                       ._renderEnterprise();
        },
        option: {
          //hash参数
          urlParams: null,
          //企业证书接口地址
          ENTERPRISE_LINCENSE_ADDRESS: config.ENTERPRISE_BASE_URL + 'zhsapp/enterprise/getlincense',
          //商品信息接口地址
          GOODS_BASE_ADDRESS: config.GOODS_BASE_URL + 'zhsapp/goods/getbase',
          //商品详情URL
          GOODS_DETAILS_URL: "../../apps/goodsDetails/goodsDetails.html?code=",
          //认证详情Url
          CERTIFIED_DETAILS_URL: "../../apps/certifiedDetails/certifiedDetails.html?enterpriseId=",
          //主题
          articleDom: $("article"),
          //页脚
          footerDom: $("footer"),
          //标题
          headerDom: $("header")
        },
        /**
         * 渲染主页面
         * */
        _render: function () {
            var that = this;
            var option = that.option;
            //取得渲染区域
            var data = {};
            //认证详情Url及参数设置
            data.CERTIFIED_DETAILS_URL = option.CERTIFIED_DETAILS_URL + option.urlParams.enterpriseId;
            //商品详情Url及参数设置
            data.GOODS_DETAILS_URL = option.GOODS_DETAILS_URL + option.urlParams.code;
            //页面跳转
            var template = tplProxy.getTemplate.call({}, footerTpl, data, {config: config, $:$});
            option.footerDom.append(template);
            return that;
        },
        /**
         * 渲染企业证书
         * */
        _renderEnterprise: function() {
            var that = this;
            var option = that.option;
            //获取企业证书
            http.get(option.ENTERPRISE_LINCENSE_ADDRESS, {
                data: {
                    enterpriseId: option.urlParams.enterpriseId
                },
                success: function (res) {
                    //企业
                    var certifiedTplProxy = tplProxy.getTemplate.call({}, certifiedTpl, res.data, {config: config, $:$});
                    option.articleDom.append(certifiedTplProxy);
                    //logo
                    var logoTplProxy = tplProxy.getTemplate.call({}, headerTpl, res.data, {config: config, $:$});
                    option.headerDom.append(logoTplProxy);
                    that._renderGoods();
                }
            });
            return that;
        },
        /**
         * 渲染商品信息
         * */
        _renderGoods: function() {
            var that = this;
            var option = that.option;
            //获取商品信息
            http.get(option.GOODS_BASE_ADDRESS, {
                data: {
                    code: option.urlParams.code
                },
                success: function (res) {
                    //商品
                    var goodsTplProxy = tplProxy.getTemplate.call({}, goodsTpl, res.data, {config: config, $:$});
                    option.articleDom.append(goodsTplProxy);
                     $(".common_cutOff").show();
                }
            });
            return that;
        }
    };
})
;