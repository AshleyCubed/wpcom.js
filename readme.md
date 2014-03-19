
# Wordpress connect module

  Layer to get resources from WordPress using the REST API

```js
var WPCONN = require('wp-connect');
var wpconn = new WPCONN();

// set access token
wpconn.setToken('<your token>');

// get the user info
wpconn.me(function(err, user){
  // user info related with the given access token
});

// get site info
wpconn.site.setId('blog.wordpress.com');
wpconn.site.info(function(err, site){
  // site object data
});

// get ten posts from site
wpconn.site.posts({ number: 10 }, function(err, posts){
  // array posts
});

// get post info
wpconn.site.post.setId('34163');
wpconn.site.post.info(function(err, post){
  // post object data
});
```

## How to use

### Create the wp connect object and require resource

```js
var WPCONN = require('wp-connect');
var wpconn = new WPCONN();
```

## API

### WPConn#me()

Request the user profile

```js
var WPCONN = require('wp-connect');
var wpconn = new WPCONN();

wpconn.setToken('<token>');

wpconn.me(function(err, user){
  if (err) return console.log(err);
  // user object
});
```

### WPConn.site

## License

MIT – Copyright 2014 Automattic
