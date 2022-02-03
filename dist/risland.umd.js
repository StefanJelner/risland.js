
/**
 * @license
 * author: Stefan Jelner
 * risland.js v0.0.1
 * Released under the ISC license.
 * 
 * See https://github.com/StefanJelner/risland.js.git
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.RIsland = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  var _assign = function __assign() {
    _assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (var p in s) {
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
      }

      return t;
    };

    return _assign.apply(this, arguments);
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var toString = Object.prototype.toString;

  var kindOf = function kindOf(val) {
    if (val === void 0) return 'undefined';
    if (val === null) return 'null';

    var type = _typeof(val);

    if (type === 'boolean') return 'boolean';
    if (type === 'string') return 'string';
    if (type === 'number') return 'number';
    if (type === 'symbol') return 'symbol';

    if (type === 'function') {
      return isGeneratorFn(val) ? 'generatorfunction' : 'function';
    }

    if (isArray(val)) return 'array';
    if (isBuffer(val)) return 'buffer';
    if (isArguments(val)) return 'arguments';
    if (isDate(val)) return 'date';
    if (isError(val)) return 'error';
    if (isRegexp(val)) return 'regexp';

    switch (ctorName(val)) {
      case 'Symbol':
        return 'symbol';

      case 'Promise':
        return 'promise';
      // Set, Map, WeakSet, WeakMap

      case 'WeakMap':
        return 'weakmap';

      case 'WeakSet':
        return 'weakset';

      case 'Map':
        return 'map';

      case 'Set':
        return 'set';
      // 8-bit typed arrays

      case 'Int8Array':
        return 'int8array';

      case 'Uint8Array':
        return 'uint8array';

      case 'Uint8ClampedArray':
        return 'uint8clampedarray';
      // 16-bit typed arrays

      case 'Int16Array':
        return 'int16array';

      case 'Uint16Array':
        return 'uint16array';
      // 32-bit typed arrays

      case 'Int32Array':
        return 'int32array';

      case 'Uint32Array':
        return 'uint32array';

      case 'Float32Array':
        return 'float32array';

      case 'Float64Array':
        return 'float64array';
    }

    if (isGeneratorObj(val)) {
      return 'generator';
    } // Non-plain objects


    type = toString.call(val);

    switch (type) {
      case '[object Object]':
        return 'object';
      // iterators

      case '[object Map Iterator]':
        return 'mapiterator';

      case '[object Set Iterator]':
        return 'setiterator';

      case '[object String Iterator]':
        return 'stringiterator';

      case '[object Array Iterator]':
        return 'arrayiterator';
    } // other


    return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
  };

  function ctorName(val) {
    return typeof val.constructor === 'function' ? val.constructor.name : null;
  }

  function isArray(val) {
    if (Array.isArray) return Array.isArray(val);
    return val instanceof Array;
  }

  function isError(val) {
    return val instanceof Error || typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number';
  }

  function isDate(val) {
    if (val instanceof Date) return true;
    return typeof val.toDateString === 'function' && typeof val.getDate === 'function' && typeof val.setDate === 'function';
  }

  function isRegexp(val) {
    if (val instanceof RegExp) return true;
    return typeof val.flags === 'string' && typeof val.ignoreCase === 'boolean' && typeof val.multiline === 'boolean' && typeof val.global === 'boolean';
  }

  function isGeneratorFn(name, val) {
    return ctorName(name) === 'GeneratorFunction';
  }

  function isGeneratorObj(val) {
    return typeof val["throw"] === 'function' && typeof val["return"] === 'function' && typeof val.next === 'function';
  }

  function isArguments(val) {
    try {
      if (typeof val.length === 'number' && typeof val.callee === 'function') {
        return true;
      }
    } catch (err) {
      if (err.message.indexOf('callee') !== -1) {
        return true;
      }
    }

    return false;
  }
  /**
   * If you need to support Safari 5-7 (8-10 yr-old browser),
   * take a look at https://github.com/feross/is-buffer
   */


  function isBuffer(val) {
    if (val.constructor && typeof val.constructor.isBuffer === 'function') {
      return val.constructor.isBuffer(val);
    }

    return false;
  }

  /*!
   * shallow-clone <https://github.com/jonschlinkert/shallow-clone>
   *
   * Copyright (c) 2015-present, Jon Schlinkert.
   * Released under the MIT License.
   */

  var valueOf = Symbol.prototype.valueOf;
  var typeOf$1 = kindOf;

  function clone$1(val, deep) {
    switch (typeOf$1(val)) {
      case 'array':
        return val.slice();

      case 'object':
        return Object.assign({}, val);

      case 'date':
        return new val.constructor(Number(val));

      case 'map':
        return new Map(val);

      case 'set':
        return new Set(val);

      case 'buffer':
        return cloneBuffer(val);

      case 'symbol':
        return cloneSymbol(val);

      case 'arraybuffer':
        return cloneArrayBuffer(val);

      case 'float32array':
      case 'float64array':
      case 'int16array':
      case 'int32array':
      case 'int8array':
      case 'uint16array':
      case 'uint32array':
      case 'uint8clampedarray':
      case 'uint8array':
        return cloneTypedArray(val);

      case 'regexp':
        return cloneRegExp(val);

      case 'error':
        return Object.create(val);

      default:
        {
          return val;
        }
    }
  }

  function cloneRegExp(val) {
    var flags = val.flags !== void 0 ? val.flags : /\w+$/.exec(val) || void 0;
    var re = new val.constructor(val.source, flags);
    re.lastIndex = val.lastIndex;
    return re;
  }

  function cloneArrayBuffer(val) {
    var res = new val.constructor(val.byteLength);
    new Uint8Array(res).set(new Uint8Array(val));
    return res;
  }

  function cloneTypedArray(val, deep) {
    return new val.constructor(val.buffer, val.byteOffset, val.length);
  }

  function cloneBuffer(val) {
    var len = val.length;
    var buf = Buffer.allocUnsafe ? Buffer.allocUnsafe(len) : Buffer.from(len);
    val.copy(buf);
    return buf;
  }

  function cloneSymbol(val) {
    return valueOf ? Object(valueOf.call(val)) : {};
  }
  /**
   * Expose `clone`
   */


  var shallowClone = clone$1;

  var isobject = function isObject(val) {
    return val != null && _typeof(val) === 'object' && Array.isArray(val) === false;
  };

  /*!
   * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */

  var isObject$1 = isobject;

  function isObjectObject(o) {
    return isObject$1(o) === true && Object.prototype.toString.call(o) === '[object Object]';
  }

  var isPlainObject$2 = function isPlainObject(o) {
    var ctor, prot;
    if (isObjectObject(o) === false) return false; // If has modified constructor

    ctor = o.constructor;
    if (typeof ctor !== 'function') return false; // If has modified prototype

    prot = ctor.prototype;
    if (isObjectObject(prot) === false) return false; // If constructor does not have an Object-specific method

    if (prot.hasOwnProperty('isPrototypeOf') === false) {
      return false;
    } // Most likely a plain Object


    return true;
  };

  /**
   * Module dependenices
   */


  var clone = shallowClone;
  var typeOf = kindOf;
  var isPlainObject$1 = isPlainObject$2;

  function cloneDeep(val, instanceClone) {
    switch (typeOf(val)) {
      case 'object':
        return cloneObjectDeep(val, instanceClone);

      case 'array':
        return cloneArrayDeep(val, instanceClone);

      default:
        {
          return clone(val);
        }
    }
  }

  function cloneObjectDeep(val, instanceClone) {
    if (typeof instanceClone === 'function') {
      return instanceClone(val);
    }

    if (instanceClone || isPlainObject$1(val)) {
      var res = new val.constructor();

      for (var key in val) {
        res[key] = cloneDeep(val[key], instanceClone);
      }

      return res;
    }

    return val;
  }

  function cloneArrayDeep(val, instanceClone) {
    var res = new val.constructor(val.length);

    for (var i = 0; i < val.length; i++) {
      res[i] = cloneDeep(val[i], instanceClone);
    }

    return res;
  }
  /**
   * Expose `cloneDeep`
   */


  var cloneDeep_1 = cloneDeep;

  var isMergeableObject = function isMergeableObject(value) {
    return isNonNullObject(value) && !isSpecial(value);
  };

  function isNonNullObject(value) {
    return !!value && _typeof(value) === 'object';
  }

  function isSpecial(value) {
    var stringValue = Object.prototype.toString.call(value);
    return stringValue === '[object RegExp]' || stringValue === '[object Date]' || isReactElement(value);
  } // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25


  var canUseSymbol = typeof Symbol === 'function' && Symbol["for"];
  var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol["for"]('react.element') : 0xeac7;

  function isReactElement(value) {
    return value.$$typeof === REACT_ELEMENT_TYPE;
  }

  function emptyTarget(val) {
    return Array.isArray(val) ? [] : {};
  }

  function cloneUnlessOtherwiseSpecified(value, options) {
    return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
  }

  function defaultArrayMerge(target, source, options) {
    return target.concat(source).map(function (element) {
      return cloneUnlessOtherwiseSpecified(element, options);
    });
  }

  function getMergeFunction(key, options) {
    if (!options.customMerge) {
      return deepmerge;
    }

    var customMerge = options.customMerge(key);
    return typeof customMerge === 'function' ? customMerge : deepmerge;
  }

  function getEnumerableOwnPropertySymbols(target) {
    return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function (symbol) {
      return target.propertyIsEnumerable(symbol);
    }) : [];
  }

  function getKeys(target) {
    return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
  }

  function propertyIsOnObject(object, property) {
    try {
      return property in object;
    } catch (_) {
      return false;
    }
  } // Protects from prototype poisoning and unexpected merging up the prototype chain.


  function propertyIsUnsafe(target, key) {
    return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
    && !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
    && Object.propertyIsEnumerable.call(target, key)); // and also unsafe if they're nonenumerable.
  }

  function mergeObject(target, source, options) {
    var destination = {};

    if (options.isMergeableObject(target)) {
      getKeys(target).forEach(function (key) {
        destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
      });
    }

    getKeys(source).forEach(function (key) {
      if (propertyIsUnsafe(target, key)) {
        return;
      }

      if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
        destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
      } else {
        destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
      }
    });
    return destination;
  }

  function deepmerge(target, source, options) {
    options = options || {};
    options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    options.isMergeableObject = options.isMergeableObject || isMergeableObject; // cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
    // implementations can use it. The caller may not replace it.

    options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
    var sourceIsArray = Array.isArray(source);
    var targetIsArray = Array.isArray(target);
    var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

    if (!sourceAndTargetTypesMatch) {
      return cloneUnlessOtherwiseSpecified(source, options);
    } else if (sourceIsArray) {
      return options.arrayMerge(target, source, options);
    } else {
      return mergeObject(target, source, options);
    }
  }

  deepmerge.all = function deepmergeAll(array, options) {
    if (!Array.isArray(array)) {
      throw new Error('first argument should be an array');
    }

    return array.reduce(function (prev, next) {
      return deepmerge(prev, next, options);
    }, {});
  };

  var deepmerge_1 = deepmerge;
  var cjs$1 = deepmerge_1;

  var fastDeepEqual = function equal(a, b) {
    if (a === b) return true;

    if (a && b && _typeof(a) == 'object' && _typeof(b) == 'object') {
      if (a.constructor !== b.constructor) return false;
      var length, i, keys;

      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length) return false;

        for (i = length; i-- !== 0;) {
          if (!equal(a[i], b[i])) return false;
        }

        return true;
      }

      if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length) return false;

      for (i = length; i-- !== 0;) {
        if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
      }

      for (i = length; i-- !== 0;) {
        var key = keys[i];
        if (!equal(a[key], b[key])) return false;
      }

      return true;
    } // true if both NaN, false otherwise


    return a !== a && b !== b;
  };

  /*!
   * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */

  function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
  }

  function isPlainObject(o) {
    var ctor,prot;

    if (isObject(o) === false) return false;

    // If has modified constructor
    ctor = o.constructor;
    if (ctor === undefined) return true;

    // If has modified prototype
    prot = ctor.prototype;
    if (isObject(prot) === false) return false;

    // If constructor does not have an Object-specific method
    if (prot.hasOwnProperty('isPrototypeOf') === false) {
      return false;
    }

    // Most likely a plain Object
    return true;
  }

  var DOCUMENT_FRAGMENT_NODE = 11;

  function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue; // document-fragments dont have attributes so lets not do anything

    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    } // update attributes on original DOM element


    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
      attr = toNodeAttrs[i];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      attrValue = attr.value;

      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

        if (fromValue !== attrValue) {
          if (attr.prefix === 'xmlns') {
            attrName = attr.name; // It's not allowed to set an attribute with the XMLNS namespace without specifying the `xmlns` prefix
          }

          fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
        }
      } else {
        fromValue = fromNode.getAttribute(attrName);

        if (fromValue !== attrValue) {
          fromNode.setAttribute(attrName, attrValue);
        }
      }
    } // Remove any extra attributes found on the original DOM element that
    // weren't found on the target element.


    var fromNodeAttrs = fromNode.attributes;

    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
      attr = fromNodeAttrs[d];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;

      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;

        if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          fromNode.removeAttributeNS(attrNamespaceURI, attrName);
        }
      } else {
        if (!toNode.hasAttribute(attrName)) {
          fromNode.removeAttribute(attrName);
        }
      }
    }
  }

  var range; // Create a range object for efficently rendering strings to elements.

  var NS_XHTML = 'http://www.w3.org/1999/xhtml';
  var doc = typeof document === 'undefined' ? undefined : document;
  var HAS_TEMPLATE_SUPPORT = !!doc && 'content' in doc.createElement('template');
  var HAS_RANGE_SUPPORT = !!doc && doc.createRange && 'createContextualFragment' in doc.createRange();

  function createFragmentFromTemplate(str) {
    var template = doc.createElement('template');
    template.innerHTML = str;
    return template.content.childNodes[0];
  }

  function createFragmentFromRange(str) {
    if (!range) {
      range = doc.createRange();
      range.selectNode(doc.body);
    }

    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
  }

  function createFragmentFromWrap(str) {
    var fragment = doc.createElement('body');
    fragment.innerHTML = str;
    return fragment.childNodes[0];
  }
  /**
   * This is about the same
   * var html = new DOMParser().parseFromString(str, 'text/html');
   * return html.body.firstChild;
   *
   * @method toElement
   * @param {String} str
   */


  function toElement(str) {
    str = str.trim();

    if (HAS_TEMPLATE_SUPPORT) {
      // avoid restrictions on content for things like `<tr><th>Hi</th></tr>` which
      // createContextualFragment doesn't support
      // <template> support not available in IE
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }

    return createFragmentFromWrap(str);
  }
  /**
   * Returns true if two node's names are the same.
   *
   * NOTE: We don't bother checking `namespaceURI` because you will never find two HTML elements with the same
   *       nodeName and different namespace URIs.
   *
   * @param {Element} a
   * @param {Element} b The target element
   * @return {boolean}
   */


  function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;

    if (fromNodeName === toNodeName) {
      return true;
    }

    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0); // If the target element is a virtual DOM node or SVG node then we may
    // need to normalize the tag name before comparing. Normal HTML elements that are
    // in the "http://www.w3.org/1999/xhtml"
    // are converted to upper case

    if (fromCodeStart <= 90 && toCodeStart >= 97) {
      // from is upper and to is lower
      return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
      // to is upper and from is lower
      return toNodeName === fromNodeName.toUpperCase();
    } else {
      return false;
    }
  }
  /**
   * Create an element, optionally with a known namespace URI.
   *
   * @param {string} name the element name, e.g. 'div' or 'svg'
   * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
   * its `xmlns` attribute or its inferred namespace.
   *
   * @return {Element}
   */


  function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
  }
  /**
   * Copies the children of one DOM element to another DOM element
   */


  function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;

    while (curChild) {
      var nextChild = curChild.nextSibling;
      toEl.appendChild(curChild);
      curChild = nextChild;
    }

    return toEl;
  }

  function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
      fromEl[name] = toEl[name];

      if (fromEl[name]) {
        fromEl.setAttribute(name, '');
      } else {
        fromEl.removeAttribute(name);
      }
    }
  }

  var specialElHandlers = {
    OPTION: function OPTION(fromEl, toEl) {
      var parentNode = fromEl.parentNode;

      if (parentNode) {
        var parentName = parentNode.nodeName.toUpperCase();

        if (parentName === 'OPTGROUP') {
          parentNode = parentNode.parentNode;
          parentName = parentNode && parentNode.nodeName.toUpperCase();
        }

        if (parentName === 'SELECT' && !parentNode.hasAttribute('multiple')) {
          if (fromEl.hasAttribute('selected') && !toEl.selected) {
            // Workaround for MS Edge bug where the 'selected' attribute can only be
            // removed if set to a non-empty value:
            // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12087679/
            fromEl.setAttribute('selected', 'selected');
            fromEl.removeAttribute('selected');
          } // We have to reset select element's selectedIndex to -1, otherwise setting
          // fromEl.selected using the syncBooleanAttrProp below has no effect.
          // The correct selectedIndex will be set in the SELECT special handler below.


          parentNode.selectedIndex = -1;
        }
      }

      syncBooleanAttrProp(fromEl, toEl, 'selected');
    },

    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
    INPUT: function INPUT(fromEl, toEl) {
      syncBooleanAttrProp(fromEl, toEl, 'checked');
      syncBooleanAttrProp(fromEl, toEl, 'disabled');

      if (fromEl.value !== toEl.value) {
        fromEl.value = toEl.value;
      }

      if (!toEl.hasAttribute('value')) {
        fromEl.removeAttribute('value');
      }
    },
    TEXTAREA: function TEXTAREA(fromEl, toEl) {
      var newValue = toEl.value;

      if (fromEl.value !== newValue) {
        fromEl.value = newValue;
      }

      var firstChild = fromEl.firstChild;

      if (firstChild) {
        // Needed for IE. Apparently IE sets the placeholder as the
        // node value and vise versa. This ignores an empty update.
        var oldValue = firstChild.nodeValue;

        if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
          return;
        }

        firstChild.nodeValue = newValue;
      }
    },
    SELECT: function SELECT(fromEl, toEl) {
      if (!toEl.hasAttribute('multiple')) {
        var selectedIndex = -1;
        var i = 0; // We have to loop through children of fromEl, not toEl since nodes can be moved
        // from toEl to fromEl directly when morphing.
        // At the time this special handler is invoked, all children have already been morphed
        // and appended to / removed from fromEl, so using fromEl here is safe and correct.

        var curChild = fromEl.firstChild;
        var optgroup;
        var nodeName;

        while (curChild) {
          nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();

          if (nodeName === 'OPTGROUP') {
            optgroup = curChild;
            curChild = optgroup.firstChild;
          } else {
            if (nodeName === 'OPTION') {
              if (curChild.hasAttribute('selected')) {
                selectedIndex = i;
                break;
              }

              i++;
            }

            curChild = curChild.nextSibling;

            if (!curChild && optgroup) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          }
        }

        fromEl.selectedIndex = selectedIndex;
      }
    }
  };
  var ELEMENT_NODE = 1;
  var DOCUMENT_FRAGMENT_NODE$1 = 11;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;

  function noop() {}

  function defaultGetNodeKey(node) {
    if (node) {
      return node.getAttribute && node.getAttribute('id') || node.id;
    }
  }

  function morphdomFactory(morphAttrs) {
    return function morphdom(fromNode, toNode, options) {
      if (!options) {
        options = {};
      }

      if (typeof toNode === 'string') {
        if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML' || fromNode.nodeName === 'BODY') {
          var toNodeHtml = toNode;
          toNode = doc.createElement('html');
          toNode.innerHTML = toNodeHtml;
        } else {
          toNode = toElement(toNode);
        }
      }

      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var childrenOnly = options.childrenOnly === true; // This object is used as a lookup to quickly find all keyed elements in the original DOM tree.

      var fromNodesLookup = Object.create(null);
      var keyedRemovalList = [];

      function addKeyedRemoval(key) {
        keyedRemovalList.push(key);
      }

      function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          var curChild = node.firstChild;

          while (curChild) {
            var key = undefined;

            if (skipKeyedNodes && (key = getNodeKey(curChild))) {
              // If we are skipping keyed nodes then we add the key
              // to a list so that it can be handled at the very end.
              addKeyedRemoval(key);
            } else {
              // Only report the node as discarded if it is not keyed. We do this because
              // at the end we loop through all keyed elements that were unmatched
              // and then discard them in one final pass.
              onNodeDiscarded(curChild);

              if (curChild.firstChild) {
                walkDiscardedChildNodes(curChild, skipKeyedNodes);
              }
            }

            curChild = curChild.nextSibling;
          }
        }
      }
      /**
       * Removes a DOM node out of the original DOM
       *
       * @param  {Node} node The node to remove
       * @param  {Node} parentNode The nodes parent
       * @param  {Boolean} skipKeyedNodes If true then elements with keys will be skipped and not discarded.
       * @return {undefined}
       */


      function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
          return;
        }

        if (parentNode) {
          parentNode.removeChild(node);
        }

        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
      } // // TreeWalker implementation is no faster, but keeping this around in case this changes in the future
      // function indexTree(root) {
      //     var treeWalker = document.createTreeWalker(
      //         root,
      //         NodeFilter.SHOW_ELEMENT);
      //
      //     var el;
      //     while((el = treeWalker.nextNode())) {
      //         var key = getNodeKey(el);
      //         if (key) {
      //             fromNodesLookup[key] = el;
      //         }
      //     }
      // }
      // // NodeIterator implementation is no faster, but keeping this around in case this changes in the future
      //
      // function indexTree(node) {
      //     var nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
      //     var el;
      //     while((el = nodeIterator.nextNode())) {
      //         var key = getNodeKey(el);
      //         if (key) {
      //             fromNodesLookup[key] = el;
      //         }
      //     }
      // }


      function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
          var curChild = node.firstChild;

          while (curChild) {
            var key = getNodeKey(curChild);

            if (key) {
              fromNodesLookup[key] = curChild;
            } // Walk recursively


            indexTree(curChild);
            curChild = curChild.nextSibling;
          }
        }
      }

      indexTree(fromNode);

      function handleNodeAdded(el) {
        onNodeAdded(el);
        var curChild = el.firstChild;

        while (curChild) {
          var nextSibling = curChild.nextSibling;
          var key = getNodeKey(curChild);

          if (key) {
            var unmatchedFromEl = fromNodesLookup[key]; // if we find a duplicate #id node in cache, replace `el` with cache value
            // and morph it to the child node.

            if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
              curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
              morphEl(unmatchedFromEl, curChild);
            } else {
              handleNodeAdded(curChild);
            }
          } else {
            // recursively call for curChild and it's children to see if we find something in
            // fromNodesLookup
            handleNodeAdded(curChild);
          }

          curChild = nextSibling;
        }
      }

      function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
        // We have processed all of the "to nodes". If curFromNodeChild is
        // non-null then we still have some from nodes left over that need
        // to be removed
        while (curFromNodeChild) {
          var fromNextSibling = curFromNodeChild.nextSibling;

          if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
            // Since the node is keyed it might be matched up later so we defer
            // the actual removal to later
            addKeyedRemoval(curFromNodeKey);
          } else {
            // NOTE: we skip nested keyed nodes from being removed since there is
            //       still a chance they will be matched up later
            removeNode(curFromNodeChild, fromEl, true
            /* skip keyed nodes */
            );
          }

          curFromNodeChild = fromNextSibling;
        }
      }

      function morphEl(fromEl, toEl, childrenOnly) {
        var toElKey = getNodeKey(toEl);

        if (toElKey) {
          // If an element with an ID is being morphed then it will be in the final
          // DOM so clear it out of the saved elements collection
          delete fromNodesLookup[toElKey];
        }

        if (!childrenOnly) {
          // optional
          if (onBeforeElUpdated(fromEl, toEl) === false) {
            return;
          } // update attributes on original DOM element first


          morphAttrs(fromEl, toEl); // optional

          onElUpdated(fromEl);

          if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
            return;
          }
        }

        if (fromEl.nodeName !== 'TEXTAREA') {
          morphChildren(fromEl, toEl);
        } else {
          specialElHandlers.TEXTAREA(fromEl, toEl);
        }
      }

      function morphChildren(fromEl, toEl) {
        var curToNodeChild = toEl.firstChild;
        var curFromNodeChild = fromEl.firstChild;
        var curToNodeKey;
        var curFromNodeKey;
        var fromNextSibling;
        var toNextSibling;
        var matchingFromEl; // walk the children

        outer: while (curToNodeChild) {
          toNextSibling = curToNodeChild.nextSibling;
          curToNodeKey = getNodeKey(curToNodeChild); // walk the fromNode children all the way through

          while (curFromNodeChild) {
            fromNextSibling = curFromNodeChild.nextSibling;

            if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
              curToNodeChild = toNextSibling;
              curFromNodeChild = fromNextSibling;
              continue outer;
            }

            curFromNodeKey = getNodeKey(curFromNodeChild);
            var curFromNodeType = curFromNodeChild.nodeType; // this means if the curFromNodeChild doesnt have a match with the curToNodeChild

            var isCompatible = undefined;

            if (curFromNodeType === curToNodeChild.nodeType) {
              if (curFromNodeType === ELEMENT_NODE) {
                // Both nodes being compared are Element nodes
                if (curToNodeKey) {
                  // The target node has a key so we want to match it up with the correct element
                  // in the original DOM tree
                  if (curToNodeKey !== curFromNodeKey) {
                    // The current element in the original DOM tree does not have a matching key so
                    // let's check our lookup to see if there is a matching element in the original
                    // DOM tree
                    if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                      if (fromNextSibling === matchingFromEl) {
                        // Special case for single element removals. To avoid removing the original
                        // DOM node out of the tree (since that can break CSS transitions, etc.),
                        // we will instead discard the current node and wait until the next
                        // iteration to properly match up the keyed target element with its matching
                        // element in the original tree
                        isCompatible = false;
                      } else {
                        // We found a matching keyed element somewhere in the original DOM tree.
                        // Let's move the original DOM node into the current position and morph
                        // it.
                        // NOTE: We use insertBefore instead of replaceChild because we want to go through
                        // the `removeNode()` function for the node that is being discarded so that
                        // all lifecycle hooks are correctly invoked
                        fromEl.insertBefore(matchingFromEl, curFromNodeChild); // fromNextSibling = curFromNodeChild.nextSibling;

                        if (curFromNodeKey) {
                          // Since the node is keyed it might be matched up later so we defer
                          // the actual removal to later
                          addKeyedRemoval(curFromNodeKey);
                        } else {
                          // NOTE: we skip nested keyed nodes from being removed since there is
                          //       still a chance they will be matched up later
                          removeNode(curFromNodeChild, fromEl, true
                          /* skip keyed nodes */
                          );
                        }

                        curFromNodeChild = matchingFromEl;
                      }
                    } else {
                      // The nodes are not compatible since the "to" node has a key and there
                      // is no matching keyed node in the source tree
                      isCompatible = false;
                    }
                  }
                } else if (curFromNodeKey) {
                  // The original has a key
                  isCompatible = false;
                }

                isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);

                if (isCompatible) {
                  // We found compatible DOM elements so transform
                  // the current "from" node to match the current
                  // target DOM node.
                  // MORPH
                  morphEl(curFromNodeChild, curToNodeChild);
                }
              } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                // Both nodes being compared are Text or Comment nodes
                isCompatible = true; // Simply update nodeValue on the original node to
                // change the text value

                if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                  curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                }
              }
            }

            if (isCompatible) {
              // Advance both the "to" child and the "from" child since we found a match
              // Nothing else to do as we already recursively called morphChildren above
              curToNodeChild = toNextSibling;
              curFromNodeChild = fromNextSibling;
              continue outer;
            } // No compatible match so remove the old node from the DOM and continue trying to find a
            // match in the original DOM. However, we only do this if the from node is not keyed
            // since it is possible that a keyed node might match up with a node somewhere else in the
            // target tree and we don't want to discard it just yet since it still might find a
            // home in the final DOM tree. After everything is done we will remove any keyed nodes
            // that didn't find a home


            if (curFromNodeKey) {
              // Since the node is keyed it might be matched up later so we defer
              // the actual removal to later
              addKeyedRemoval(curFromNodeKey);
            } else {
              // NOTE: we skip nested keyed nodes from being removed since there is
              //       still a chance they will be matched up later
              removeNode(curFromNodeChild, fromEl, true
              /* skip keyed nodes */
              );
            }

            curFromNodeChild = fromNextSibling;
          } // END: while(curFromNodeChild) {}
          // If we got this far then we did not find a candidate match for
          // our "to node" and we exhausted all of the children "from"
          // nodes. Therefore, we will just append the current "to" node
          // to the end


          if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
            fromEl.appendChild(matchingFromEl); // MORPH

            morphEl(matchingFromEl, curToNodeChild);
          } else {
            var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);

            if (onBeforeNodeAddedResult !== false) {
              if (onBeforeNodeAddedResult) {
                curToNodeChild = onBeforeNodeAddedResult;
              }

              if (curToNodeChild.actualize) {
                curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
              }

              fromEl.appendChild(curToNodeChild);
              handleNodeAdded(curToNodeChild);
            }
          }

          curToNodeChild = toNextSibling;
          curFromNodeChild = fromNextSibling;
        }

        cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
        var specialElHandler = specialElHandlers[fromEl.nodeName];

        if (specialElHandler) {
          specialElHandler(fromEl, toEl);
        }
      } // END: morphChildren(...)


      var morphedNode = fromNode;
      var morphedNodeType = morphedNode.nodeType;
      var toNodeType = toNode.nodeType;

      if (!childrenOnly) {
        // Handle the case where we are given two DOM nodes that are not
        // compatible (e.g. <div> --> <span> or <div> --> TEXT)
        if (morphedNodeType === ELEMENT_NODE) {
          if (toNodeType === ELEMENT_NODE) {
            if (!compareNodeNames(fromNode, toNode)) {
              onNodeDiscarded(fromNode);
              morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
            }
          } else {
            // Going from an element node to a text node
            morphedNode = toNode;
          }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
          // Text or comment node
          if (toNodeType === morphedNodeType) {
            if (morphedNode.nodeValue !== toNode.nodeValue) {
              morphedNode.nodeValue = toNode.nodeValue;
            }

            return morphedNode;
          } else {
            // Text node to something else
            morphedNode = toNode;
          }
        }
      }

      if (morphedNode === toNode) {
        // The "to node" was not compatible with the "from node" so we had to
        // toss out the "from node" and use the "to node"
        onNodeDiscarded(fromNode);
      } else {
        if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
          return;
        }

        morphEl(morphedNode, toNode, childrenOnly); // We now need to loop over any keyed nodes that might need to be
        // removed. We only do the removal if we know that the keyed node
        // never found a match. When a keyed node is matched up we remove
        // it out of fromNodesLookup and we use fromNodesLookup to determine
        // if a keyed node has been matched up or not

        if (keyedRemovalList) {
          for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
            var elToRemove = fromNodesLookup[keyedRemovalList[i]];

            if (elToRemove) {
              removeNode(elToRemove, elToRemove.parentNode, false);
            }
          }
        }
      }

      if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
          morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        } // If we had to swap out the from node with a new node because the old
        // node was not compatible with the target node then we need to
        // replace the old DOM node in the original DOM tree. This is only
        // possible if the original DOM node was part of a DOM tree which
        // we know is the case if it has a parent node.


        fromNode.parentNode.replaceChild(morphedNode, fromNode);
      }

      return morphedNode;
    };
  }

  var morphdom = morphdomFactory(morphAttrs);

  var rafThrottle = function rafThrottle(callback) {
    var requestId = null;
    var lastArgs;

    var later = function later(context) {
      return function () {
        requestId = null;
        callback.apply(context, lastArgs);
      };
    };

    var throttled = function throttled() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      lastArgs = args;

      if (requestId === null) {
        requestId = requestAnimationFrame(later(this));
      }
    };

    throttled.cancel = function () {
      cancelAnimationFrame(requestId);
      requestId = null;
    };

    return throttled;
  };

  var rafThrottle_1 = rafThrottle;

  var squirrelly_min = {exports: {}};

  (function (module, exports) {
    !function (e, t) {
      t(exports) ;
    }(commonjsGlobal, function (e) {

      function t(e) {
        var n,
            r,
            a = new Error(e);
        return n = a, r = t.prototype, Object.setPrototypeOf ? Object.setPrototypeOf(n, r) : n.__proto__ = r, a;
      }

      function n(e, n, r) {
        var a = n.slice(0, r).split(/\n/),
            i = a.length,
            s = a[i - 1].length + 1;
        throw t(e += " at line " + i + " col " + s + ":\n\n  " + n.split(/\n/)[i - 1] + "\n  " + Array(s).join(" ") + "^");
      }

      t.prototype = Object.create(Error.prototype, {
        name: {
          value: "Squirrelly Error",
          enumerable: !1
        }
      });
      var r = new Function("return this")().Promise,
          a = !1;

      try {
        a = new Function("return (async function(){}).constructor")();
      } catch (e) {
        if (!(e instanceof SyntaxError)) throw e;
      }

      function i(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }

      function s(e, t, n) {
        for (var r in t) {
          i(t, r) && (null == t[r] || "object" != _typeof(t[r]) || "storage" !== r && "prefixes" !== r || n ? e[r] = t[r] : e[r] = s({}, t[r]));
        }

        return e;
      }

      var c = /^async +/,
          o = /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g,
          l = /'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g,
          f = /"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g,
          u = /[.*+\-?^${}()|[\]\\]/g;

      function p(e) {
        return u.test(e) ? e.replace(u, "\\$&") : e;
      }

      function h(e, r) {
        r.rmWhitespace && (e = e.replace(/[\r\n]+/g, "\n").replace(/^\s+|\s+$/gm, "")), o.lastIndex = 0, l.lastIndex = 0, f.lastIndex = 0;
        var a = r.prefixes,
            i = [a.h, a.b, a.i, a.r, a.c, a.e].reduce(function (e, t) {
          return e && t ? e + "|" + p(t) : t ? p(t) : e;
        }, ""),
            s = new RegExp("([|()]|=>)|('|\"|`|\\/\\*)|\\s*((\\/)?(-|_)?" + p(r.tags[1]) + ")", "g"),
            u = new RegExp("([^]*?)" + p(r.tags[0]) + "(-|_)?\\s*(" + i + ")?\\s*", "g"),
            h = 0,
            d = !1;

        function g(t, a) {
          var i,
              p = {
            f: []
          },
              g = 0,
              v = "c";

          function m(t) {
            var a = e.slice(h, t),
                i = a.trim();
            if ("f" === v) "safe" === i ? p.raw = !0 : r.async && c.test(i) ? (i = i.replace(c, ""), p.f.push([i, "", !0])) : p.f.push([i, ""]);else if ("fp" === v) p.f[p.f.length - 1][1] += i;else if ("err" === v) {
              if (i) {
                var s = a.search(/\S/);
                n("invalid syntax", e, h + s);
              }
            } else p[v] = i;
            h = t + 1;
          }

          for ("h" === a || "b" === a || "c" === a ? v = "n" : "r" === a && (p.raw = !0, a = "i"), s.lastIndex = h; null !== (i = s.exec(e));) {
            var y = i[1],
                x = i[2],
                b = i[3],
                w = i[4],
                F = i[5],
                S = i.index;
            if (y) "(" === y ? (0 === g && ("n" === v ? (m(S), v = "p") : "f" === v && (m(S), v = "fp")), g++) : ")" === y ? 0 === --g && "c" !== v && (m(S), v = "err") : 0 === g && "|" === y ? (m(S), v = "f") : "=>" === y && (m(S), h += 1, v = "res");else if (x) {
              if ("/*" === x) {
                var I = e.indexOf("*/", s.lastIndex);
                -1 === I && n("unclosed comment", e, i.index), s.lastIndex = I + 2;
              } else if ("'" === x) {
                l.lastIndex = i.index, l.exec(e) ? s.lastIndex = l.lastIndex : n("unclosed string", e, i.index);
              } else if ('"' === x) {
                f.lastIndex = i.index, f.exec(e) ? s.lastIndex = f.lastIndex : n("unclosed string", e, i.index);
              } else if ("`" === x) {
                o.lastIndex = i.index, o.exec(e) ? s.lastIndex = o.lastIndex : n("unclosed string", e, i.index);
              }
            } else if (b) return m(S), h = S + i[0].length, u.lastIndex = h, d = F, w && "h" === a && (a = "s"), p.t = a, p;
          }

          return n("unclosed tag", e, t), p;
        }

        var v = function i(s, o) {
          s.b = [], s.d = [];
          var l,
              f = !1,
              p = [];

          function v(e, t) {
            e && (e = function (e, t, n, r) {
              var a, i;
              return "string" == typeof t.autoTrim ? a = i = t.autoTrim : Array.isArray(t.autoTrim) && (a = t.autoTrim[1], i = t.autoTrim[0]), (n || !1 === n) && (a = n), (r || !1 === r) && (i = r), "slurp" === a && "slurp" === i ? e.trim() : ("_" === a || "slurp" === a ? e = String.prototype.trimLeft ? e.trimLeft() : e.replace(/^[\s\uFEFF\xA0]+/, "") : "-" !== a && "nl" !== a || (e = e.replace(/^(?:\n|\r|\r\n)/, "")), "_" === i || "slurp" === i ? e = String.prototype.trimRight ? e.trimRight() : e.replace(/[\s\uFEFF\xA0]+$/, "") : "-" !== i && "nl" !== i || (e = e.replace(/(?:\n|\r|\r\n)$/, "")), e);
            }(e, r, d, t)) && (e = e.replace(/\\|'/g, "\\$&").replace(/\r\n|\n|\r/g, "\\n"), p.push(e));
          }

          for (; null !== (l = u.exec(e));) {
            var m,
                y = l[1],
                x = l[2],
                b = l[3] || "";

            for (var w in a) {
              if (a[w] === b) {
                m = w;
                break;
              }
            }

            v(y, x), h = l.index + l[0].length, m || n("unrecognized tag type: " + b, e, h);
            var F = g(l.index, m),
                S = F.t;

            if ("h" === S) {
              var I = F.n || "";
              r.async && c.test(I) && (F.a = !0, F.n = I.replace(c, "")), F = i(F), p.push(F);
            } else if ("c" === S) {
              if (s.n === F.n) return f ? (f.d = p, s.b.push(f)) : s.d = p, s;
              n("Helper start and end don't match", e, l.index + l[0].length);
            } else if ("b" === S) {
              f ? (f.d = p, s.b.push(f)) : s.d = p;
              var R = F.n || "";
              r.async && c.test(R) && (F.a = !0, F.n = R.replace(c, "")), f = F, p = [];
            } else if ("s" === S) {
              var T = F.n || "";
              r.async && c.test(T) && (F.a = !0, F.n = T.replace(c, "")), p.push(F);
            } else p.push(F);
          }

          if (!o) throw t('unclosed helper "' + s.n + '"');
          return v(e.slice(h, e.length), !1), s.d = p, s;
        }({
          f: []
        }, !0);

        if (r.plugins) for (var m = 0; m < r.plugins.length; m++) {
          var y = r.plugins[m];
          y.processAST && (v.d = y.processAST(v.d, r));
        }
        return v.d;
      }

      function d(e, t) {
        var n = h(e, t),
            r = "var tR='';" + (t.useWith ? "with(" + t.varName + "||{}){" : "") + x(n, t) + "if(cb){cb(null,tR)} return tR" + (t.useWith ? "}" : "");
        if (t.plugins) for (var a = 0; a < t.plugins.length; a++) {
          var i = t.plugins[a];
          i.processFnString && (r = i.processFnString(r, t));
        }
        return r;
      }

      function g(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n][0],
              a = t[n][1];
          e = (t[n][2] ? "await " : "") + "c.l('F','" + r + "')(" + e, a && (e += "," + a), e += ")";
        }

        return e;
      }

      function v(e, t, n, r, a, i) {
        var s = "{exec:" + (a ? "async " : "") + y(n, t, e) + ",params:[" + r + "]";
        return i && (s += ",name:'" + i + "'"), a && (s += ",async:true"), s += "}";
      }

      function m(e, t) {
        for (var n = "[", r = 0; r < e.length; r++) {
          var a = e[r];
          n += v(t, a.res || "", a.d, a.p || "", a.a, a.n), r < e.length && (n += ",");
        }

        return n += "]";
      }

      function y(e, t, n) {
        return "function(" + t + "){var tR='';" + x(e, n) + "return tR}";
      }

      function x(e, t) {
        for (var n = 0, r = e.length, a = ""; n < r; n++) {
          var i = e[n];

          if ("string" == typeof i) {
            a += "tR+='" + i + "';";
          } else {
            var s = i.t,
                c = i.c || "",
                o = i.f,
                l = i.n || "",
                f = i.p || "",
                u = i.res || "",
                p = i.b,
                h = !!i.a;

            if ("i" === s) {
              t.defaultFilter && (c = "c.l('F','" + t.defaultFilter + "')(" + c + ")");
              var d = g(c, o);
              !i.raw && t.autoEscape && (d = "c.l('F','e')(" + d + ")"), a += "tR+=" + d + ";";
            } else if ("h" === s) {
              if (t.storage.nativeHelpers.get(l)) a += t.storage.nativeHelpers.get(l)(i, t);else {
                var y = (h ? "await " : "") + "c.l('H','" + l + "')(" + v(t, u, i.d, f, h);
                y += p ? "," + m(p, t) : ",[]", a += "tR+=" + g(y += ",c)", o) + ";";
              }
            } else "s" === s ? a += "tR+=" + g((h ? "await " : "") + "c.l('H','" + l + "')({params:[" + f + "]},[],c)", o) + ";" : "e" === s && (a += c + "\n");
          }
        }

        return a;
      }

      var b = function () {
        function e(e) {
          this.cache = e;
        }

        return e.prototype.define = function (e, t) {
          this.cache[e] = t;
        }, e.prototype.get = function (e) {
          return this.cache[e];
        }, e.prototype.remove = function (e) {
          delete this.cache[e];
        }, e.prototype.reset = function () {
          this.cache = {};
        }, e.prototype.load = function (e) {
          s(this.cache, e, !0);
        }, e;
      }();

      function w(e, n, r, a) {
        if (n && n.length > 0) throw t((a ? "Native" : "") + "Helper '" + e + "' doesn't accept blocks");
        if (r && r.length > 0) throw t((a ? "Native" : "") + "Helper '" + e + "' doesn't accept filters");
      }

      var F = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };

      function S(e) {
        return F[e];
      }

      var I = new b({}),
          R = new b({
        each: function each(e, t) {
          var n = "",
              r = e.params[0];
          if (w("each", t, !1), e.async) return new Promise(function (t) {
            !function e(t, n, r, a, i) {
              r(t[n], n).then(function (s) {
                a += s, n === t.length - 1 ? i(a) : e(t, n + 1, r, a, i);
              });
            }(r, 0, e.exec, n, t);
          });

          for (var a = 0; a < r.length; a++) {
            n += e.exec(r[a], a);
          }

          return n;
        },
        foreach: function foreach(e, t) {
          var n = e.params[0];
          if (w("foreach", t, !1), e.async) return new Promise(function (t) {
            !function e(t, n, r, a, i, s) {
              a(n[r], t[n[r]]).then(function (c) {
                i += c, r === n.length - 1 ? s(i) : e(t, n, r + 1, a, i, s);
              });
            }(n, Object.keys(n), 0, e.exec, "", t);
          });
          var r = "";

          for (var a in n) {
            i(n, a) && (r += e.exec(a, n[a]));
          }

          return r;
        },
        include: function include(e, n, r) {
          w("include", n, !1);
          var a = r.storage.templates.get(e.params[0]);
          if (!a) throw t('Could not fetch template "' + e.params[0] + '"');
          return a(e.params[1], r);
        },
        "extends": function _extends(e, n, r) {
          var a = e.params[1] || {};
          a.content = e.exec();

          for (var i = 0; i < n.length; i++) {
            var s = n[i];
            a[s.name] = s.exec();
          }

          var c = r.storage.templates.get(e.params[0]);
          if (!c) throw t('Could not fetch template "' + e.params[0] + '"');
          return c(a, r);
        },
        useScope: function useScope(e, t) {
          return w("useScope", t, !1), e.exec(e.params[0]);
        }
      }),
          T = new b({
        "if": function _if(e, t) {
          w("if", !1, e.f, !0);
          var n = "if(" + e.p + "){" + x(e.d, t) + "}";
          if (e.b) for (var r = 0; r < e.b.length; r++) {
            var a = e.b[r];
            "else" === a.n ? n += "else{" + x(a.d, t) + "}" : "elif" === a.n && (n += "else if(" + a.p + "){" + x(a.d, t) + "}");
          }
          return n;
        },
        "try": function _try(e, n) {
          if (w("try", !1, e.f, !0), !e.b || 1 !== e.b.length || "catch" !== e.b[0].n) throw t("native helper 'try' only accepts 1 block, 'catch'");
          var r = "try{" + x(e.d, n) + "}",
              a = e.b[0];
          return r += "catch" + (a.res ? "(" + a.res + ")" : "") + "{" + x(a.d, n) + "}";
        },
        block: function block(e, t) {
          return w("block", e.b, e.f, !0), "if(!" + t.varName + "[" + e.p + "]){tR+=(" + y(e.d, "", t) + ")()}else{tR+=" + t.varName + "[" + e.p + "]}";
        }
      }),
          E = new b({
        e: function e(_e) {
          var t = String(_e);
          return /[&<>"']/.test(t) ? t.replace(/[&<>"']/g, S) : t;
        }
      }),
          j = {
        varName: "it",
        autoTrim: [!1, "nl"],
        autoEscape: !0,
        defaultFilter: !1,
        tags: ["{{", "}}"],
        l: function l(e, n) {
          if ("H" === e) {
            var r = this.storage.helpers.get(n);
            if (r) return r;
            throw t("Can't find helper '" + n + "'");
          }

          if ("F" === e) {
            var a = this.storage.filters.get(n);
            if (a) return a;
            throw t("Can't find filter '" + n + "'");
          }
        },
        async: !1,
        storage: {
          helpers: R,
          nativeHelpers: T,
          filters: E,
          templates: I
        },
        prefixes: {
          h: "@",
          b: "#",
          i: "",
          r: "*",
          c: "/",
          e: "!"
        },
        cache: !1,
        plugins: [],
        useWith: !1
      };

      function H(e, t) {
        var n = {};
        return s(n, j), t && s(n, t), e && s(n, e), n.l.bind(n), n;
      }

      function O(e, n) {
        var r = H(n || {}),
            i = Function;

        if (r.async) {
          if (!a) throw t("This environment doesn't support async/await");
          i = a;
        }

        try {
          return new i(r.varName, "c", "cb", d(e, r));
        } catch (n) {
          throw n instanceof SyntaxError ? t("Bad template syntax\n\n" + n.message + "\n" + Array(n.message.length + 1).join("=") + "\n" + d(e, r)) : n;
        }
      }

      function _(e, t) {
        var n;
        return t.cache && t.name && t.storage.templates.get(t.name) ? t.storage.templates.get(t.name) : (n = "function" == typeof e ? e : O(e, t), t.cache && t.name && t.storage.templates.define(t.name, n), n);
      }

      j.l.bind(j), e.compile = O, e.compileScope = x, e.compileScopeIntoFunction = y, e.compileToString = d, e.defaultConfig = j, e.filters = E, e.getConfig = H, e.helpers = R, e.nativeHelpers = T, e.parse = h, e.render = function (e, n, a, i) {
        var s = H(a || {});
        if (!s.async) return _(e, s)(n, s);

        if (!i) {
          if ("function" == typeof r) return new r(function (t, r) {
            try {
              t(_(e, s)(n, s));
            } catch (e) {
              r(e);
            }
          });
          throw t("Please provide a callback function, this env doesn't support Promises");
        }

        try {
          _(e, s)(n, s, i);
        } catch (e) {
          return i(e);
        }
      }, e.templates = I, Object.defineProperty(e, "__esModule", {
        value: !0
      });
    });
  })(squirrelly_min, squirrelly_min.exports);

  var cjs = {};

  Object.defineProperty(cjs, '__esModule', {
    value: true
  });
  /* eslint-disable no-undefined,no-param-reassign,no-shadow */

  /**
   * Throttle execution of a function. Especially useful for rate limiting
   * execution of handlers on events like resize and scroll.
   *
   * @param  {number}    delay -          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
   * @param  {boolean}   [noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
   *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
   *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
   *                                    the internal counter is reset).
   * @param  {Function}  callback -       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
   *                                    to `callback` when the throttled-function is executed.
   * @param  {boolean}   [debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
   *                                    schedule `callback` to execute after `delay` ms.
   *
   * @returns {Function}  A new, throttled, function.
   */

  function throttle(delay, noTrailing, callback, debounceMode) {
    /*
     * After wrapper has stopped being called, this timeout ensures that
     * `callback` is executed at the proper times in `throttle` and `end`
     * debounce modes.
     */
    var timeoutID;
    var cancelled = false; // Keep track of the last time `callback` was executed.

    var lastExec = 0; // Function to clear existing timeout

    function clearExistingTimeout() {
      if (timeoutID) {
        clearTimeout(timeoutID);
      }
    } // Function to cancel next exec


    function cancel() {
      clearExistingTimeout();
      cancelled = true;
    } // `noTrailing` defaults to falsy.


    if (typeof noTrailing !== 'boolean') {
      debounceMode = callback;
      callback = noTrailing;
      noTrailing = undefined;
    }
    /*
     * The `wrapper` function encapsulates all of the throttling / debouncing
     * functionality and when executed will limit the rate at which `callback`
     * is executed.
     */


    function wrapper() {
      for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
        arguments_[_key] = arguments[_key];
      }

      var self = this;
      var elapsed = Date.now() - lastExec;

      if (cancelled) {
        return;
      } // Execute `callback` and update the `lastExec` timestamp.


      function exec() {
        lastExec = Date.now();
        callback.apply(self, arguments_);
      }
      /*
       * If `debounceMode` is true (at begin) this is used to clear the flag
       * to allow future `callback` executions.
       */


      function clear() {
        timeoutID = undefined;
      }

      if (debounceMode && !timeoutID) {
        /*
         * Since `wrapper` is being called for the first time and
         * `debounceMode` is true (at begin), execute `callback`.
         */
        exec();
      }

      clearExistingTimeout();

      if (debounceMode === undefined && elapsed > delay) {
        /*
         * In throttle mode, if `delay` time has been exceeded, execute
         * `callback`.
         */
        exec();
      } else if (noTrailing !== true) {
        /*
         * In trailing throttle mode, since `delay` time has not been
         * exceeded, schedule `callback` to execute `delay` ms after most
         * recent execution.
         *
         * If `debounceMode` is true (at begin), schedule `clear` to execute
         * after `delay` ms.
         *
         * If `debounceMode` is false (at end), schedule `callback` to
         * execute after `delay` ms.
         */
        timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
      }
    }

    wrapper.cancel = cancel; // Return the wrapper function.

    return wrapper;
  }
  /* eslint-disable no-undefined */

  /**
   * Debounce execution of a function. Debouncing, unlike throttling,
   * guarantees that a function is only executed a single time, either at the
   * very beginning of a series of calls, or at the very end.
   *
   * @param  {number}   delay -         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
   * @param  {boolean}  [atBegin] -     Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
   *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
   *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
   * @param  {Function} callback -      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
   *                                  to `callback` when the debounced-function is executed.
   *
   * @returns {Function} A new, debounced function.
   */


  function debounce(delay, atBegin, callback) {
    return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
  }

  cjs.debounce = debounce;
  var throttle_1 = cjs.throttle = throttle;

  var RIsland = function () {
    function RIsland(config) {
      var _this = this;

      this._initialConfig = {
        $element: document.body,
        deepmerge: {
          clone: false,
          isMergeableObject: isPlainObject
        },
        delegations: {},
        initialState: {},
        load: function load() {},
        morphdom: {
          onBeforeElUpdated: function onBeforeElUpdated($fromEl, $toEl) {
            return !$fromEl.isEqualNode($toEl);
          }
        },
        shouldUpdate: function shouldUpdate(state, nextState) {
          return !fastDeepEqual(state, nextState);
        },
        squirrelly: _assign(_assign({}, squirrelly_min.exports.defaultConfig), {
          varName: 'state'
        }),
        template: '',
        unload: function unload() {},
        update: function update() {}
      };
      this._delegationFuncs = {};
      this._loaded = false;
      this._throttledRender = rafThrottle_1(this._render);
      this._config = cjs$1(this._initialConfig, cloneDeep_1(config), this._initialConfig.deepmerge);
      this._compiledTemplate = squirrelly_min.exports.compile(this._getTemplate(this._config.template), this._config.squirrelly);

      this._setState(this._config.initialState);

      Object.keys(this._config.delegations).forEach(function (eventName) {
        _this._delegationFuncs[eventName] = function (event) {
          Object.keys(_this._config.delegations[eventName]).forEach(function (selector) {
            if (event.target instanceof HTMLElement && event.target.closest(selector) !== null) {
              _this._config.delegations[eventName][selector](event, cloneDeep_1(_this._state), _this._setState.bind(_this));
            }
          });
        };

        var throttling = _this._getThrottling(eventName);

        if (throttling.throttled === true) {
          if ('ms' in throttling) {
            _this._delegationFuncs[eventName] = throttle_1(throttling.ms, _this._delegationFuncs[eventName]);
          } else {
            _this._delegationFuncs[eventName] = rafThrottle_1(_this._delegationFuncs[eventName]);
          }
        }

        _this._config.$element.addEventListener(throttling.eventName, _this._delegationFuncs[eventName]);
      });
    }

    RIsland.prototype.unload = function () {
      var _this = this;

      Object.keys(this._config.delegations).forEach(function (eventName) {
        _this._config.$element.removeEventListener(eventName, _this._delegationFuncs[eventName]);
      });
      this._config.$element.innerHTML = '';

      this._config.unload(cloneDeep_1(this._state));
    };

    RIsland.prototype._setState = function (nextState) {
      var _this = this;

      var tmpState = typeof nextState === 'function' ? nextState(cloneDeep_1(this._state)) : nextState;

      if (tmpState === null) {
        return;
      }

      if (tmpState instanceof Promise) {
        tmpState.then(function (thenState) {
          return _this._setState(thenState);
        });
        return;
      }

      if (Array.isArray(tmpState)) {
        tmpState.forEach(function (eachState) {
          return _this._setState(eachState);
        });
        return;
      }

      var tmpMergedState = 'customMerge' in this._config.deepmerge ? cjs$1(cloneDeep_1(this._state), tmpState, this._config.deepmerge) : cjs$1(this._state, tmpState, this._config.deepmerge);
      var shouldUpdate = this._config.shouldUpdate === this._initialConfig.shouldUpdate ? this._config.shouldUpdate(this._state, tmpMergedState) : this._config.shouldUpdate(cloneDeep_1(this._state), 'customMerge' in this._config.deepmerge ? tmpMergedState : cloneDeep_1(tmpMergedState));
      this._state = tmpMergedState;

      if (shouldUpdate === true) {
        this._throttledRender();
      }
    };

    RIsland.prototype._render = function () {
      var _this = this;

      if (this._config.$element.firstChild === null) {
        this._config.$element.appendChild(document.createElement('div'));
      }

      morphdom(this._config.$element.firstChild, this._compiledTemplate(this._state, this._config.squirrelly), _assign(_assign({}, this._config.morphdom), {
        onElUpdated: function onElUpdated($element) {
          var state = cloneDeep_1(_this._state);

          if (_this._loaded === false) {
            _this._loaded = true;

            _this._config.load(state, _this._setState.bind(_this));
          } else {
            _this._config.update(state, _this._setState.bind(_this));
          }

          if ('onElUpdated' in _this._config.morphdom) {
            _this._config.morphdom.onElUpdated($element);
          }
        }
      }));
    };

    RIsland.prototype._getTemplate = function (template) {
      if (typeof template === 'string') {
        return template;
      }

      if (_typeof(template) === 'object' && 'content' in template && template.content instanceof DocumentFragment) {
        var $textarea = document.createElement('textarea');
        $textarea.innerHTML = Array.from(template.content.childNodes).map(function (childNode) {
          return childNode.outerHTML;
        }).join('');
        return $textarea.value;
      }

      return '<p style="color:red;">Error: template must be a string or a template tag element.</p>';
    };

    RIsland.prototype._getThrottling = function (eventName) {
      var chunks = eventName.split(/\./g);

      if (chunks.length > 1 && chunks[1] === 'throttled') {
        if (chunks.length === 3) {
          var ms = parseInt(chunks[2], 10);

          if (!isNaN(ms)) {
            return {
              eventName: chunks[0],
              ms: ms,
              throttled: true
            };
          }
        }

        return {
          eventName: chunks[0],
          throttled: true
        };
      }

      return {
        eventName: chunks[0],
        throttled: false
      };
    };

    return RIsland;
  }();

  return RIsland;

}));