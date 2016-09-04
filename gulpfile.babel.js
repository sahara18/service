/* eslint-disable no-sync */

import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import gulp from 'gulp';
import less from 'gulp-less';
import util from 'gulp-util';
import concat from 'gulp-concat';
import browserify from 'browserify';
import babel from 'gulp-babel';
import count from 'gulp-count';
import changed from 'gulp-changed';
import eslint from 'gulp-eslint';
import plumber from 'gulp-plumber';
import {configure} from 'browserify-global-shim';
import mdeps from 'module-deps';
import source from 'vinyl-source-stream';
import largePackages from './config/vendors';
import {spawn} from 'child_process';

let json = {
  read(file) {
    try {
      return JSON.parse(fs.readFileSync(file));
    } catch (err) {
      return null;
    }
  },

  write(file, data) {
    return fs.writeFileSync(file, JSON.stringify(data));
  }
};
let [red, green, yellow] = ['red', 'green', 'yellow'].map(color => util.colors[color]);
let largeVendors = _.map(largePackages, 'packageName');
let vendors = [];

let shims = configure(largePackages.reduce((result, vendor) => {
  result[vendor.packageName] = vendor.alias;
  return result;
}, {}));

function startServer() {
  let server = spawn('node', ['lib/server']);
  server.stdout.on('data', data => util.log(data.toString()));
  server.stderr.on('data', data => util.log(red(data.toString())));
  return server;
}

function restartServer(server) {
  server.kill();
  return startServer();
}

gulp.task('default', ['build']);

gulp.task('dev', ['build'], () => {
  let server = startServer();

  gulp.watch(['src/**/*.json', 'src/**/*.js'], () => {
    util.log(yellow('Rebuilding..'));
    gulp.start('build:app', () => {
      util.log(green('Rebuild successfully'));
      server = restartServer(server);
    });
  });

  gulp.watch('src/**/*.less', () => {
    util.log(yellow('Rebuilding..'));
    gulp.start('precompile:css', () => {
      util.log(green('Rebuild successfully') + '\n');
    });
  });

  util.log(green('Livereload is enabled') + '\n');
});

gulp.task('build', ['build:app', 'build:lib', 'precompile:css', 'lint:gulp']);

gulp.task('copy:static', () => {
  return gulp.src('src/**/*.json')
    .pipe(gulp.dest('lib'));
});

gulp.task('lint:gulp', () => {
  return gulp.src(__filename)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('lint:js', () => {
  let knownErrors = json.read('debug/errors.json') || [];
  return gulp.src('src/**/*.js')
    .pipe(changed('lib', {
      hasChanged(stream, cb, sourceFile, destPath) {
        if (knownErrors.includes(sourceFile.path)) {
          stream.push(sourceFile);
          cb();
        } else {
          changed.compareLastModifiedTime(stream, cb, sourceFile, destPath);
        }
      }
    }))
    .pipe(count('lint:js ##'))
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.results(results => {
      let markedFiles = results.filter(file => file.errorCount > 0 || file.warningCount > 0);
      json.write('debug/errors.json', _.map(markedFiles, 'filePath'));
    }))
    .pipe(eslint.format());
});

gulp.task('precompile:js', ['lint:js'], () => {
  return gulp.src('src/**/*.js')
    .pipe(changed('lib', {hasChanged: changed.compareLastModifiedTime}))
    .pipe(count('precompile:js ##'))
    .pipe(plumber())
    .pipe(babel({
      resolveModuleSource(file) {
        return file
          .replace(/@components\//, path.join(__dirname, '/lib/components/'))
          .replace(/@common\//, path.join(__dirname, '/lib/common/'))
          .replace(/@config\//, path.join(__dirname, '/config/'));
      }
    }))
    .pipe(gulp.dest('lib'));
});

gulp.task('build:app', ['precompile:js', 'copy:static', 'fill:deps'], () => {
  return browserify('lib/router/client')
    .external(vendors)
    .transform(shims)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('lib/client/static/js'));
});

gulp.task('build:lib', ['precompile:js', 'copy:static', 'fill:deps'], () => {
  return browserify()
    .require(_.difference(vendors, largeVendors))
    .transform(shims)
    .bundle()
    .pipe(source('lib.js'))
    .pipe(gulp.dest('lib/client/static/js'));
});

gulp.task('precompile:css', () => {
  return gulp.src('src/**/*.less')
    .pipe(less())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('lib/client/static/css'));
});

gulp.task('fill:deps', ['precompile:js', 'copy:static'], done => {
  mdeps({
    postFilter(id, file) {
      let isExternal = /node_modules/.test(file);
      if (isExternal) {
        vendors.push(id);
        return null;
      }
      return id;
    }
  })
    .on('data', () => {})
    .on('end', () => {
      vendors = _.uniq(vendors);
      done();
    })
    .end({file: './lib/router/client'});
});
