import fs from 'fs';
import CMSBlocsk from './cmsblocks.js';

const meteorRoot = fs.realpathSync( process.cwd() + '/../' );
const publicPath = meteorRoot + '/web.browser/app/';

Meteor.methods('cmsblocks.getimages', function(publicPath) {

});
