import { ReactiveVar } from 'meteor/reactive-var';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';

const _CMSBlocks = function() {
   this.getContentCallback = new ReactiveVar(null);
   this.permissionCheckCallback = new ReactiveVar(null);
   this.updateCallback = new ReactiveVar(null);
   this.translateCallback = new ReactiveVar(null);
   this.hasContentCallback = new ReactiveVar(null);
   this.formClassNames = new ReactiveVar(null);
   this.buttonClassNames = new ReactiveVar(null);
   this.helperName = new ReactiveVar('_');
   this.translations = new ReactiveVar(['en']);

   // isomorphic
   this.permissionCheck = () => {
      if (typeof CMSBlocks.permissionCheckCallback.get() === 'function') {
         return CMSBlocks.permissionCheckCallback.get()();
      }
      return true;
   };

   this.getContent = (key) => {
      if(typeof CMSBlocks.getContentCallback.get() === 'function') {
         return CMSBlocks.getContentCallback.get()(key);
      }
      return '';
   };

   this.hasContent = (key) => {
      if(typeof CMSBlocks.hasContentCallback.get() === 'function') {
         return CMSBlocks.hasContentCallback.get()(key);
      }
      return true;
   };

   this.update = (key, content, markdown) => {
      if (typeof CMSBlocks.updateCallback.get() === 'function') {
         return CMSBlocks.updateCallback.get()(key, content, markdown);
      }
      // console.log(`Content with key '${key}' should be updated to '${markdown || content}'`);
      return;
   }
}
_CMSBlocks.prototype.configure = function({
      onHasContent,
      onGetContent,
      onPermissionCheck,
      onUpdate,
      onTranslate,
      formClassNames,
      buttonClassNames,
      helperName,
      translations
}) {
  check(onHasContent, Match.Maybe(Match.Where(_.isFunction)));
  check(onGetContent, Match.Maybe(Match.Where(_.isFunction)));
  check(onPermissionCheck, Match.Maybe(Match.Where(_.isFunction)));
  check(onUpdate, Match.Maybe(Match.Where(_.isFunction)));
  check(onTranslate, Match.Maybe(Match.Where(_.isFunction)));
  check(formClassNames, Match.Maybe(String));
  check(buttonClassNames, Match.Maybe(String));
  check(helperName, Match.Maybe(String));
  check(translations, Match.Maybe([String]));

   if(onHasContent) this.hasContentCallback.set(onHasContent);
   if(onGetContent) this.getContentCallback.set(onGetContent);
   if(onPermissionCheck) this.permissionCheckCallback.set(onPermissionCheck);
   if(onUpdate) this.updateCallback.set(onUpdate);
   if(onTranslate) this.translateCallback.set(onTranslate);
   if(formClassNames) this.formClassNames.set(formClassNames);
   if(buttonClassNames) this.buttonClassNames.set(buttonClassNames);
   if(helperName) this.helperName.set(helperName);
   if(translations) this.translations.set(translations);
};
// const CMSBlocks = new _CMSBlocks();

CMSBlocks = new _CMSBlocks();
