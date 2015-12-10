/**
 * Module dependencies.
 */
var Post = require( './site.post' );
var Category = require( './site.category' );
var Tag = require( './site.tag' );
var Media = require( './site.media' );
var Comment = require( './site.comment' );
var SiteWordAds = require( './site.wordads' );
var Follow = require( './site.follow' );
var debug = require( 'debug' )( 'wpcom:site' );

/**
 * Resources array
 * A list of endpoints with the same structure
 */
var resources = [
	'categories',
	'comments',
	'follows',
	'media',
	'posts',
	'shortcodes',
	'embeds',
	[ 'pageTemplates', 'page-templates' ],
	[ 'stats', 'stats' ],
	[ 'statsClicks', 'stats/clicks' ],
	[ 'statsComments', 'stats/comments' ],
	[ 'statsCommentFollowers', 'stats/comment-followers' ],
	[ 'statsCountryViews', 'stats/country-views' ],
	[ 'statsFollowers', 'stats/followers' ],
	[ 'statsPublicize', 'stats/publicize' ],
	[ 'statsReferrers', 'stats/referrers' ],
	[ 'statsSearchTerms', 'stats/search-terms' ],
	[ 'statsStreak', 'stats/streak' ],
	[ 'statsSummary', 'stats/summary' ],
	[ 'statsTags', 'stats/tags' ],
	[ 'statsTopAuthors', 'stats/top-authors' ],
	[ 'statsTopPosts', 'stats/top-posts' ],
	[ 'statsVideoPlays', 'stats/video-plays' ],
	[ 'statsVisits', 'stats/visits' ],
	'tags',
	'users'
];

/**
 * Create a Site instance
 *
 * @param {String} id - site id
 * @param {WPCOM} wpcom - wpcom instance
 * @return {Null} null
 */
function Site( id, wpcom ) {
	if ( ! ( this instanceof Site ) ) {
		return new Site( id, wpcom );
	}

	this.wpcom = wpcom;

	debug( 'set %o site id', id );
	this._id = encodeURIComponent( id );
}

/**
 * Require site information
 *
 * @param {Object} [query] - query object parameter
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Site.prototype.get = function( query, fn ) {
	return this.wpcom.req.get( '/sites/' + this._id, query, fn );
};

/**
 * List method builder
 *
 * @param {String} subpath - endpoint sub path
 * @return {String} list method endpoint path
 */
function list( subpath ) {
	/**
	 * Create and return the <names>List method
	 *
	 * @param {Object} [query] - query object parameter
	 * @param {Function} fn - callback function
	 */

	var listMethod = function( query, fn ) {
		var path = '/sites/' + this._id + '/' + subpath;
		return this.wpcom.req.get( path, query, fn );
	};
	listMethod._publicAPI = true;
	return listMethod;
}

// walk for each resource and create related method
let i, res, isarr, name, subpath;
for ( i = 0; i < resources.length; i++ ) {
	res = resources[i];
	isarr = Array.isArray( res );

	name = isarr ? res[0] : res + 'List';
	subpath = isarr ? res[1] : res;

	debug( 'adding method: %o - sub-path: %o - version: %s', ( 'site.' + name + '()' ), subpath );
	Site.prototype[name] = list( subpath );
}

/**
 * Create a `Post` instance
 *
 * @param {String} id - post id
 * @return {Post} Post instance
 */
Site.prototype.post = function( id ) {
	return new Post( id, this._id, this.wpcom );
};

/**
 * Add a new blog post
 *
 * @param {Object} body - body object parameter
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Site.prototype.addPost = function( body, fn ) {
	var post = new Post( null, this._id, this.wpcom );
	return post.add( body, fn );
};

/**
 * Delete a blog post
 *
 * @param {String} id - post id
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Site.prototype.deletePost = function( id, fn ) {
	var post = new Post( id, this._id, this.wpcom );
	return post.delete( fn );
};

/**
 * Create a `Media` instance
 *
 * @param {String} id - post id
 * @return {Media} Media instance
 */
Site.prototype.media = function( id ) {
	return new Media( id, this._id, this.wpcom );
};

