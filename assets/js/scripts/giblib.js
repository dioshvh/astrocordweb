// This is my personalized mini library.

class GIB {

  alert(type, msg, time = 5000) {
    let div = document.createElement('div');
    div.setAttribute('class', 'notice');
    div.classList.add('notice--'+type);
    div.innerHTML = `
      <div class="notice__message">${msg}</div>
      <div class="notice__close"><i class="fas fa-times"></i></div>
    `;
    document.body.appendChild(div);
    this.event('click', '.notice__close', () => div.remove());
    setTimeout(() => {
      if (this.exist('.notice__close')) {
        this.each('.notice', () => div.remove());
      }
    },time);
  }

  event(events, element, fn) {
    if (this.exist(element)) {
      events = events.replace(' ','').split(',');
      events.forEach(event => {
        document.querySelectorAll(element).forEach((el) => {
          el.addEventListener(event, target => {
            fn(el, target);
          })
        })
      })
    }
  }

  each(elements, fn) {
    if (typeof elements == 'string' && document.querySelector(elements)) {
      document.querySelectorAll(elements).forEach((el, i) => {
        fn(el, i);
      })
    } else if (Array.isArray(elements)) {
      elements.forEach((el, i) => {
        fn(el, i);
      })
    }
  }

  rect(el) {
    return el.getBoundingClientRect();
  }

  appendAfter(el, target) {
    target.parentNode.insertBefore(el, target.nextSibling);
  }

  exist(el) {
    return document.querySelector(el);
  }

  isHidden(el) {
    return (el.offSetParent === null);
  }

  openModal(modal) {
    const className = modal.replace('.', '')+'--';
    document.querySelector(modal).classList.add(className+'toggle');
    document.querySelector('.modal-overlay').classList.add('modal-overlay--toggle');
    setTimeout(() => {
      this.event('click', '.close-modal', () => this.closeModal());
    },10)
  }
  closeModal() {
    this.each('.modal-search, .modal-ajax, .modal-theme', modal => {
      if (modal.classList.contains(modal.classList[0]+'--toggle')) {
        modal.classList.remove(modal.classList[0]+'--toggle');
      }
      if (modal.classList.contains('modal-ajax')) {
        setTimeout(() => {
          modal.innerHTML = '';
        },300)
      }
    })

    document.querySelector('.modal-overlay').classList.remove('modal-overlay--toggle');
  }

  debounce (fn, wait) {
    let t
    return function () {
      clearTimeout(t)
      t = setTimeout(() => fn.apply(this, arguments), wait)
    }
  }

  siblings(elem) {
    var siblings = [];
    var sibling = elem.parentNode.firstChild;
    while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling
    }
    return siblings;
  };

}
let Gib = new GIB();