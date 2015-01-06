var Emitter = require('emitter-component');

module.exports = function() {

  /**
   * Construct an Array from the passed arguments
   */
  var arrCtorArgs = arguments;
  var arr = Array.apply(null, arrCtorArgs);

  /**
   * Mixin Emitter to the Array instance
   */
  Emitter(arr);

  /**
   * Proxied array mutators methods
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */
  var pop = function() {

    arr.emit('popping');
    
    var ret = Array.prototype.pop.apply(arr);

    arr.emit('popped', ret);
    arr.emit('change');

    return ret;
  };
  var push = function() {

    arr.emit('pushing', arguments);
    
    var ret = Array.prototype.push.apply(arr, arguments);

    arr.emit('popped', ret);
    arr.emit('change');

    return ret;
  };
  var reverse = function() {

    arr.emit('reversing');
    
    var ret = Array.prototype.reverse.apply(arr);

    arr.emit('reversed', ret);
    arr.emit('change');

    return ret;
  };
  var shift = function() {

    arr.emit('shifting');
    
    var ret = Array.prototype.shift.apply(arr);

    arr.emit('shifted', ret);
    arr.emit('change');

    return ret;
  };
  var sort = function() {

    arr.emit('sorting');
    
    var ret = Array.prototype.sort.apply(arr, arguments);

    arr.emit('sorted', ret);
    arr.emit('change');

    return ret;
  };
  var unshift = function() {

    arr.emit('unshifting');
    
    var ret = Array.prototype.unshift.apply(arr, arguments);

    arr.emit('unshifted', ret);
    arr.emit('change');

    return ret;
  };
  var splice = function() {

    if (!arguments.length) {
      return;
    }

    var newItems = Array.prototype.slice.call(arguments, 2);

    var ret = Array.prototype.splice.apply(arr, arguments);

    arr.emit('spliced', ret);
    arr.emit('change');

    return ret;
  };

  /**
   * Proxy all Array.prototype mutator methods on this array instance
   */
  arr.pop = arr.pop && pop;
  arr.push = arr.push && push;
  arr.reverse = arr.reverse && reverse;
  arr.shift = arr.shift && shift;
  arr.sort = arr.sort && sort;
  arr.splice = arr.splice && splice;

  /**
   * Special update function
   */
  arr.update = function(index, value) {
    arr[index] = value;

    arr.emit('updated', index);
    arr.emit('change');
  };

  return arr;
};