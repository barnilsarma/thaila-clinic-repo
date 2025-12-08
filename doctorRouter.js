(function () {
  // doctorRouter.js
  // Client-side routing to /doctor/:id and DOM rendering of doctor profile

  const doctors = window.db || (typeof module !== 'undefined' && typeof require === 'function' ? require('./doctorDb') : null) || [];

  function getDoctorById(id) {
    const nid = Number(id);
    return doctors.find(d => Number(d.id) === nid) || null;
  }

  function createProfileMarkup(doc) {
    const areas = (doc.area || []).map(a => `<li>${escapeHtml(a)}</li>`).join('');
    const about = doc.about || '';

    return `
      <div class="doctor-profile-overlay" id="doctor-profile">
        <div class="dp-backdrop" data-action="close" style="position:fixed;inset:0;background:rgba(0,0,0,0.45);backdrop-filter:blur(2px);"></div>
        <div class="dp-card" role="dialog" aria-modal="true" aria-label="Doctor profile" style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);max-width:960px;width:92%;background:#fff;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,0.25);z-index:10001;overflow:hidden;font-family:inherit;color:inherit;">
          <button class="dp-close" aria-label="Close profile" data-action="close" style="position:absolute;right:12px;top:12px;background:transparent;border:none;font-size:28px;cursor:pointer;">×</button>
          <div style="display:flex;flex-wrap:wrap;align-items:stretch;">
            <div style="flex:0 0 320px;max-width:320px;min-height:320px;background:#f6f6f6;display:flex;align-items:center;justify-content:center;">
              <img src="${escapeAttr(doc.photo)}" alt="${escapeAttr(doc.name)}" style="width:100%;height:100%;object-fit:cover;display:block;" />
            </div>
            <div style="flex:1 1 1px;padding:28px;">
              <h2 style="margin:0 0 8px 0;font-size:22px;">${escapeHtml(doc.name)}</h2>
              <div style="color:#2b7fc7;font-weight:700;margin-bottom:8px;">${escapeHtml(doc.designation || doc.position || '')}</div>
              <div style="color:#6b6b6b;margin-bottom:12px;font-size:14px;">${escapeHtml(doc.academics || doc.qualifications || '')}</div>
              <div style="margin-bottom:12px;color:#444;font-size:14px;">
                <strong>${escapeHtml(doc.yoe || '')}</strong>
                ${doc.patients ? ` • ${escapeHtml(doc.patients)}` : ''}
              </div>
              <div style="margin-bottom:16px;color:#333;line-height:1.6;">${about}</div>
              <div>
                <strong style="display:block;margin-bottom:8px;">Specialties</strong>
                <ul style="display:flex;gap:8px;flex-wrap:wrap;list-style:none;padding:0;margin:0">${areas}</ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/\n/g, '').replace(/\r/g, '');
  }

  function showDoctor(id, options = {}) {
    const doc = getDoctorById(id);
    if (!doc) return showNotFound(id);

    // remove existing profile if any
    removeProfile();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = createProfileMarkup(doc);
    // Append to body
    document.body.appendChild(wrapper.firstElementChild);
    // prevent body scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // update title
    const prevTitle = document.title;
    document.title = `${doc.name} — Sri Thaila Clinic`;

    // wire close buttons
    const overlay = document.getElementById('doctor-profile');
    overlay.addEventListener('click', (ev) => {
      const action = ev.target.closest('[data-action]')?.getAttribute('data-action');
      if (action === 'close') {
        closeDoctorProfile();
      }
    });

    // handle Esc
    function onKey(e) {
      if (e.key === 'Escape') closeDoctorProfile();
    }
    document.addEventListener('keydown', onKey);

    // store cleanup reference
    overlay._cleanup = () => {
      document.removeEventListener('keydown', onKey);
      document.title = prevTitle;
    };
  }

  function showNotFound(id) {
    removeProfile();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="doctor-profile-overlay" id="doctor-profile">
        <div class="dp-backdrop" data-action="close" style="position:fixed;inset:0;background:rgba(0,0,0,0.45);"></div>
        <div style="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);background:#fff;padding:32px;border-radius:12px;z-index:10001;">Doctor not found (id: ${escapeHtml(id)})<div style="margin-top:12px;text-align:right;"><button data-action=\"close\">Close</button></div></div>
      </div>
    `;
    document.body.appendChild(wrapper.firstElementChild);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function removeProfile() {
    const existing = document.getElementById('doctor-profile');
    if (existing) {
      if (existing._cleanup) existing._cleanup();
      existing.remove();
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }

  function navigateToDoctor(id, push = true) {
    // Navigate to the standalone profile page. Use query param so static hosting works.
    const target = `doctorProfile.html?id=${encodeURIComponent(id)}`;
    // Perform a full navigation to the profile page
    window.location.href = target;
  }

  function handlePath(pathname, opts = {}) {
    const m = pathname.match(/^\/doctor\/(\d+)/);
    if (m) {
      const id = Number(m[1]);
      showDoctor(id);
    } else {
      removeProfile();
    }
  }

  function onPopState() {
    handlePath(location.pathname);
  }

  function init() {
    // wire up existing doctor cards (fallback if pages have onclick attributes)
    document.querySelectorAll('.doctor-card').forEach(card => {
      // preserve existing onclick attribute behavior but prefer data-id
      if (!card.dataset._routerAttached) {
        card.dataset._routerAttached = '1';
        card.addEventListener('click', (e) => {
          // if card has explicit data-id attribute use it, else try parse onclick
          let id = card.dataset.id;
          if (typeof id === 'undefined' || id === null || id === '') {
            const onclick = card.getAttribute('onclick') || '';
            const match = onclick.match(/doctorCardClick\((\d+)\)/);
            if (match) id = match[1];
          }
          if (id != null && id !== '') {
            e.preventDefault();
            navigateToDoctor(id, true);
          }
        });
      }
    });

    // intercept links to /doctor/:id
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="/doctor/"]');
      if (a) {
        e.preventDefault();
        const m = a.getAttribute('href').match(/^\/doctor\/(\d+)/);
        if (m) navigateToDoctor(m[1], true);
      }
    });

    // expose global function used by inline onclicks if present
    window.doctorCardClick = function (id) {
      navigateToDoctor(id, true);
    };

    window.addEventListener('popstate', onPopState);

    // initial routing on load
    document.addEventListener('DOMContentLoaded', () => {
      handlePath(location.pathname);
    });
  }

  // initialize immediately
  init();

})();function doctorCardClick(doctor){
    alert(doctor);
}