
/**
 * Module dependencies.
 */

var Me = require('./lib/me');
var Site = require('./lib/site');
var req = require('./lib/req');
var debug = require('debug')('wpcom');

/**
 * WordPress REST-API class
 *
 * @param {String} token (optional)
 * @api public
 */

function WPCOM(token){
  if (!(this instanceof WPCOM)) return new WPCOM(token);

  this.tkn = token;

  // request instance
  this.req = new req(this);

  // add methods
  this.me = new Me(this);
}

/**
 * Get site object instance
 *
 * @api public
 */

WPCOM.prototype.getSite = function(id){
  return Site(id, this);
};

/**
 * Expose `WPCOM` module
 */

module.exports = WPCOM;
