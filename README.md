# 0.关于this是指什么
- 其实可以这么概括，this属于调用被调用的方法的主体，也就是，谁调用，谁就是this。
- 虽然说起来这么简单，但是上面的话里面的概念其实涉及到：作为方法的调用(function）的this；作为构造函数里的this；作为call或者apply的this。
- 以上三个概念，又涉及到js里的对象创建，和方法的继承，所以，要弄清楚this，就要弄清楚js里的对象创建和继承机制。

# 1.作为方法调用（function）的this
这个是最为简单的，但也可以分为几种情况，我们写一个文件，叫functionThis.js
1.1 有如下代码：

    function fnThis(){
        console.log(this);
    }
    fnThis();

打印结果如下：

![1-1](http://upload-images.jianshu.io/upload_images/10687046-154d36e6aabfb445.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

可以看到this当前是指向window，这个很好理解，因为this是指向调用者，而fnThis没有调用者，没有调用者就默认为window。

1.2 我们在文件继续添加代码，如下

    var obj = {
      fnThis: function(){
        console.log(this);
      }
    }
    obj.fnThis();
    var objIns = obj.fnThis;
    objIns();

打印结果如下：

![1-2](http://upload-images.jianshu.io/upload_images/10687046-7223bf1cf38a2355.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


可以看到，第1行的打印this是obj，第2行是window，会这样的差异是因为：obj.fnThis()的调用者是obj，所以this指向obj；而objIns()没有调用者，默认为window。

# 2.作为构造函数里的this
这里我们的demo文件为constructorThis.js

2.1 说到这里又要提一下构造函数，构造函数，就是可以构造一个对象的函数类，js里面最简单的莫过于直接定义一个对象，这个对象有一些属性的方法，然后用的时候直接拿来用，像我们functionThis.js这个文件里的就是这种情况，这是直接定义，另外还有一些其他的方式就先不展开讲了，下面的例子以比较常见的构造函数的形式为例，至于为什么要用构造函数，简单地讲就是可以用面向对象的形式去编程，可继承，等。

2.2  测试代码如下：

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
    console.log(obj);
    console.log(obj === thisObj)
    obj.sayParams();

打印结果如下：

![2-2](http://upload-images.jianshu.io/upload_images/10687046-86e0f8058b45d7dc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


我们可以看到第1行和第2行打印的对象从字面上看是一样的（字面一样不等于两个对象是同一个东西，后续可以自行初始化几个对象进行类似的对比验证），我们为了验证这个this是否就是obj，把this赋值给外部的thisObj并进行比较，结果是true，说明构造函数内的this确实就是new 构造函数() 后的对象。

2.3  如此一来，因为构造函数需要用new关键字实例化一个对象，那么和1-2作为方法的调用的情况相比，this似乎就不是指向被调用者了？

实际上：

    var obj = new ConstructorThis('hi');

等价于：

    var obj = {};
    obj.__proto__ = ConstructorThis.prototype;
    ConstructorThis.call(obj, 'hi');

将第一个代码块改为下面三行的代码块，我们再看一下打印结果：

![2-3](http://upload-images.jianshu.io/upload_images/10687046-634b5dc115345adf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

与2-2的情况是一致的。

也就是说，new 构造函数() 干了这么一件事情，第一步，创建一个空的对象；第二步，把空对象的原型指向构造函数的原型；第三步，再根据call传入参数（'hi'），同时把构造函数内部的this指向这个空对象，这样一来就完成了构造函数原型链的继承（第二步）和自身属性的赋值（第三步）；最后返回新创建的对象。

构造函数内部this等于新创建的对象，关键就在第三步，用了call方法把创建的对象指向了内部的this，call和apply方法会在接下来讲。总之，构造函数内部的this指向用new创建的新对象。

# 3.作为call或者apply的this
这里我们仍然创建一个demo文件callThis.js

3.1 call或者apply的作用就是改变某个方法的运行环境，也就是改变内部this关键字的指向，正因为有这样的作用，也在js的继承机制中其中有着显著的作用。正如2-3我们讲到的一样，构造函数用call把创建的一个类指向了内部的this关键字，因此构造函数类可以作为一个类被继承，每个不同的实例通过内部的this被赋予了不同的属性。

3.2 call和apply的用法其实很简单，我们看如下代码：

    var CallThis = function(params){
      console.log(this)
      this.myParams = params;
    }
    CallThis.call();
    var obj = {otherParams: 'ok'};
    CallThis.call(obj, 'hi');
    console.log(obj);

打印结果如下：

![3-2](http://upload-images.jianshu.io/upload_images/10687046-ef9b34ffe72d19d6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

第一次call没传任何参数，内部的this打印出来是window，这在第一部分的时候已经说明了；第二次call的时候第一个参数是一个对象，第二个参数对应构造函数的一个参数，可以看到this指向了obj，然后obj被添加了myParams属性，因此 构造函数.call(obj, args)这种形式就是通过call方法把this指向obj，args是传入构造函数内部的参数，需要传多个参数是这样子的 构造函数.call(obj, args, args1, ..., argsN)，第一个参数就是把this指向的对象，这和我们在2-3说到的，new的步骤分解，第三步是一致的。

apply和call的用法类似，构造函数.call(obj, args, args1, ..., argsN) 等同于 构造函数.call(obj, [args, args1, ..., argsN])，我们修改一下代码，将

    CallThis.call(obj, 'hi');

替换为

    CallThis.apply(obj, ['hi']);

可见，打印结果一致：

![3-2-1](http://upload-images.jianshu.io/upload_images/10687046-70c0dd0a479ea0f4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

即，call和apply都能把上下文运行到具体的this环境里，不同的只是传参的形式，call参数的传递是分开传递，而apply是作为数组传递。

# 4.总结

到这里就基本把this涉及到的情况说完了，包括作为方法的调用（function）的this；作为构造函数里的this；作为call或者apply的this；第二和第三种情况本质上是统一的。

这算是第一次写比较完整的文章，大部分是自己的理解，当然前期学习阶段也参考了一些资料，若有不当之处，还请指正，若有宝贵意见，也可以多多交流。

具体的实例代码和demo地址：












