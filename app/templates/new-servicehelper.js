/**
 * @fileOverview 辅助Service模块.
 * @author  liesun.wjb@taobao.com
 * @date    2014.05.19 v2
 */

KISSY.add('<%= packageName %>/service/servicehelper', function(S, Event, IO){

'use strict';

function F(cfg){
    this.cache = {};
}

S.augment(F, S.EventTarget, {
    /**
     * 判断是否具有制定的属性.
     * @param  {JSON}cfg
     * @props  {Array|...}props
     * @public
     */
    hasProps : function(cfg, props){
        if(!S.isArray(props)){
            props = Array.prototype.slice.call(arguments, 1);
        }
        
        var hasAllProps = true;
        S.each(props, function(p){
            if(!cfg.hasOwnProperty(p)){
                hasAllProps = false;
                return false;
            }
        });
        
        return hasAllProps;
    },
    
    /**
     * 遍历cfg中的非对象属性作为查询参数.
     * @param   {JSON}cfg
     * @return  {JSON}
     * @public
     */
    getRequestParams : function(cfg){
        var params = {};
        S.each(cfg, function(v, p){
            var type = typeof cfg[p];
            if(type === 'string' ||
               type === 'number' ||
               type === 'boolean'){
                params[p] = v;
            }
        });
        return params;
    },
    
    
    /**
     * 发送Ajax请求.
     * @param  {JSON}cfg
     *   @cfg  {boolean}[useCache]                是否启用缓存
     *   @cfg  {Function}[checkSuccess]           根据后端返回状态判断调用是否成功
     *   @cfg  {Function}[getErrorEventData]      获取失败后的事件数据    
     *   @cfg  {Function}[getSuccessEventData]    获取成功后的事件数据
     *   @cfg  {String}[fireEventOnSuccess]       成功后触发的事件名称
     *   @cfg  {String}[fireEventOnError]         失败后触发的事件名称
     *   ... 其他配置同ajax
     * @public
     */
    sendAjaxReq : function(cfg){
        var cacheData, config, reqUrl = cfg.url, me = this;
        var onsuccess = cfg.success;
        var onerror = cfg.error;
        
        if(cfg.useCache && (cacheData = this.getCacheData(reqUrl, cfg.data)) ){            
            if(S.isFunction(cfg.success)){
                cfg.success(cacheData);
            }
            return;          
        }
        
        config = S.merge({
            type: 'get',
            timeout: 5,
            useCache: false,
            getErrorEventData : function(o){ return o; },
            getSuccessEventData : function(o){ return o; },
            checkSuccess : function(o){ return o && (o.result === true || o.status === 1); },            
            dataType: reqUrl.indexOf('.htm') === -1 ? 'json' : 'jsonp'
        }, cfg);
        
        if(config.autoAdjustUrl != false && this.isDevEnvr()){
            var reg = /^\s*(https?):\/\/(\w+)\.(\w+)\.com\//i;
            config.url = config.url.replace(reg, '$1://$2.daily.$3.net/');
        }
        
        config.success = function(o){
            var checkSuccess = config.checkSuccess;
            var eventData, eventName, getEventData;
            
            if(S.isFunction(checkSuccess)){
                if(!checkSuccess(o)){
                    onerror(o);
                    return;
                }
            }
            
            if(S.isFunction(onsuccess)){
                if(config.useCache){
                    me.saveToCache(config.url, config.data);
                }
                onsuccess(o);
            }
            
            if(config.fireEventOnSuccess){                
                getEventData = config.getSuccessEventData;
                eventName = config.fireEventOnSuccess;
                eventData = getEventData(o);
                me.fire(eventName, eventData);
            }
        };
        
        config.error = function(o){
            var eventData, eventName, getEventData;
            
            if(S.isFunction(onerror)){
                onerror(o);
            }
            
            if(config.fireEventOnError){
                getEventData = config.getErrorEventData;
                eventName = config.fireEventOnError;
                eventData = getEventData(o);
                me.fire(eventName, eventData);                
            }
        };
        
        IO(config);
    },
    
    /**
     * 将请求返回后的结果报错到缓存中.
     * @param  {String}url   请求URL
     * @param  {JSON}data    请求参数
     * @param  {JSON}ret     返回结果
     * @private
     */
    saveToCache : function(url, data, ret){
        this.cache[this.getCacheKey(url, data)] = ret;
    },
    
    /**
     * 读取缓存数据.
     * @param  {String}url  请求URL
     * @param  {JSON}data   请求参数
     * @return {JSON}
     * @private
     */
    getCacheData : function(url, data){
        return this.cache[this.getCacheKey(url, data)];
    },
    
    /**
     * 获取将请求结果保存到cache需要的key.
     * @param  {String}url
     * @param  {JSON}data
     * @return {String}
     * @private
     */
    getCacheKey : function(url, data){
        var params = [];        
        S.each(data, function(v, k){
            params.push(k + '=' + encodeURIComponent(v));
        });
        return url + '?' + params.join('&');
    },
    
    /**
     * 检测是否处于调试环境
     * @return {Boolean}
     * @private
     */
    isDevEnvr : function(){
        var host = location.hostname;
        return (
              host == 'g.tbcdn.cn'
           || host == 'a.tbcdn.cn'
           || host == 'localhost'
           || host == '127.0.0.1'
           || host.indexOf('.daily.') != -1
		   // tms预发
		   || host.indexOf('.tms.') != -1
		   // awp日常
		   || host.indexOf('.waptest.') != -1
		   // awp预发
		   || host.indexOf('.wapa.') != -1
        );        
    }
});

return F;

}, {requires: ['event', 'io']});
