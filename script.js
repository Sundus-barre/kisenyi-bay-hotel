/* ============================================================
   KASENYI BAY HOTEL — shared script
   Runs on every page; each block checks the element exists
   before using it, since not every page has every feature.
   ============================================================ */

/* ---------- Mobile nav toggle (all pages) ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

/* ---------- Scroll reveal (home / about) ---------- */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.2 });

  revealEls.forEach(function (el) { revealObserver.observe(el); });
}

/* ============================================================
   BOOKING PAGE
   ============================================================ */
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
  const roomType   = document.getElementById('roomType');
  const guests     = document.getElementById('guests');
  const checkin    = document.getElementById('checkin');
  const checkout   = document.getElementById('checkout');
  const priceAmount = document.getElementById('priceAmount');
  const priceSub    = document.getElementById('priceSub');
  const formNote    = document.getElementById('formNote');

  function nightsBetween(startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const msPerNight = 1000 * 60 * 60 * 24;
    const diff = Math.round((end - start) / msPerNight);
    return diff;
  }

  function formatUGX(n) {
    return 'UGX ' + n.toLocaleString('en-UG');
  }

  /* Live price calculation — runs whenever room or dates change */
  function updatePrice() {
    const selected = roomType.options[roomType.selectedIndex];
    const pricePerNight = selected ? Number(selected.dataset.price || 0) : 0;

    if (!pricePerNight || !checkin.value || !checkout.value) {
      priceAmount.textContent = 'UGX 0';
      priceSub.textContent = 'Select a room and dates';
      return;
    }

    const nights = nightsBetween(checkin.value, checkout.value);

    if (nights <= 0) {
      priceAmount.textContent = 'UGX 0';
      priceSub.textContent = 'Check-out must be after check-in';
      return;
    }

    const total = nights * pricePerNight;
    priceAmount.textContent = formatUGX(total);
    priceSub.textContent = nights + ' night' + (nights !== 1 ? 's' : '') + ' × ' + formatUGX(pricePerNight);
  }

  roomType.addEventListener('change', updatePrice);
  checkin.addEventListener('change', updatePrice);
  checkout.addEventListener('change', updatePrice);

  /* Field-by-field validation, same pattern as your registration form */
  function showError(id, message) {
    const errEl = document.getElementById('err-' + id);
    const fieldEl = document.getElementById(id);
    if (errEl) errEl.textContent = message;
    if (fieldEl) fieldEl.closest('.field').classList.toggle('has-error', Boolean(message));
  }

  function validateBooking() {
    let valid = true;

    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');

    if (!fullName.value.trim()) { showError('fullName', 'Enter your full name.'); valid = false; }
    else showError('fullName', '');

    if (!email.value.trim() || !email.value.includes('@')) { showError('email', 'Enter a valid email.'); valid = false; }
    else showError('email', '');

    if (!phone.value.trim()) { showError('phone', 'Enter a phone number.'); valid = false; }
    else showError('phone', '');

    if (!roomType.value) { showError('roomType', 'Choose a room type.'); valid = false; }
    else showError('roomType', '');

    if (!guests.value || Number(guests.value) < 1) { showError('guests', 'At least 1 guest.'); valid = false; }
    else showError('guests', '');

    if (!checkin.value) { showError('checkin', 'Pick a check-in date.'); valid = false; }
    else showError('checkin', '');

    if (!checkout.value) { showError('checkout', 'Pick a check-out date.'); valid = false; }
    else if (checkin.value && nightsBetween(checkin.value, checkout.value) <= 0) {
      showError('checkout', 'Must be after check-in.'); valid = false;
    } else showError('checkout', '');

    return valid;
  }

  bookingForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateBooking()) {
      formNote.textContent = 'Please fix the highlighted fields.';
      formNote.className = 'form-note show';
      return;
    }

    const nights = nightsBetween(checkin.value, checkout.value);
    const roomLabel = roomType.options[roomType.selectedIndex].text.split(' — ')[0];

    formNote.textContent = 'Request received — ' + roomLabel + ' for ' + nights + ' night(s). We will confirm by email shortly.';
    formNote.className = 'form-note show success';
    bookingForm.reset();
    updatePrice();
  });
}

/* ============================================================
   CONTACT PAGE
   ============================================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const contactNote = document.getElementById('contactNote');

  function showContactError(id, message) {
    const errEl = document.getElementById('err-' + id);
    const fieldEl = document.getElementById(id);
    if (errEl) errEl.textContent = message;
    if (fieldEl) fieldEl.closest('.field').classList.toggle('has-error', Boolean(message));
  }

  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let valid = true;

    const cName = document.getElementById('cName');
    const cEmail = document.getElementById('cEmail');
    const cSubject = document.getElementById('cSubject');
    const cMessage = document.getElementById('cMessage');

    if (!cName.value.trim()) { showContactError('cName', 'Enter your name.'); valid = false; }
    else showContactError('cName', '');

    if (!cEmail.value.trim() || !cEmail.value.includes('@')) { showContactError('cEmail', 'Enter a valid email.'); valid = false; }
    else showContactError('cEmail', '');

    if (!cSubject.value) { showContactError('cSubject', 'Pick a topic.'); valid = false; }
    else showContactError('cSubject', '');

    if (!cMessage.value.trim()) { showContactError('cMessage', 'Write a short message.'); valid = false; }
    else showContactError('cMessage', '');

    if (!valid) {
      contactNote.textContent = 'Please fix the highlighted fields.';
      contactNote.className = 'form-note show';
      return;
    }

    contactNote.textContent = 'Thanks, ' + cName.value.trim() + ' — we will reply within one business day.';
    contactNote.className = 'form-note show success';
    contactForm.reset();
  });
}

/* ============================================================
   ROOM FILTER (only present if room-filters exist on a page)
   ============================================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
  const roomCards = document.querySelectorAll('.room-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      roomCards.forEach(function (card) {
        const matches = filter === 'all' || card.dataset.type === filter;
        card.classList.toggle('hidden', !matches);
      });
    });
  });
}
