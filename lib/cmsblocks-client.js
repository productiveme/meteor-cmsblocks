import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';

const editing = new ReactiveVar();

Tracker.autorun(Meteor.bindEnvironment(function() {
   Template.registerHelper(CMSBlocks.helperName.get(), function() {
      return Template.cmsblocks_container;
   });
}));

Template.registerHelper("_has", function(id) {
   return Session.get("cmsblocks.editmode") || CMSBlocks.hasContent(id);
});

Template.cmsblocks_container.helpers({
   containerCss() {
      const css = ['cmsblocks_container'];
      if(CMSBlocks.permissionCheck(Meteor.userId())) css.push('cmsblocks_editable');
      if(!this.inline && Session.get("cmsblocks.editmode")) css.push('blocky');
      return css.join(' ');
   },
   showIcon() {
      return Session.get("cmsblocks.editmode") && !CMSBlocks.hasContent(this.id || this.toString());
   },
   canEdit() {
      return CMSBlocks.permissionCheck(Meteor.userId());
   },
   content() {
      const c = CMSBlocks.getContent(this.id || this.toString())
      if(typeof this.render === 'function') {
         return this.render(c);
      }
      return c;
   },
});

Template.cmsblocks_container.events({
   "mouseenter .cmsblocks_editable": function(ev, tmpl) {
      if(Session.get("cmsblocks.editmode")) {
         $(ev.currentTarget).addClass('cmsblocks_hover');
      }
   },
   "mouseleave .cmsblocks_editable": function(ev, tmpl) {
      $(ev.currentTarget).removeClass('cmsblocks_hover');
   },
   "click .cmsblocks_hover": function(ev, tmpl) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      tmpl.$('.cmsblocks_editable').find('a.cmsblocks_edit_button').remove();
      editing.set({id: this.id || this.toString(), content: CMSBlocks.getContent(this.id || this.toString()), markdown: this.markdown || false });
   }
});

Template.registerHelper("cmseditor", function() {
   return Template.cmsblocks_editor;
});

Template.cmsblocks_editor.onCreated(function() {
   this.autorun(() => {
      if(editing.get()) {
         $('.cmsblocks_editor').addClass('open');
         Tracker.afterFlush(() => {
            const $txt = $(".cmsblocks_editor textarea");
            $txt.height( '1em' );
            $txt.height( $txt[0].scrollHeight );
         });
      } else {
         $('.cmsblocks_editor').removeClass('open');
         $('.cmsblocks_editor').addClass('close');
         Meteor.setTimeout(() => {
            $('.cmsblocks_editor').removeClass('close');
         },500);
      }
   })
});

Template.cmsblocks_editor.helpers({
   id: () => {
      const cmsblock = editing.get()
      return cmsblock ? cmsblock.id : "";
   },
   content: () => {
      const cmsblock = editing.get()
      return cmsblock ? cmsblock.content : "";
   },
   formCss: () => {
      return CMSBlocks.formClassNames.get();
   },
   buttonCss: () => {
      return "updateBtn " + CMSBlocks.buttonClassNames.get();
   },
   showToolbar: function() {
      return CMSBlocks.permissionCheck(Meteor.userId());
   },
   toggleClass: function() {
      return Session.get("cmsblocks.editmode") ? "icon-pencil" : "icon-newspaper";
   }
});

Template.cmsblocks_editor.events({
   'click .updateBtn': function(ev, tmpl) {
      ev.preventDefault();
      const cmsblock = editing.get();
      cmsblock.content = tmpl.$('.txt').val();
      if(cmsblock.markdown) {
         cmsblock.markdown = cmsblock.content;
         cmsblock.content = Markdown(cmsblock.markdown);
      }
      if(typeof CMSBlocks.update === 'function') CMSBlocks.update(cmsblock);
      //$(ev.currentTarget).trigger($.Event('cmsblocks.updated', cmsblock));
      editing.set(null)
   },
   'click .cancelBtn': function(ev, tmpl) {
      ev.preventDefault();
      editing.set(null)
   },
   'click .toggleEditMode': function(ev, tmpl) {
      Session.set("cmsblocks.editmode", !Session.get("cmsblocks.editmode"));
   }
});