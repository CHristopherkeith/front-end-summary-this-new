function fnThis(){
	console.log(this);
}
fnThis();

var obj = {
	fnThis: function(){
		console.log(this);
	}
}
obj.fnThis();
var objIns = obj.fnThis;
objIns();