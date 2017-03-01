/**
 * gulp-web-dependencies
 * Copyright(c) 2016 Sébastien Demanou
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var es = require('event-stream');
var gutil = require('gulp-util');
var mkdirp = require("mkdirp");
var path = require('path');
var fs = require('fs');
var url = require('url');

const PLUGIN_NAME = 'gulp-web-dependencies';

module.exports = function(options) {
    options = options || {};

    if (typeof options.prefix == 'undefined') {
        options.prefix = '';
    }

    if (options.prefix.length > 1) {
        if (options.prefix[options.prefix.length - 1] != '/') {
            options.prefix += '/';
        }
    }

    // Allow the user to add their own folders to the search pattern
    var userFolders = options.folders ? options.folders + '|' : '';
    var REGEX = new RegExp(
        `("|')([\\.\\/\\\\]*((${userFolders}bower_components|node_modules)\\/([a-z0-9\\.+@~$!;:\\/\\\\{}()\\[\\]|=&*£%§_-]+(\\.[a-z0-9]+)?)))['"]`,
        'gi'
    );

    return es.map((file, done) => {
        let dest = options.dest || path.dirname(file.path);

        dest = path.join(dest, options.prefix);

        file.contents = new Buffer(file.contents.toString().replace(REGEX, (matches, quote, uri, pathname, engine, filename) => {
            const ext = path.extname(filename);
            const prefix = ext ? options.prefix : path.join('/', options.prefix);
            const f = options.flat && ext ? path.basename(filename) : filename;

            let basename = '';

            if (options.base) {
                basename = path.dirname(file.path.substring(file.path.search(options.base) + options.base.length));
            }

            const dest_file_prefix = ext ? dest : path.join(dest, path.join(basename, engine));
            const dest_file = path.join(dest_file_prefix, f + (!ext ? '.js' : ''));
            const url_file = url.resolve(options.prefix, f);

            if (!ext) {
                uri += '.js';
            }

            try {
                mkdirp.sync(path.dirname(dest_file));
                fs.createReadStream(path.resolve(path.dirname(file.path), uri))
                    .pipe(fs.createWriteStream(dest_file));
            } catch(err) {
                return done(new gutil.PluginError(PLUGIN_NAME, err));
            }

            return quote + url_file + quote;
        }));

        done(null, file);
    });
};
