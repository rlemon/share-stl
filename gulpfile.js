"use strict";
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const del = require('del');
const runSequence = require('run-sequence');

const paths = {
	src: {
		server: 'src/server/**/*.{js,jsx}',
		client: 'src/client/index.js'
	},
	dest: {
		client: 'dist/assets',
		server: 'dist'
	}
};


// cleanup
gulp.task('clean-client', () => del(paths.dest.client));
gulp.task('clean-server', () => del(['dist/**', '!dist', '!dist/uploads', '!dist/uploads/**']));

// build server
gulp.task('build-server', ['move-knexfile'], () => 
	gulp.src(paths.src.server, { base: 'src/server' })
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.dest.server))
);
gulp.task('move-knexfile', () => 
	gulp.src('knexfile.js')
		.pipe(gulp.dest(paths.dest.server))
);
// build client
gulp.task('build-client', () => 
	gulp.src(paths.src.client)
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest(paths.dest.client))
);

// bulk operations 
gulp.task('clean-build-server', cb => {
	runSequence('clean-server', 'build-server', cb);
});
gulp.task('clean-build-client', cb => {
	runSequence('clean-client', 'build-client', cb);
});
gulp.task('build-all', ['build-server', 'build-client']);
gulp.task('clean-all', [ 'clean-server', 'clean-client' ]);
gulp.task('clean-build-all', cb => {
	runSequence('clean-all', 'build-all', cb);
});