var thisObj;
var ConstructorThis = function(params){
	this.myParams = params;
	console.log(this);
	thisObj = this;
}
ConstructorThis.prototype.sayParams = function(){
	console.log(this.myParams);
}
var obj = new ConstructorThis('hi');
// var obj = {};
// obj.__proto__ = ConstructorThis.prototype;
// ConstructorThis.call(obj, 'hi')
console.log(obj);
console.log(obj === thisObj)
obj.sayParams();