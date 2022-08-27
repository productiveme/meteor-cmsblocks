Package.describe({
  name: 'productiveme:cmsblocks',
  version: '0.2.0',
  // Brief, one-line summary of the package.
  summary: 'A content management solution for "mostly" static websites',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/productiveme/meteor-cmsblocks',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: null,
});

Package.onUse((api) => {
  api.versionsFrom('1.8.2');
  api.use(['ecmascript', 'check', 'perak:markdown@1.0.5']);
  api.use(['templating@1.4.1', 'jquery@1.11.11', 'reactive-var', 'underscore', 'tracker'], 'client');
  api.mainModule('lib/cmsblocks.js', ['client', 'server']);
  api.addFiles(['lib/cmsblocks.html', 'lib/cmsblocks.css', 'lib/cmsblocks-client.js', 'lib/defaultEditor.html', 'lib/defaultEditor.js'], 'client');
  api.export('CMSBlocks');
  api.addAssets([
    'fonts/icomoon.eot',
    'fonts/icomoon.svg',
    'fonts/icomoon.ttf',
    'fonts/icomoon.woff',
  ], 'client');
});

Package.onTest((api) => {
  api.use(['ecmascript', 'tinytest']);
  api.use('productiveme:cmsblocks');
  api.addFiles('tests/cmsblocks-tests.js');
});
