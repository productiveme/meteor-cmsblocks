import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var';
import CMSBlocks from './cmsblocks';
import { $ } from 'meteor/jquery';

const editing = new ReactiveVar();

Tracker.autorun(Meteor.bindEnvironment(() => {
  Template.registerHelper(CMSBlocks.helperName.get(), () =>
    Template.cmsblocks_container
  );

  Template.registerHelper(`${CMSBlocks.helperName.get()}_has`, (id) =>
    Session.get('cmsblocks.editmode') || CMSBlocks.hasContent(id)
  );

  Template.registerHelper(`${CMSBlocks.helperName.get()}_contentOf`, (id) =>
    CMSBlocks.getContent(id)
  );
}));

Template.cmsblocks_container.helpers({
  containerCss() {
    const css = ['cmsblocks_container'];
    if (CMSBlocks.permissionCheck(Meteor.userId())) css.push('cmsblocks_editable');
    if (!this.inline && Session.get('cmsblocks.editmode')) css.push('blocky');
    return css.join(' ');
  },
  showIcon() {
    if (Session.get('cmsblocks.editmode')) {
      if (typeof this.render === 'undefined') {
        return !CMSBlocks.hasContent(this.id || this.toString());
      }
      return !((typeof this.render === 'function' && this.render()) || (typeof this.render === 'string' && this.render));
    }
    return false;
  },
  canEdit() {
    return CMSBlocks.permissionCheck(Meteor.userId());
  },
  content() {
    const c = CMSBlocks.getContent(this.id || this.toString());
    if (typeof this.render === 'function') {
      return this.render(c);
    }
    if (typeof this.render === 'string') return this.render;
    return c;
  },
  md() {
    return this.markdown || this.md;
  },
});

Template.cmsblocks_container.events({
  'mouseenter .cmsblocks_editable'(event) {
    if (Session.get('cmsblocks.editmode')) {
      $(event.currentTarget).addClass('cmsblocks_hover');
    }
  },
  'mouseleave .cmsblocks_editable'(event) {
    $(event.currentTarget).removeClass('cmsblocks_hover');
  },
  'click .cmsblocks_hover'(event, templateInstance) {
    event.preventDefault();
    event.stopImmediatePropagation();
    templateInstance.$('.cmsblocks_editable').find('a.cmsblocks_edit_button').remove();
    editing.set({ id: this.id || this.toString(), content: CMSBlocks.getContent(this.id || this.toString()), markdown: this.markdown || this.md || false });
  },
});

Template.registerHelper('cmseditor', () => Template.cmsblocks_editor);

Template.cmsblocks_editor.onCreated(function () {
  this.autorun(() => {
    if (editing.get()) {
      $('.cmsblocks_editor').addClass('open');
      Tracker.afterFlush(() => {
        const $txt = $('.cmsblocks_editor textarea');
        $txt.each((i, t) => {
          const $t = $(t);
          $t.height('1', 'em');
          $t.height(t.scrollHeight);
        });
      });
    } else {
      $('.cmsblocks_editor').removeClass('open');
      $('.cmsblocks_editor').addClass('close');
      Meteor.setTimeout(() => {
        $('.cmsblocks_editor').removeClass('close');
      }, 500);
    }
  });
});

Template.cmsblocks_editor.helpers({
  id: () => {
    const cmsblock = editing.get();
    return cmsblock ? cmsblock.id : '';
  },
  content: () => {
    const cmsblock = editing.get();
    return cmsblock ? cmsblock.content : '';
  },
  formCss: () => CMSBlocks.formClassNames.get(),
  buttonCss: () => `updateBtn ${CMSBlocks.buttonClassNames.get()}`,
  controlGroupCss: () => `${CMSBlocks.controlGroupClassNames.get()}`,
  labelCss: () => `${CMSBlocks.controlLabelClassNames.get()}`,
  inputCss: () => `txt ${CMSBlocks.controlInputClassNames.get()}`,
  showToolbar: () => CMSBlocks.permissionCheck(Meteor.userId()),
  toggleClass() {
    return Session.get('cmsblocks.editmode') ? 'icon-pencil' : 'icon-newspaper';
  },
  translations: () => CMSBlocks.translations.get(),
  translatedContent(lang) {
    const cmsblock = editing.get();
    if (typeof CMSBlocks.translateCallback.get() === 'function') {
      return CMSBlocks.translateCallback.get()(lang, cmsblock ? cmsblock.id : '');
    }
    return cmsblock ? cmsblock.content : '';
  },
});

Template.cmsblocks_editor.events({
  'click .updateBtn'(event, templateInstance) {
    event.preventDefault();
    const cmsblock = editing.get();
    (CMSBlocks.translations.get() || ['en']).forEach((lang) => {
      cmsblock.content = templateInstance.$(`.txt[data-lang=${lang}]`).val();
      if (cmsblock.markdown) {
        cmsblock.markdown = cmsblock.content;
        cmsblock.content = Markdown(cmsblock.markdown);
      }
      cmsblock.lang = lang;
      if (typeof CMSBlocks.update === 'function') CMSBlocks.update(cmsblock);
    });
   // $(ev.currentTarget).trigger($.Event('cmsblocks.updated', cmsblock));
    editing.set(null);
  },
  'click .cancelBtn'(event) {
    event.preventDefault();
    editing.set(null);
  },
  'click .toggleEditMode'() {
    const mode = !Session.get('cmsblocks.editmode');
    if (!mode) {
      editing.set(null);
    }
    if (typeof CMSBlocks.beforeModeSwitchCallback.get() === 'function') {
      CMSBlocks.beforeModeSwitchCallback.get()(mode);
    }
    Session.set('cmsblocks.editmode', mode);
  },
});
