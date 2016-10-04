import { Template } from 'meteor/templating';

Template.cmsblocks_defaultEditor.events({
  'click .updateBtn'(event, templateInstance) {
    event.preventDefault();
    const cmsblock = this.editing.get();
    CMSBlocks.onEditorUpdate(cmsblock, templateInstance.$('.txt'));
    this.editing.set(null);
  },
});
