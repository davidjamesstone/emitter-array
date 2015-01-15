var Emitter = require('emitter-object');
var EmitterEvent = require('emitter-event');

function raiseEvent(name, arr, value) {
  var e = new EmitterEvent(name, arr, value);

  arr.emit(name, e);
  arr.emit('change', e);
}

module.exports = function(callback) {

  callback = callback || raiseEvent;
  
  /**
   * Construct an Array from the passed arguments
   */
  var arrCtorArgs = arguments;
  var arr = Array.apply(null, arrCtorArgs);

  /**
   * Mixin Emitter to the Array instance
   */
  if (!callback) Emitter(arr);

  /**
   * Proxied array mutators methods
   *
   * @param {Object} obj
   * @return {Object}
   * @api private
   */
  var pop = function() {

    var ret = Array.prototype.pop.apply(arr);

    callback('pop', arr, ret);

    return ret;
  };
  var push = function() {

    var ret = Array.prototype.push.apply(arr, arguments);

    callback('push', arr, ret);

    return ret;
  };
  var reverse = function() {

    var ret = Array.prototype.reverse.apply(arr);

    callback('reverse', arr, ret);

    return ret;
  };
  var shift = function() {

    var ret = Array.prototype.shift.apply(arr);

    callback('shift', arr, ret);

    return ret;
  };
  var sort = function() {

    var ret = Array.prototype.sort.apply(arr, arguments);

    callback('sort', arr, ret);

    return ret;
  };
  var unshift = function() {

    var ret = Array.prototype.unshift.apply(arr, arguments);

    callback('unshift', arr, ret);

    return ret;
  };
  var splice = function() {

    if (!arguments.length) {
      return;
    }

    var ret = Array.prototype.splice.apply(arr, arguments);

    callback('splice', arr, {
      removed: ret,
      added: arguments.slice(2)
    });

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

    var oldValue = arr[index];
    var newValue = arr[index] = value;

    callback('update', arr, {
      newValue: newValue,
      oldValue: oldValue
    });

    return newValue;
  };

  return arr;
};