/**
 * Add a media from a file
 *
 * @param {Object} [query] - query object parameter
 * @param {Array|String} files - media files to add
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Site.prototype.addMediaFiles = function( query, files, fn ) {
	var media = new Media( null, this._id, this.wpcom );
	return media.addFiles( query, files, fn );
};

/**
 * Add a new media from url
 *
 * @param {Object} [query] - query object parameter
 * @param {Array|String} files - media files to add
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Site.prototype.addMediaUrls = function( query, files, fn ) {
	var media = new Media( null, this._id, this.wpcom );
	return media.addUrls( query, files, fn );
};

/**
 * Delete a blog media
 *
 * @param {String} id - media id
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Site.prototype.deleteMedia = function( id, fn ) {
	var media = new Media( id, this._id, this.wpcom );
	return media.del( fn );
};

/**
 * Create a `Comment` instance
 *
 * @param {String} id - comment id
 * @return {Comment} Comment instance
 */
Site.prototype.comment = function( id ) {
	return new Comment( id, null, this._id, this.wpcom );
};

/**
 * Create a `Follow` instance
 *
 * @return {Follow} Follow instance
 */
Site.prototype.follow = function() {
	return new Follow( this._id, this.wpcom );
};

/**
 * Create a `Category` instance
 * Set `cat` alias
 *
 * @param {String} [slug] - category slug
 * @return {Category} Category instance
 */
Site.prototype.cat = Site.prototype.category = function( slug ) {
	return new Category( slug, this._id, this.wpcom );
};

/**
 * Create a `Tag` instance
 *
 * @param {String} [slug] - tag slug
 * @return {Tag} Tag instance
 */
Site.prototype.tag = function( slug ) {
	return new Tag( slug, this._id, this.wpcom );
};

/**
 * Get a rendered shortcode for a site.
 *
 * Note: The current user must have publishing access.
 *
 * @param {String} url - shortcode url
 * @param {Object} [query] - query object parameter
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Site.prototype.renderShortcode = function( url, query, fn ) {
	if ( 'string' !== typeof url ) {
		throw new TypeError( 'expected a url String' );
	}

	if ( 'function' === typeof query ) {
		fn = query;
		query = {};
	}

	query = query || {};
	query.shortcode = url;

	let path = '/sites/' + this._id + '/shortcodes/render';

	return this.wpcom.req.get( path, query, fn );
};

/**
 * Get a rendered embed for a site.
 *
 * Note: The current user must have publishing access.
 *
 * @param {String} url - embed url
 * @param {Object} [query] - query object parameter
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Site.prototype.renderEmbed = function( url, query, fn ) {
	if ( 'string' !== typeof url ) {
		throw new TypeError( 'expected an embed String' );
	}

	if ( 'function' === typeof query ) {
		fn = query;
		query = {};
	}

	query = query || {};
	query.embed_url = url;

	let path = '/sites/' + this._id + '/embeds/render';
	return this.wpcom.req.get( path, query, fn );
};

/**
 * Mark a referrering domain as spam
 *
 * @param {String} domain - domain
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Site.prototype.statsReferrersSpamNew = function( domain, fn ) {
	var path = '/sites/' + this._id + '/stats/referrers/spam/new';
	var body = { domain: domain };

	return this.wpcom.req.post( path, body, null, fn );
};

/**
 * Remove referrering domain from spam
 *
 * @param {String} domain - domain
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Site.prototype.statsReferrersSpamDelete = function( domain, fn ) {
	var path = '/sites/' + this._id + '/stats/referrers/spam/delete';
	var body = { domain: domain };

	return this.wpcom.req.post( path, body, null, fn );
};

/**
 * Get detailed stats about a VideoPress video
 *
 * @param {String} videoId - video id
 * @param {Object} [query] - query object parameter
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Site.prototype.statsVideo = function( videoId, query, fn ) {
	var path = '/sites/' + this._id + '/stats/video/' + videoId;

	if ( 'function' === typeof query ) {
		fn = query;
		query = {};
	}

	return this.wpcom.req.get( path, query, fn );
};

/**
 * Get detailed stats about a particular post
 *
 * @param {String} postId - post id
 * @param {Object} [query] - query object parameter
 * @param {Function} fn - callback function
 * @return {Function} request handler
 */
Site.prototype.statsPostViews = function( postId, query, fn ) {
	var path = '/sites/' + this._id + '/stats/post/' + postId;

	if ( 'function' === typeof query ) {
		fn = query;
		query = {};
	}

	return this.wpcom.req.get( path, query, fn );
};

/**
 * Return a `SiteWordAds` instance.
 *
 * *Example:*
 *    // Create a SiteWordAds instance
 *
 *    var wordAds = wpcom
 *      .site( 'my-blog.wordpress.com' )
 *      .wordAds();
 *
 * @return {SiteWordAds} SiteWordAds instance
 */
Site.prototype.wordAds = function() {
	return new SiteWordAds( this._id, this.wpcom );
};

/**
 * Expose `Site` module
 */
module.exports = Site;
