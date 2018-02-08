define([
    'Http',
    'config',
    'TemplateProxy',
    'text!apps/map/message.html',
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
            that.options.extra = JSON.parse(decodeURIComponent((utils.getUrlParams().extra)));
            tplProxy.html.call($(".map-message"), tpl, that.options.extra, {config: config, $:$});
            //非APP进入显示下载提示
            if(!$.cookie('token')){
              tplProxy.html.call(that.options.downloadDom, downloadTpl, {}, {config: config, $:$});
            }
            return that._map();
        },
        options: {
            ICON_PATH_RED:"../../css/img/red-flag.png",
            extra:{
                enterpriseId: "企业id",
                code: "具体的二维码，用于查看商品详情",
                
                //以下为未通过的时候使用
                longitude:"116.404",//用户本次扫码经度
                latitude:"39.915",//用户本次扫码纬度
                
                //center和radius, authedAddress 两者取其一，如果center和radius不为空，以这个为准，如果为空以可能为空，如果为空以authedAddress为准
                //该商品应该所在的轴距中心(圆心)
                center: "116.404,39.915",
                //轴距(半径)，单位：米
                radius:"1000",
                
                //经销商指定销售区域
                authedArea: ["北京","成都"],
                message:"该商品被多次验证且流通多个区域，请谨慎使用!"
            },
            downloadDom: $(".download")
        },
        _map: function() {
        	var that = this;
            var extra = that.options.extra;
			var map = new BMap.Map("map-container"); // 创建地图实例
            //用户本次扫码位置
            var userPoint = new BMap.Point(extra.longitude, extra.latitude); // 创建点坐标
            map.centerAndZoom(userPoint, 15); // 初始化地图，设置中心点坐标和地图级别
            map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_SMALL}));
            map.enableScrollWheelZoom();
            //如果center和radius不为空,以这个为准画区域
            if(extra.center) {
                var center = extra.center.split(",");
                var centerPoint = new BMap.Point(center[0], center[1]);
                that._circle(map,centerPoint,extra.radius);
            } else {
                //以行政区域画区域
                for(var auth in extra.authedArea) {
                    that._getBoundary(map,extra.authedArea[auth]);
                }
            }
            //插旗子
            that._addMarker(that.options.ICON_PATH_RED,userPoint,map);
            map.centerAndZoom(userPoint, 15); // 初始化地图，设置中心点坐标和地图级别
			return that;
        },
        // 添加自定义标注
        _addMarker: function(iconPath,point,map) {
            var that = this;
			// 编写自定义函数，创建标注
			// 创建图标对象
			var myIcon = new BMap.Icon(iconPath, new BMap.Size(80, 80), {});
			// 创建标注对象并添加到地图
			var marker = new BMap.Marker(point, {icon: myIcon});
            // 指定定位位置。
            marker.setOffset(new BMap.Size(24, -38));
		  	map.addOverlay(marker);
            return that;
        },
        //获取行政区域 
        _getBoundary: function(map,name) {
            var that = this;
            var bdary = new BMap.Boundary();
            bdary.get(name, function(rs){       //获取行政区域
                var count = rs.boundaries.length; //行政区域的点有多少个
                for(var i = 0; i < count; i++){
                    var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000"}); //建立多边形覆盖物
                    map.addOverlay(ply);  //添加覆盖物
                } 
            });
            return that;
        },
        //该商品应该所在的轴距中心(圆心)
        _circle: function(map,point,radius) {
            var that = this;
            var circle = new BMap.Circle(point,radius,{strokeColor:"blue", strokeWeight:2, strokeOpacity:0.5}); //创建圆
            //增加圆
            map.addOverlay(circle);
            return that;
        }
    };
})
;