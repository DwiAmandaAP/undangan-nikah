(function () {
  const cover = document.getElementById('cover');
  const openBtn = document.getElementById('openBtn');
  const scene = document.getElementById('scene');
  const hint = document.getElementById('hint');
  const flipStage = document.getElementById('flipStage');
  const flipCard = document.getElementById('flipCard');
  const backFace = document.getElementById('backFace');

  openBtn.addEventListener('click', function () {
    cover.classList.add('is-leaving');
    scene.classList.add('is-active');
    setTimeout(function () { hint.classList.add('is-hidden'); }, 2600);
  });

  function toggleFlip(e) {
    if (flipCard.classList.contains('is-flipped')) {
      if (e && backFace.contains(e.target)) return; // let form controls work on the back
    }
    flipCard.classList.toggle('is-flipped');
    hint.classList.add('is-hidden');
  }
  flipStage.addEventListener('click', toggleFlip);
  flipStage.addEventListener('keydown', function (e) {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return; // biarkan spasi/enter bekerja normal di form
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFlip(); }
  });

  const target = new Date('2026-10-31T08:00:00+07:00').getTime();
  function tick() {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = (n) => String(n).padStart(2, '0');
    document.getElementById('cdDays').textContent = pad(d);
    document.getElementById('cdHours').textContent = pad(h);
    document.getElementById('cdMins').textContent = pad(m);
    document.getElementById('cdSecs').textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  // RSVP + wishes, kept in memory + localStorage (per-device convenience only)
  // Isi nomor WhatsApp tujuan di bawah ini, format internasional tanpa + atau 0 di depan.
  // Contoh: nomor 0812-3456-7890 ditulis '628123456789'
  const WHATSAPP_NUMBER = '628123456789';
  const STORE_KEY = 'wedding-safri-fitri-wishes';
  let wishes = [];
  try { wishes = JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); } catch (e) { wishes = []; }

  function renderWishes() {
    const list = document.getElementById('wishesList');
    const empty = document.getElementById('wishesEmpty');
    list.querySelectorAll('.wish').forEach((n) => n.remove());
    if (!wishes.length) { empty.hidden = false; return; }
    empty.hidden = true;
    wishes.slice().reverse().forEach((w) => {
      const div = document.createElement('div');
      div.className = 'wish';
      const who = document.createElement('p'); who.className = 'who'; who.textContent = w.name;
      const status = document.createElement('p'); status.className = 'status'; status.textContent = w.status;
      div.appendChild(who); div.appendChild(status);
      if (w.wish) { const what = document.createElement('p'); what.className = 'what'; what.textContent = w.wish; div.appendChild(what); }
      list.appendChild(div);
    });
  }
  renderWishes();

  document.getElementById('rsvpForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('rsvpName').value.trim();
    const status = document.getElementById('rsvpStatus').value;
    const wish = document.getElementById('rsvpWish').value.trim();
    if (!name || !status) return;
    const statusLabel = status === 'Hadir' ? 'Insya Allah hadir' : (status === 'Tidak Hadir' ? 'Berhalangan hadir' : 'Masih ragu');
    wishes.push({ name: name, status: statusLabel, wish: wish });
    try { localStorage.setItem(STORE_KEY, JSON.stringify(wishes)); } catch (e) {}
    renderWishes();
    this.reset();
    const note = document.getElementById('rsvpNote');
    note.hidden = false;
    setTimeout(() => { note.hidden = true; }, 4000);

    if (WHATSAPP_NUMBER && WHATSAPP_NUMBER !== '6282140819412') {
      let message = 'Assalamu\'alaikum, konfirmasi kehadiran undangan Safri & Fitri:\n\n'
        + 'Nama: ' + name + '\n'
        + 'Konfirmasi: ' + statusLabel;
      if (wish) message += '\nUcapan & Doa: ' + wish;
      const waUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
      window.open(waUrl, '_blank', 'noopener');
    }
  });

  const audio = document.getElementById('bgAudio');
  const musicBtn = document.getElementById('musicToggle');
  musicBtn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play().catch(() => {});
      musicBtn.classList.add('spin');
      musicBtn.setAttribute('aria-pressed', 'true');
    } else {
      audio.pause();
      musicBtn.classList.remove('spin');
      musicBtn.setAttribute('aria-pressed', 'false');
    }
  });
})();