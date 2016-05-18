//isomorphic
canEditContent = (userId) => {
  //TODO: some configuration required to determine
  return !!userId && Session.get("cmsblocks.editmode");
}

extractContent = (tmpl) => {
  const r = tmpl.view.templateContentBlock.renderFunction();
  if(r._render) {
    const ref = r._render();
    return ref && ref.value ? ref.value : ref || "";
  } else {
    return r
  }
}

//client
if(Meteor.isClient) {

  const editing = new ReactiveVar();

  Template.registerHelper("cmsblock", function() {
    return Template.cmsblocks_container;
  });

  Template.cmsblocks_container.helpers({
    containerCss: function() {
      return canEditContent(Meteor.userId()) ? "cmsblocks_container cmsblocks_editable" : "cmsblocks_container"
    },
    showIcon: function() {
      return Session.get("cmsblocks.editmode") && !extractContent(Template.instance()).trim();
    },
    canEdit: function() {
      return canEditContent(Meteor.userId());
    }
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
      editing.set(_.extend(this, { content: extractContent(tmpl) }));
    }
  });

  Template.registerHelper("cmseditor", function() {
    return Template.cmsblocks_editor;
  });

  Template.cmsblocks_editor.onCreated(function() {
    this.autorun(() => {
      if(editing.get()) {
        $('.cmsblocks_editor').addClass('open');

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
      return "form"; //TODO: from config
    },
    buttonCss: () => {
      return "btn"; //TODO: from config
    },
    showToolbar: function() {
      return Meteor.userId();
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
      $(ev.currentTarget).trigger($.Event('cmsblocks.updated', cmsblock));
      editing.set(null)
    },
    'click .cancelBtn': function(ev, tmpl) {
      ev.preventDefault();
      editing.set(null)
    },
    'click .toggleEditMode': function(ev, tmpl) {
      Session.set("cmsblocks.editmode", !Session.get("cmsblocks.editmode"));
    }
  })
}

//server
if(Meteor.isServer) {

}
