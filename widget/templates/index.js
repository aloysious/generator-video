/**
 * @fileoverview <%= projectName %> - <%= modName %>.
 * @author 
 */
/**
 * KISSY.use('<%= packageName %>/<%= mojoName %>/index',function(S,<%= modName %>){
 *		new <%= modName %>();
 * });
 */
KISSY.add('<%= packageName %>/<%= mojoName %>/index', function(S,Base) {

	var <%= modName %> = Base.extend({
		initializer:function(){
			var self = this;

			// Your Code
			alert('ok');
		}
	},{
		ATTRS: {
			// 这里是初始参数和默认值
			A:{
				value:'abc'
			}
		}
	});

	return <%= modName %>;
	
},{
	requires:['base']	
});
