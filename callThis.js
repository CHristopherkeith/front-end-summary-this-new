var CallThis = function(params){
	console.log(this)
	this.myParams = params;
}
CallThis.call();
var obj = {otherParams: 'ok'};
CallThis.call(obj, 'hi');
// CallThis.apply(obj, ['hi']);
console.log(obj);