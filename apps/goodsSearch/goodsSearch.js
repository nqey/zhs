define([
    'Http',
    'config',
    'TemplateProxy',
    'text!apps/goodsSearch/message.html',
    'text!apps/download.html',
    'Utils',
    'dropload',
    'cookie'
], function (http, config, tplProxy, tpl, downloadTpl, utils, dropload, cookie) {
    'use strict'

    return {
        /**
         * 入口函数
         * */
        init: function () {
            var that = this;
            //获取Url参数里包含的查询信息列表
            that.option.urlParams = utils.getUrlParams();
            that.option.urlParams.page = that.option.urlParams.page || 0;
            that.option.urlParams.rows = that.option.urlParams.rows || 10;
            //非APP进入显示下载提示
            if(!$.cookie('token')){
              tplProxy.html.call(that.option.downloadDom, downloadTpl, {}, {config: config, $:$});
            }
            //设置检索信息
            if(that.option.urlParams.text){
              that.option.inputDom.val(decodeURI(that.option.urlParams.text));
            }
            return that._dropload()
            		   ._search();
        },
        option: {
          //hash参数
          urlParams: null,
          //商品详情Url
          GOODS_DETAILS_URL: "../../apps/goodsDetails/goodsDetails.html?skuId=",
          //商品检索接口地址
          GOODS_SEARCH_ADDRESS: config.GOODS_BASE_URL + "zhsapp/goods/search",
          //数据加载渲染区域
          dom:  $('.content'),
          //列表染区域
          listDom: $(".content .lists"),
          //检索
          searchDom: $("#search"),
          //检索区
          inputDom: $(".input-control"),
          dropload: null,
          downloadDom: $(".download")
        },
        /**
         * 检索函数
         * para1:success后执行函数
         * para2:error后执行函数
         * */
        _localHttp: function(callBack) {
            var that = this;
            var option = that.option;
            option.urlParams.name = option.inputDom.val();
            /*调用接口获取数据*/
            http.get(option.GOODS_SEARCH_ADDRESS, {
                data: {
                	text: that.option.inputDom.val(),
                    page: option.urlParams.page,
                    rows: option.urlParams.rows
                },
                success: function (res) {
                    if(res.data.length == 0){
                        // 锁定
                        option.dropload.lock();
                        // 无数据
                        option.dropload.noData();
                        // 每次数据加载完，必须重置
                        option.dropload.resetload();
                    } else {
                        //数据加工
                        res.data.forEach(function(d) {
                            d.imageList = JSON.parse(d.imageList);
                            d.url = option.GOODS_DETAILS_URL + d.skuId;
                        });
                        // 每次数据加载完，必须重置
                        option.dropload.resetload();
                        // 解锁
                        option.dropload.unlock();
                        option.dropload.noData(false);
                    }
                    //渲染画面
                    callBack(res.data);
                },
                error:function(res) {
                    // 锁定
                    option.dropload.lock();
                    // 无数据
                    option.dropload.noData();
                    // 即使加载出错，也得重置
                    option.dropload.resetload();
                }
            });
            return that;
        },
        _search: function() {
        	var that = this;
            var option = that.option;
        	option.searchDom.click(function() {
        		//回到第一页
                that.option.urlParams.page = 1;
                that._localHttp(function(data) {
                    if(data.length == 0) {
                       option.listDom.html("没有商品信息");
                    } else {
                       var template = tplProxy.getTemplate.call({}, tpl, data, {config: config, $:$});
                       option.listDom.html(template);
                    }
                });
        	});
        	return that;
        },
        _dropload: function() {
            var that = this;
            var option = that.option;
            var dropload = option.dom.dropload({
                scrollArea : window,
                domUp : {
                    domClass   : 'dropload-up',
                    domRefresh : '<div class="dropload-refresh"></div>',
                    domUpdate  : '<div class="dropload-update"></div>',
                    domLoad    : '<div class="dropload-load"><span class="loading"></span></div>'
                },
                domDown : {
                    domClass   : 'dropload-down',
                    domRefresh : '<div class="dropload-refresh"></div>',
                    domLoad    : '<div class="dropload-load"><span class="loading"></span></div>',
                    domNoData  : '<div class="dropload-noData"></div>'
                },
                loadUpFn : function(me){
                    option.dropload = me;
                    //回到第一页
                    option.urlParams.page = 1;
                    that._localHttp(function(data) {
                        if(data.length == 0) {
                           option.listDom.html("");
                        } else {
                           var template = tplProxy.getTemplate.call({}, tpl, data, {config: config, $:$});
                           option.listDom.html(template);
                        }
                    });
                },
                loadDownFn : function(me){
                    option.dropload = me;
                    //下一页
                    that.option.urlParams.page+=1;
                    that._localHttp(function(data) {
                        if(data.length > 0) {
                            var template = tplProxy.getTemplate.call({}, tpl, data, {config: config, $:$});
                            option.listDom.append(template);
                        }
                    });
                },
                threshold : 50
            });
            return that;
        }
    };
})
;