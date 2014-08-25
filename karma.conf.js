module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['mocha', 'browserify'],

    files: [
      'test/angular/1.2.22/angular.js',
      'test/angular/1.2.22/angular-mocks.js',
      'modules/**/test/*.js'
    ],

    exclude: [
    ],

    preprocessors: {
        'modules/**/test/*.js': [ 'browserify' ]
    },

    // possible values: 'dots', 'progress'
    reporters: ['progress'],

    port: 9876,

    colors: true,

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['PhantomJS'],

    singleRun: false
  });
};
