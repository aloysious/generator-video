/**
 * @fileOverview Service样例代码.
 * @author  liesun.wjb@taobao.com
 * @date    2013.11.13
 */

KISSY.add('<%= packageName %>/<%= mojoName %>/index', function(S, ServiceHelper){

'use strict';

function F(cfg){   
    F.superclass.constructor.call(this, cfg);
}

S.extend(F, ServiceHelper, {
    /**
     * 获取联系人.
     * @param  {JSON}cfg
     *   @cfg  {String}userId        当前用户ID, 必选
     *   @cfg  {Function}[success]   成功后的回调, 可选
     *   @cfg  {Function}[error]     失败后的回调, 可选
     * @public
     */
    getContacts : function(cfg){ 
        if(!this.hasProps(cfg, 'userId')){
            throw "service/wt/Foo#queryFoo: config object must has properties: userId";
        }
        
        var config = S.merge({
            url: 'path/to/api',
            data: this.getRequestParams(cfg),
            dataType: 'jsonp'
        }, cfg);

        this.sendAjaxReq(config);              
    },
    
    /**
     * 添加联系人.
     * @param  {JSON}cfg
     *   @cfg  {String}id               用户Id
     *   @cfg  {String}name             用户名称
     *   @cfg  {String}phone            用户电话
     *   @cfg  {Function}[success]      成功后回调
     *   @cfg  {Function}[error]        失败后回调
     * @event  add-contact-success, add-contact-error
     * @public
     */
    addContact : function(cfg){
        if(!this.hasProps(cfg, 'id', 'name', 'phone')){
            throw "service/wt/Foo#queryFoo: config object must has properties: id, name, phone";
        }
        
        var config = S.merge({ 
            url: 'path/to/api',
            fireEventOnSuccess : 'add-contact-success',
            fireEventOnError : 'add-contact-error',
            data: this.getRequestParams(cfg),
            dataType: 'jsonp'
        }, cfg);
        
        this.sendAjaxReq(config);
    }
});

return new F();

}, {requires : [ '<%= packageName %>/service/servicehelper']});
