import fs from 'fs';

const meteorRoot = fs.realpathSync( process.cwd() + '/../' );
const publicPath = meteorRoot + '/web.browser/app/';

Meteor.methods('cmsblocks.getimages', function(publicPath) {

});
