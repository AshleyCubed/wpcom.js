
# get Makefile directory name: http://stackoverflow.com/a/5982798/376773
THIS_MAKEFILE_PATH:=$(word $(words $(MAKEFILE_LIST)),$(MAKEFILE_LIST))
THIS_DIR:=$(shell cd $(dir $(THIS_MAKEFILE_PATH));pwd)

# BIN directory
BIN := $(THIS_DIR)/node_modules/.bin

# applications
NODE ?= node
NPM ?= $(NODE) $(shell which npm)
MOCHA ?= $(NODE) $(BIN)/mocha
BABEL ?= $(NODE) $(BIN)/babel
WEBPACK ?= $(NODE) $(BIN)/webpack

standalone: dist/wpcom.js

install: node_modules

clean:
	@rm -rf dist

distclean: clean
	@rm -rf node_modules

dist:
	@mkdir -p $@

dist/lib:
	@mkdir -p $@

dist/lib/util:
	@mkdir -p $@

dist/test:
	@mkdir -p $@

dist/wpcom.js: *.js dist lib/*.js
	@$(WEBPACK) -p --config webpack.config.js

babelify: dist dist/lib dist/lib/util dist/test
	@$(BABEL) index.js --out-file dist/index.js
	@$(BABEL) lib --out-dir dist/lib
	@$(BABEL) lib/util --out-dir dist/lib/util
	@$(BABEL) test --out-dir dist/test

node_modules: package.json
	@NODE_ENV= $(NPM) install
	@touch node_modules

example-server:
	cd examples/server/; $(NPM) install
	$(NODE) examples/server/index.js

example-browser-cors: all
	cd examples/browser-cors/; $(NPM) install
	$(NODE) examples/browser-cors/index.js

test: babelify
	@$(MOCHA) \
		--compilers js:babel/register \
		--timeout 120s \
		--slow 3s \
		--grep "$(filter-out $@,$(MAKECMDGOALS))" \
		--bail \
		--reporter spec

test-all: babelify
	@$(MOCHA) \
		--compilers js:babel/register \
		--timeout 120s \
		--slow 3s \
		--bail \
		--reporter spec

.PHONY: all standalone install clean distclean babelify example-server example-browser-cors test test-all
