import { ReactiveVar } from 'meteor/reactive-var';

const _CMSBlocks = function() {
   this.getContentCallback = new ReactiveVar(null);
   this.permissionCheckCallback = new ReactiveVar(null);
   this.updateCallback = new ReactiveVar(null);
   this.hasContentCallback = new ReactiveVar(null);
   this.formClassNames = new ReactiveVar(null);
   this.buttonClassNames = new ReactiveVar(null);
   this.helperName = new ReactiveVar('_');

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
      console.log(`Content with key '${key}' should be updated to '${markdown || content}'`);
      return;
   }
}
_CMSBlocks.prototype.configure = function({
      onHasContent,
      onGetContent,
      onPermissionCheck,
      onUpdate,
      formClassNames,
      buttonClassNames,
      helperName
}) {
   if(onHasContent) this.hasContentCallback.set(onHasContent);
   if(onGetContent) this.getContentCallback.set(onGetContent);
   if(onPermissionCheck) this.permissionCheckCallback.set(onPermissionCheck);
   if(onUpdate) this.updateCallback.set(onUpdate);
   if(formClassNames) this.formClassNames.set(formClassNames);
   if(buttonClassNames) this.buttonClassNames.set(buttonClassNames);
   if(helperName) this.helperName.set(helperName);
};
// const CMSBlocks = new _CMSBlocks();

CMSBlocks = new _CMSBlocks();
