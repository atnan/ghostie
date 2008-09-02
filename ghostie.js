/*
  Copyright (c) 2008 Nathan de Vries (http://www.atnan.com)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

var Ghostie = Class.create({
  initialize: function() {
    // Mix in ghost(), unghost(), ghostable() etc.
    Element.addMethods(this.methods);

    this.ghosts().each(function(ghost) {
      // Set us up the Ghost
      ghost.ghost();

      ghost.observe('focus', function() { ghost.unghost(); });
      ghost.observe('blur', function() { ghost.ghost(); });

      // Ensure that Ghosted values don't get submitted
      ghost.up('form').observe('submit', function() {
        if (ghost.should_be_unghosted()) {
          ghost.unghost();
        }
      });
    });
  },
  ghosts: function() {
    return $$('input[title != ""].ghostie').select(function(ghost) {
      return ghost.ghostable();
    });
  },
  methods: {
    ghostable: function(element) {
      // We can support IE by using clone/remove/add, but until then password
      // inputs won't be ghostied.
      return (element.tagName.toLowerCase() == 'input' &&
          ((element.type == 'text') || (element.type == 'password') &&
          (!Prototype.Browser.IE)))
    },
    should_be_ghosted: function(element) {
      return (element.ghostable && element.value == '');
    },
    should_be_unghosted: function(element) {
      return (element.ghostable && element.value == element.title);
    },
    ghost: function(element) {
      if (element.should_be_ghosted()) {
        if (element.type == 'password') {
          element.addClassName('password');
          element.type = 'text';
        }
        element.value = element.title;
        element.addClassName('ghostied');
      }
      return $(element);
    },
    unghost: function(element) {
      if (element.should_be_unghosted()) {
        if (element.hasClassName('password')) { element.type = 'password' }
        element.value = '';
        element.removeClassName('ghostied');
      }
      return $(element);
    }
  }
});

document.observe('dom:loaded', function(event) {
  // Perhaps I should initialize Ghostie with event.element(), and allow some
  // degree of configuration?
  new Ghostie();
});
