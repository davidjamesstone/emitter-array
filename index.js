var Emitter = require('emitter-object');
var EmitterEvent = require('emitter-event');

function result(name, arr, value) {
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
  var arr = [];//Array.apply(null, arrCtorArgs);

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

    var result = Array.prototype.pop.apply(arr);

    callback('pop', arr, { value: result });

    return result;
  };
  var push = function() {

    var result = Array.prototype.push.apply(arr, arguments);

    callback('push', arr, { value: result });

    return result;
  };
  var reverse = function() {

    var result = Array.prototype.reverse.apply(arr);

    callback('reverse', arr, { value: result });

    return result;
  };
  var shift = function() {

    var result = Array.prototype.shift.apply(arr);

    callback('shift', arr, { value: result });

    return result;
  };
  var sort = function() {

    var result = Array.prototype.sort.apply(arr, arguments);

    callback('sort', arr, { value: result });

    return result;
  };
  var unshift = function() {

    var result = Array.prototype.unshift.apply(arr, arguments);

    callback('unshift', arr, { value: result });

    return result;
  };
  var splice = function() {

    if (!arguments.length) {
      return;
    }

    var result = Array.prototype.splice.apply(arr, arguments);

    callback('splice', arr, {
      value: result,
      removed: result,
      added: Array.prototype.slice.call(arguments, 2)
    });

    return result;
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
      value: newValue,
      oldValue: oldValue
    });

    return newValue;
  };

  return arr;
};