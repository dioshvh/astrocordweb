dropDown();

// If browser doesn't support @media(prefers-color-scheme)
if (navigator.userAgent.includes('Edge/')) {
  let css = document.createElement('link');
  css.setAttribute('rel', 'stylesheet');
  css.setAttribute('href', '/assets/css/modes/dark.css');
  document.head.appendChild(css);
  if (!localStorage.getItem('media-support')) {
    Gib.alert('warning', 'I suggest switching to FireFox or Chrome while using this website');
    localStorage.setItem('media-support', true);
  }
}

// Global Modal
Gib.event('click', '.modal-overlay', () => Gib.closeModal());

// Submit overlay
Gib.event('submit', 'form', () => {
  let overlay = document.createElement('div');
  overlay.setAttribute('id', 'submit-overlay');
  overlay.innerHTML = '<div class="loader"><div class="inner"></div></div>';
  document.body.appendChild(overlay);
})

// List search
Gib.event('keyup', '[data-search]', search => {
  const filter = search.getAttribute('data-search');
  const filter_items = document.querySelectorAll(`[data-filter-${filter}]`);
  if (search.value != '') {
    filter_items.forEach((a) => {
      a.classList.add('card--search-hide');
      document.querySelectorAll(`[data-filter-${filter}*="${search.value.toLowerCase()}"]`).forEach(function(b) {
        b.classList.remove('card--search-hide');
      })
    })
  } else {
    filter_items.forEach((a) => a.classList.remove('card--search-hide'));
  }
})

// Remove notice
if (Gib.exist('.notice')) {
  Gib.event('click', '.notice__close', btn => btn.parentElement.remove());
  setTimeout(() => {
    if (Gib.exist('.notice')) {
      Gib.each('.notice', notice => notice.remove());
    }
  }, 15000);
}

// Gallery
Gib.event('click', '.gallery__thumbnail', thumbnail => {
  const src = thumbnail.querySelector('img').getAttribute('src');
  const text = thumbnail.querySelector('small').textContent;
  const siblings = Gib.siblings(thumbnail);

  document.querySelector('.gallery__main img').setAttribute('src', src);
  document.querySelector('.gallery__main a').setAttribute('href', src);
  document.querySelector('.gallery__main p').textContent = text;
  thumbnail.classList.add('gallery__thumbnail--active');
  siblings.forEach((sib) => sib.classList.remove('gallery__thumbnail--active'));
})

// Click to copy
Gib.event('click', '.ctc-btn', copy => {
  const text = copy.querySelector('.ctc-btn__text').textContent;
  navigator.clipboard.writeText(text).then(() => {
    Gib.alert('success', 'Discord tag copied');
  })
})

// Comment overflow
Gib.each('.comment', comment => {
  if (comment.querySelector('.markdown-body').childElementCount > 2) {

    const btn = document.createElement('button');
    btn.setAttribute('class', 'btn small show-more mt-15');
    btn.textContent = 'Read more';

    comment.querySelector('main').appendChild(btn);
    comment.querySelector('.markdown-body').classList.add('overflow');
    btn.addEventListener('click', () => {
      btn.textContent = btn.textContent == 'Read more' ? 'Show less' : 'Read more';
      comment.querySelector('.markdown-body').classList.toggle('overflow');
    })
  }
})

// Hide 3 and after replies
Gib.each('.comment__replies', replies => {
  if (replies.childElementCount > 2) {
    const comments = replies.querySelectorAll('.comment');
    comments.forEach((reply, i) => {
      if (i > 2) {
        reply.classList.add('comment--hidden');
      }
    })
    const btn = document.createElement('button');
    btn.setAttribute('class', 'btn btn--small btn--ml');
    btn.textContent = 'Show more';

    replies.nextElementSibling.appendChild(btn);
    btn.addEventListener('click', () => {
      btn.textContent = btn.textContent == 'Show more' ? 'Show less' : 'Show more';
      btn.closest('.comment__btns').previousElementSibling.querySelectorAll('.comment--hidden').forEach(reply => reply.classList.toggle('comment--visible'));
    })
  }
})

// Multi downloads
Gib.event('click', '#download', btn => {
  btn.querySelector('.fa-caret-down').classList.toggle('fa-caret-up');
  btn.nextElementSibling.classList.toggle('item__download--toggle');
})

// Global search
Gib.event('click', '#search-btn', () => {
  Gib.openModal('.modal-search');
})
Gib.event('keyup', '#global-search', Gib.debounce(search => {
  if (search.value.length > 1) {
    axios.post('/requests/global/search.php', {
      search_term: search.value
    }).then(res => {
      document.querySelector('.modal-search__results').innerHTML = res.data;
    }).catch(err => console.error(err));
  } else {
    document.querySelector('.modal-search__results').innerHTML = '';
  }
},500))

// Download counter
Gib.event('click', '[data-download]', (btn, event) => {
  const id = btn.getAttribute('data-download');
  const counter = document.querySelector('[aria-label*="Downloads"] > span');
  const count = parseInt(counter.textContent);
  if (!Cookies.get('dl_'+id)) {
    let time = new Date(new Date().getTime() + 120000);
    axios.post('/requests/item/download.php', {
      item_id: id
    }).then(res => {
      if (res.data == 1) {
        counter.textContent = count + 1;
        Cookies.set('dl_'+id, true, {expires: time});
      }
    }).catch(err => console.error(err));
  }
})

