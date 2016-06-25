Package.describe({
   name: 'productiveme:cmsblocks',
   version: '0.1.7',
   // Brief, one-line summary of the package.
   summary: 'A content management solution for "mostly" static websites',
   // URL to the Git repository containing the source code for this package.
   git: 'https://github.com/productiveme/meteor-cmsblocks',
   // By default, Meteor will default to using README.md for documentation.
   // To avoid submitting documentation, set this field to null.
   documentation: null
});

Package.onUse(function(api) {
   api.versionsFrom('1.2.1');
   api.use(['ecmascript','check','fourseven:scss@3.4.1','perak:markdown@1.0.5']);
   api.use(['templating','jquery','reactive-var', 'underscore', 'tracker'], 'client');
   api.addFiles(['lib/cmsblocks.html', 'lib/cmsblocks.scss', 'lib/cmsblocks.js', 'lib/cmsblocks-client.js'], 'client');
   api.export('CMSBlocks');
   if(api.mainModule) {
      api.mainModule('lib/cmsblocks.js');
   }
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
