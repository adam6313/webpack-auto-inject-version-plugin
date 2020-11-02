const fs = require('fs');
const path = require('path');
const END_LINE = require('os').EOL;
const config = require('./config');
const weblog = require('webpack-log'); 
const PLUGIN_NAME = "webpackAutoInjectVersionPlugin"
const log = weblog({ name: PLUGIN_NAME });

module.exports = class webpackAutoInjectVersionPlugin {
    constructor(options = {}) {
        this.options = options;
        this.tag = this.getTag();
        this.handleCompilation = this.handleCompilation.bind(this);
        this.attachHeaderToAsset = this.attachHeaderToAsset.bind(this);
        this.apply = this.apply.bind(this);
    }

    getTag() {
      if (!this.options.hasOwnProperty("tag")) {
        const packageFile = JSON.parse(fs.readFileSync(path.resolve(config.package), 'utf8'));
        return `[TYR] version: ${packageFile.version} - ${new Date().toISOString()}`
      }

      return `${this.options.tag} - ${new Date().toISOString()}`
    }

    attachHeaderToAsset(filename, compilation) {
        var ext = '.' + filename.split('.').pop();
        if (!config.extensions.includes(ext)) {
            return false;
        }
        var header = config.headers[ext.substr(1)](this.tag)
        var asset = compilation.assets[filename];
        var originSource = asset.source();
        var finalSource = `${header}${END_LINE}${originSource}`;
        asset.source = () => finalSource;
        log.info(`Injecting header for ${filename}: ${header}`);
        return true;
    }

    handleCompilation(compilation, callback) {
      log.info(`Injecting header for ${config.extensions} files ...`);
      var self = this;
      let count = 0;
      for (var filename in compilation.assets) {
        self.attachHeaderToAsset(filename, compilation) && count++;
      }
      if (typeof callback === 'function') {
        callback();
      }
      log.info(`${count} file(s) done`);
    }

    apply(compiler) {
      compiler.hooks.emit.tapAsync(PLUGIN_NAME, this.handleCompilation);
    }
}