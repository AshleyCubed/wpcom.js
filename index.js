
/**
 * Module dependencies.
 */

var Me = require('./lib/me');
var Site = require('./lib/site');
var req = require('./lib/req');
var debug = require('debug')('wp-connect');

/**
 * Wordpress connect class
 *
 * @param {String} token
 * @api public
 */

function WPCONN(token){
  if (!(this instanceof WPCONN)) return new WPCONN(token);

  this.tkn = token;

  // request instance
  this.req = new req(this);

  // resource methods
  this.me = new Me(this);
  this.site = new Site(this);
}

/**
 * User profile
 *
 * @param {Function} fn
 * @api private
 */

WPCONN.prototype.me = function (fn){
  this.req.exec('me', null, fn);
};

/**
 * List of sites current user is member of
 *
 * @param {Function} fn
 * @api private
 */

WPCONN.prototype.sites = function (fn){
  this.req.exec('sites', null, fn);
};

/**
 * Expose `WPCONN` module
 */

module.exports = WPCONN;
