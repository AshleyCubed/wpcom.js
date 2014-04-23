# wpcom.js

  [WordPress.com][] JavaScript API client designed for Node.JS and
  browsers.

## How to use

### Node.JS

Introduce the `wpcom` dependency in your `package.json`, and
then initialize it with your API Token.

```js
var wpcom = require('wpcom')('<your-token>');
var blog = wpcom.site('your-blog.wordpress.com');
blog.posts({ number: 8 }, function(err, list){});
```

### Browser

Include `dist/wpcom.js` in a `<script>` tag:

```html
<script src="wpcom.js"></script>
<script>
  var wpcom = WPCOM('<your-token>');
  var blog = wpcom.site('your-blog.wordpress.com');
  blog.posts({ number: 8 }, function(err, list){});
</script>
```

## API

### new WPCOM('token');

Create a new instance of WPCOM. `token` parameter is optional but it's needed to
make admin actions or to access to protected resources.

**Note**: You can use the [node-wpcom-oauth][] module to get an _access token_.

### WPCOM#me()

Create a `Me` object. More info in [Me doc page](./doc/me.md).

```js
var wpcom = require('wpcom')('<your-token>');
var me = wpcom.me();

// get user information
me.get(function(err, info){
});
```

### WPCOM#site('site-id')

Create a `Site` object. More info in [Site doc page](./doc/site.md).

```js
var wpcom = require('wpcom')('<your-token>');
var site = wpcom.site();

// get blog posts
site.posts(function(err, list){
});
```

## Examples

[Examples](./example/Readme.md) doc page

## Test

Create `data.json` file into `test/` folder to can run the tests. You can copy
or rename the `test/data_example.json` file.

```json
{
  "token": {
    "global": "<global token>"
  },

  "site": {
    "public": {
      "url": "<public blog url>"
    },
    "private" : {
      "url": "<private blog url>",
      "id": "<private blog id>",
      "private": "<token>"
    }
  },

  "new_post_data": {
    "title": "New testing post",
    "content": "<div style=\"color: red;\">The content of the new testing post</div>"
  }
}
```

... and then

```bash
$ make
```

**Note**: Don't add `http://` in `public_site` and `private_site` values.


## License

MIT – Copyright 2014 Automattic

[Node.js]: http://nodejs.org
[REST API]: http://developer.wordpress.com/docs/api
[WordPress.com]: http://www.wordpress.com
[node-wpcom-oauth]: https://github.com/Automattic/node-wpcom-oauth