Gib.event('click', '#change-theme', () => {
  Gib.openModal('.modal-theme');
})
if (Cookies.get('theme')) {
  Gib.each('[name="theme"]', btn => {
    if (btn.value == Cookies.get('theme')) {
      btn.checked = true;
      btn.parentElement.classList.add('modal-theme__checkbox--checked');
    }
  })
} else {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && Gib.exist('.modal-theme')) {
		document.querySelector('.modal-theme .night').classList.add('toggle');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches && Gib.exist('.modal-theme')) {
    document.querySelector('.modal-theme .light').classList.add('toggle');
  }
}
Gib.event('click', '[name="theme"]', btn => {
  const theme = btn.value;
  const time = new Date(new Date().getTime() + 3600 * 1000 * 24 * 365);
  document.querySelector('#selected-theme').setAttribute('href', '/assets/css/themes/'+theme+'.css');
  localStorage.setItem('theme', theme);
  Cookies.set('theme', theme, {expires: time});
  
  Gib.each(Gib.siblings(btn.parentElement), sib => sib.classList.remove('modal-theme__checkbox--checked'));
  btn.parentElement.classList.add('modal-theme__checkbox--checked');
})

// Announcements
if (Gib.exist('.message')) {
  let id = document.querySelector('[data-message-id]').getAttribute('data-message-id');
  if (!localStorage.getItem(`message-${id}`)) {
    document.querySelector('.message').style.display = 'block';
  }
}
Gib.event('click', '.message__btn', () => {
  let id = document.querySelector('[data-message-id]').getAttribute('data-message-id');
  localStorage.setItem(`message-${id}`, 'seen');
  document.querySelector('.message').style.display = 'none';
})


// Dropdowns
function dropDown() {
  Gib.event('click', '.dropdown__btn', btn => btn.nextElementSibling.classList.add('dropdown__menu--opened'));
}
window.addEventListener('mouseup', e => {
  Gib.each('.dropdown__menu', menu => {
    if (!menu.contains(e.target)) {
      menu.classList.remove('dropdown__menu--opened');
    }
  })
});

Gib.event('click', '[data-tag-btn]', tagBtn => {
  window.location.hash = `tag-${tagBtn.getAttribute('data-tag-btn')}`;
})
if (window.location.hash.includes('tag-')) {
  tags();
}
window.addEventListener('hashchange', tags);
function tags() {
  let {hash} = window.location;
  let selected = hash.replace('#tag-', '');
  hash = hash.replace('#', '');
  
  if (hash.includes('tag-')) {
    if (selected == 'all') {
      Gib.each('.card', card => card.classList.remove('card--tag-hide'));
    } else {
      Gib.each('.card', card => {
        card.classList.add('card--tag-hide');
        if (card.getAttribute('data-tags').includes(selected)) {
          card.classList.remove('card--tag-hide');
        }
      })
    }
    document.querySelector('.tag-selected').textContent = selected;
    document.querySelector(`[data-tag-btn="${selected}"]`).checked = true;
  }
}

// Tabs
Gib.event('click', '[data-tab-btn]', tabBtn => {
  let tab = tabBtn.getAttribute('data-tab-btn');
  if (!tabBtn.getAttribute('data-tab-toggle')) {
    window.location.hash = tab;
  } else {
    let {hash} = window.location;
    let toggle = tabBtn.getAttribute('data-tab-toggle');
    hash.replace('#', '');
    window.location.hash = !hash ? tab : (tabBtn.classList.contains('tab-btn-active') ? toggle : tab);    
  }
})
if (window.location.hash) {
  tabs();
} else if (!window.location.hash && document.querySelectorAll('[data-tab]')[0]) {
  document.querySelectorAll('[data-tab]')[0].classList.add('tab-active');
  if (Gib.exist('[data-tab-btn]')) {
    document.querySelectorAll('[data-tab-btn]')[0].classList.add('tab-btn-active');
  }
}
window.addEventListener('hashchange', tabs);
function tabs() {
  let {hash} = window.location;
  hash = hash.replace('#', '');

  if (!hash.includes('tag-')) {
    if (Gib.exist(`[data-tab="${hash}"]`)) {
      Gib.each('[data-tab]', tab => {
        tab.classList.remove('tab-active');
        if (tab.getAttribute('data-tab') == hash) {
          tab.classList.add('tab-active');
        }
      })
      Gib.each('[data-tab-btn]', btn => {
        btn.classList.remove('tab-btn-active');
        if (btn.getAttribute('data-tab-btn') == hash) {
          btn.classList.add('tab-btn-active');
        }
      })
    } else {
      if (Gib.exist('[data-tab]') && Gib.exist('[data-tab-btn]')) {
        document.querySelectorAll('[data-tab]')[0].classList.add('tab-active');
        document.querySelectorAll('[data-tab-btn]')[0].classList.add('tab-btn-active');
      }
    }
  }
}