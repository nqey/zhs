define([
    'Http',
    'config',
    'TemplateProxy',
    'text!apps/scanHistory/message.html',
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
            return that._dropload()
                       ._eidt()
                       ._footerAllSelect()
                       ._delete();
        },
        option: {
          editFlg:0, //0:编辑,1:非编辑
          allFlg:0, //0:非全选,1:全选
          //hash参数
          urlParams: null,
          //商品详情Url
          GOODS_DETAILS_URL: "../../apps/goodsDetails/goodsDetails.html?code=",
          //商品历史接口地址
          GOODS_HISTORY_ADDRESS: config.GOODS_BASE_URL + "zhsapp/code/scan/history",
          //商品历史删除接口地址
          GOODS_DELETE_ADDRESS: config.GOODS_BASE_URL + "zhsapp/code/delete/history",
          //滚动加载初始化区域
          dom: $('.content'),
          //列表区域
          listDom: $(".content .lists"),
          //编辑按钮
          eidtDom: $(".eidt"),
          footerDom: $(".smls_footer"),
          deleteDom:  $(".smls_delete"),
          downloadDom: $(".download")
        },
        _localHttp: function(callBack) {
            var that = this;
            var option = that.option;
            /*调用接口获取数据*/
            http.get(option.GOODS_HISTORY_ADDRESS, {
                data: {
                    page: option.urlParams.page,
                    rows: option.urlParams.rows
                },
                success: function (res) {
                    if (res.data.length == 0) {
                        if (option.urlParams.page === 1) {
                          option.listDom.html("没有扫描历史");
                        }
                        // 锁定
                        option.dropload.lock();
                        // 无数据
                        option.dropload.noData();
                        // 即使加载出错，也得重置
                        option.dropload.resetload();
                    } else {
                      res.data.forEach(function(d) {
                          d.imageList = JSON.parse(d.imageList);
                          d.url = option.GOODS_DETAILS_URL + d.code;
                      });
                      //渲染画面
                      callBack(res.data);
                      // 每次数据加载完，必须重置
                      option.dropload.resetload();
                      // 解锁
                      option.dropload.unlock();
                      option.dropload.noData(false);
                    }
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
        },
        _dropload: function() {
            var that = this;
            var option = that.option;
            var newDomE = function() {
                //为新节点设定编辑状态
                if (that.option.editFlg) {
                  //编辑状态
                  $(".smls_select").show();
                } else {
                  //非编辑状态
                  $(".smls_select").hide();
                }
                //0:非全选,1:全选
                if (option.allFlg) {
                  //添加单选选中样式
                  $(".smls_select .smls_check").addClass("smls_checkAfter");
                } else {
                  //删除单选选中样式
                  $(".smls_select .smls_check").removeClass("smls_checkAfter");
                }
                //为新节点绑定单选选中事件
                that._check();
            }
            option.dom.dropload({
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
                        var template = tplProxy.getTemplate.call({}, tpl, data, {config: config, $:$});
                        option.listDom.html(template);
                        newDomE();
                    });
                },
                loadDownFn : function(me){
                    option.dropload = me;
                    //下一页
                    option.urlParams.page+=1;
                    that._localHttp(function(data) {
                        var template = tplProxy.getTemplate.call({}, tpl, data, {config: config, $:$});
                        option.listDom.append(template);
                        newDomE();
                    });
                },
                threshold : 50
            });
            return that;
        },
        _eidt: function(me) {
            var that = this;
            var option = that.option;
            //编辑状态切换
            var editFlgChange = function() {
              if (that.option.editFlg) {
                  that.option.editFlg = 0;
                  option.eidtDom.text("编辑");
                  $(".smls_select").hide();
                  option.footerDom.hide();
              } else {
                  that.option.editFlg = 1;
                  option.eidtDom.text("取消");
                  $(".smls_select").show();
                  option.footerDom.show();
              }
            }
            option.eidtDom.click(editFlgChange);
            return that;
        },
        _check: function() {
            //绑定单选选中事件
            var that = this;
            var cl = function() {
                if ($(this).attr("class")=="smls_check smls_checkAfter") {
                    //删除单选选中样式
                    $(this).removeClass("smls_checkAfter");
                } else {
                    //添加单选选中样式
                    $(this).addClass("smls_checkAfter");
                }
            };
            var selects =  $(".smls_select .smls_check");
            for (var i = 0; i < selects.length; ++i) {
                $(selects[i]).unbind('click').bind('click', cl);
            }
            return that;
       },
       _footerAllSelect: function() {
            var that = this;
            var option = that.option;
            var allSelect = function() {
              //0:非全选,1:全选
              if (option.allFlg) {
                option.allFlg = 0;
                //删除全选选中样式
                $(this).removeClass("smls_allSelectAfter");
                //删除单选选中样式
                $(".smls_select .smls_check").removeClass("smls_checkAfter");
              } else {
                option.allFlg = 1;
                //添加全选选中样式
                $(this).addClass("smls_allSelectAfter");
                //添加单选选中样式
                $(".smls_select .smls_check").addClass("smls_checkAfter");
              }
            }
            //全选点击事件
            $(".smls_allSelect").click(allSelect);
            return that;
       },
       _delete: function() {
         var that = this;
         var option = that.option;
         option.deleteDom.click(function() {
            var delIds = [];
            var parent=document.getElementsByClassName("lists")[0];
            //删除选中历史信息
            var checkAfter = Array.prototype.slice.apply(document.getElementsByClassName("smls_checkAfter"));
            checkAfter.forEach(function(obj) {
              delIds.push($(obj).attr("data-id"));
              var child=obj.parentNode.parentNode.parentNode.parentNode;
              parent.removeChild(child);
            });
            /*调用接口历史信息数据*/
            http.post(option.GOODS_DELETE_ADDRESS, {
                data: {
                    idList: delIds
                },
                cache:true,
                cacheTimeout:10000,
                success: function (res) {}
            });
         });
         return that;
       }
    };
})
;