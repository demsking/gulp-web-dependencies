'use strict';

var fs = require('fs'),
    path = require('path'),
    gutil = require('gulp-util'),
    mocha = require('mocha'),
    assert = require('assert'),
    plugin = require('../');

var info = require('../package.json');
var file = fs.readFileSync(path.join(__dirname, './src/index.html'));

describe(info.name, () => {
    var fakeFile;
    
    beforeEach(() => {
        fakeFile = new gutil.File({
            base: 'tests/src',
            cwd: 'tests/',
            path: 'tests/src/index.html',
            contents: new Buffer(file)
        });
    });
    
    it('should find and copy npm and bower dependencies using default options', (next) => {
        var stream = plugin();
        
        stream.write(fakeFile);
        next();
    });
    
    it('should find and copy npm and bower dependencies using user options {dest}', (next) => {
        var stream = plugin({
            dest: '/tmp/dist',
        });
        
        stream.write(fakeFile);
        next();
    });
    
    it('should find and copy npm and bower dependencies using user options {dest,prefix}', (next) => {
        var stream = plugin({
            dest: '/tmp/dist',
            prefix: '/vendor',
        });
        
        stream.write(fakeFile);
        next();
    });
    
    it('should find and copy npm and bower dependencies using user options {dest,prefix,flat}', (next) => {
        var stream = plugin({
            dest: '/tmp/dist',
            prefix: '/vendor-flat/',
            flat: true,
        });
        
        stream.write(fakeFile);
        next();
    });
    
    it('should failed', (next) => {
        var stream = plugin({
            dest: '/root/dist',
            prefix: '/vendor',
        });
        
        try {
            stream.write(fakeFile);
        } catch(e) {
            next();
        }
    });
});
