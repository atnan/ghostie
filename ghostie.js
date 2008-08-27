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

document.observe('dom:loaded', function() {
  $$('input.ghostie').each(function(ghost, index) {

    if ((ghost.type != 'text') && (ghost.type != 'password')) { return; }

    // We can support IE by using clone/remove/add, but until then password inputs
    // won't be ghostied.
    if ((ghost.type == 'password') && (Prototype.Browser.IE)) { return; }

    if (((ghost.value == '') && (ghost.title != '')) || (ghost.value == ghost.title)) {
      if (ghost.type == 'password') {
        ghost.type = 'text';
        ghost.addClassName('password');
      }
      ghost.value = ghost.title;
      ghost.addClassName('ghostied');
    }

    ghost.observe('focus', function() {
      if (this.hasClassName('password')) {
        this.type = 'password';
      }
      if (this.value == this.title) {
        this.value = '';
        this.select();
        ghost.removeClassName('ghostied');
      }
    });

    ghost.observe('blur', function() {
      if (!this.value.length) {
        if (ghost.type == 'password') {
          ghost.type = 'text';
          ghost.addClassName('password');
        }
        this.value = this.title;
        ghost.addClassName('ghostied');
      }
    });

    ghost.up('form').select('input.submit').each(function(submit, index) {
      submit.observe('click', function() {
        if (ghost.value == ghost.title)
          ghost.value = '';
          submit.up('form').submit();
      });
    });

  });
});

