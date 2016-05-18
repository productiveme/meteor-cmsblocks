Package.describe({
  name: 'productiveme:cmsblocks',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['ecmascript','fourseven:scss@3.4.1','perak:markdown@1.0.5']);
  api.use(['templating','jquery','reactive-var', 'underscore'], 'client');
  api.addFiles(['lib/cmsblocks.html', 'lib/cmsblocks.scss'], 'client');
  api.addFiles('lib/cmsblocks.js');
  api.addAssets([
    'fonts/icomoon.eot',
    'fonts/icomoon.svg',
    'fonts/icomoon.ttf',
    'fonts/icomoon.woff',
  ], 'client');
});

Package.onTest(function(api) {
  api.use(['ecmascript','tinytest']);
  api.use('productiveme:cmsblocks');
  api.addFiles('tests/cmsblocks-tests.js');
});
