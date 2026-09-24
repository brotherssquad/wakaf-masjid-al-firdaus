/**
 * JavaScript Interactivity for Landing Page Wakaf Masjid Al-Firdaus Ngoto, Bantul
 */

// Target data from poster
const TARGET_LUAS_M2 = 1600;
const TARGET_DANA = 4800000000; // Rp 4.800.000.000
const HARGA_PER_M2 = 3000000; // Rp 3.000.000 per meter persegi (Paket B)

// Pre-seeded Prayers for Wall of Doa
const DEFAULT_DOA = [
  {
    nama: "Hamba Allah (Ngoto)",
    paket: "Paket B (Rp 3.000.000)",
    doa: "Bismillah, semoga menjadi amal jariyah untuk kedua orang tua kami tercinta yang telah berpulang. Semoga Allah jadikan kubur beliau taman-taman surga.",
    waktu: "1 jam yang lalu",
    aamiinCount: 28
  },
  {
    nama: "Keluarga Bp. Supriyanto (Bantul)",
    paket: "Paket A (Rp 5.000.000)",
    doa: "Alhamdulillah dapat berpartisipasi dalam pembebasan tanah Masjid Al-Firdaus. Semoga pembangunan berjalan lancar dan membawa keberkahan bagi masyarakat Sewon.",
    waktu: "3 jam yang lalu",
    aamiinCount: 45
  },
  {
    nama: "Hj. Nurul Khairunnisa (Yogyakarta)",
    paket: "Paket C (Rp 1.500.000)",
    doa: "Semoga anak cucu kami menjadi penghafal Al-Qur'an dan istiqomah memakmurkan masjid. Aamiin ya Rabbal 'Alamin.",
    waktu: "5 jam yang lalu",
    aamiinCount: 19
  },
  {
    nama: "Muhsinin Alumni Yogyakarta",
    paket: "Nominal Bebas (Rp 500.000)",
    doa: "Titip doa agar keluarga senantiasa diberi keistiqomahan iman, kesehatan, dan kelapangan rezeki yang berkah.",
    waktu: "8 jam yang lalu",
    aamiinCount: 33
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCopyButtons();
  initPackageCards();
  initCalculator();
  initDonationForm();
  initWallOfDoa();
  initPosterModal();
  animateNumbers();
});

// Mobile Navbar Toggle
function initNavbar() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

// Copy to Clipboard Utility
function copyText(text, message) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(message || 'Nomor rekening berhasil disalin!');
  }).catch(() => {
    // Fallback for older browsers
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(message || 'Nomor rekening berhasil disalin!');
  });
}

function initCopyButtons() {
  const copyBtn = document.getElementById('btnCopyRekening');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyText('5310076484', '✅ Rekening Bank Muamalat 5310076484 a.n. Masjid Al-Firdaus tersalin!');
    });
  }

  // Generic copy buttons
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = btn.getAttribute('data-copy');
      const msg = btn.getAttribute('data-copy-msg');
      copyText(text, msg);
    });
  });
}

// Toast Alert
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.remove('hide');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
  }, 3500);
}

// Format Currency to Indonesian Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(number);
}

// Interactive Package Selection
function initPackageCards() {
  const packageBtns = document.querySelectorAll('[data-package]');
  const packageSelect = document.getElementById('formPaket');
  const nominalInput = document.getElementById('formNominal');
  const donationSection = document.getElementById('donasi');

  packageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pkg = btn.getAttribute('data-package');
      const amount = btn.getAttribute('data-amount');

      if (packageSelect) {
        packageSelect.value = pkg;
      }

      if (nominalInput) {
        if (amount && parseInt(amount) > 0) {
          nominalInput.value = parseInt(amount);
          nominalInput.readOnly = (pkg !== 'Bebas');
        } else {
          nominalInput.value = '';
          nominalInput.readOnly = false;
          nominalInput.focus();
        }
      }

      // Smooth scroll to form
      if (donationSection) {
        donationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      showToast(`Paket terpilih: ${pkg}. Silakan lengkapi formulir donasi.`);
    });
  });

  if (packageSelect && nominalInput) {
    packageSelect.addEventListener('change', () => {
      const val = packageSelect.value;
      if (val === 'Paket A') {
        nominalInput.value = 5000000;
        nominalInput.readOnly = true;
      } else if (val === 'Paket B') {
        nominalInput.value = 3000000;
        nominalInput.readOnly = true;
      } else if (val === 'Paket C') {
        nominalInput.value = 1500000;
        nominalInput.readOnly = true;
      } else if (val === 'Paket D') {
        nominalInput.value = 500000;
        nominalInput.readOnly = true;
      } else {
        nominalInput.readOnly = false;
        if (nominalInput.value === '5000000' || nominalInput.value === '3000000' || nominalInput.value === '1500000' || nominalInput.value === '500000') {
          nominalInput.value = '';
        }
        nominalInput.focus();
      }
    });
  }
}

// Land Calculator Logic
function initCalculator() {
  const slider = document.getElementById('calcMeterSlider');
  const meterDisplay = document.getElementById('calcMeterVal');
  const nominalDisplay = document.getElementById('calcNominalVal');
  const ctaBtn = document.getElementById('calcCtaBtn');

  const customNominalInput = document.getElementById('calcCustomNominal');
  const customHasilMeter = document.getElementById('calcHasilMeter');

  if (slider && meterDisplay && nominalDisplay) {
    const updateSlider = () => {
      const meters = parseFloat(slider.value);
      meterDisplay.textContent = meters.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      const totalRp = meters * HARGA_PER_M2;
      nominalDisplay.textContent = formatRupiah(totalRp);
    };

    slider.addEventListener('input', updateSlider);
    updateSlider();

    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        const meters = parseFloat(slider.value);
        const totalRp = meters * HARGA_PER_M2;
        const packageSelect = document.getElementById('formPaket');
        const nominalInput = document.getElementById('formNominal');
        const donationSection = document.getElementById('donasi');

        if (packageSelect && nominalInput) {
          packageSelect.value = 'Bebas';
          nominalInput.value = totalRp;
          nominalInput.readOnly = false;
        }

        if (donationSection) {
          donationSection.scrollIntoView({ behavior: 'smooth' });
        }
        showToast(`Estimasi pembebasan ${meters} m² (${formatRupiah(totalRp)}) siap dikonfirmasi!`);
      });
    }
  }

  // Reverse calculator (Input nominal -> shows m2)
  if (customNominalInput && customHasilMeter) {
    customNominalInput.addEventListener('input', () => {
      const val = parseFloat(customNominalInput.value) || 0;
      const m2 = val / HARGA_PER_M2;
      if (m2 >= 1) {
        customHasilMeter.textContent = `Setara ~${m2.toFixed(2)} m² lahan`;
      } else if (m2 > 0) {
        const cm2 = Math.round(m2 * 10000);
        customHasilMeter.textContent = `Setara ~${m2.toFixed(2)} m² (${cm2.toLocaleString('id-ID')} cm²) lahan`;
      } else {
        customHasilMeter.textContent = `Setara ~0 m² lahan`;
      }
    });
  }

  // Quick chips for nominal bebas
  document.querySelectorAll('.calc-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-value');
      if (customNominalInput) {
        customNominalInput.value = val;
        customNominalInput.dispatchEvent(new Event('input'));
      }
    });
  });
}

// WhatsApp Confirmation Generator
function initDonationForm() {
  const form = document.getElementById('donationConfirmForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nama = document.getElementById('formNama').value.trim() || 'Hamba Allah';
    const noHp = document.getElementById('formHp').value.trim() || '-';
    const paket = document.getElementById('formPaket').value;
    const nominal = document.getElementById('formNominal').value;
    const metode = document.querySelector('input[name="formMetode"]:checked')?.value || 'Transfer Bank Muamalat';
    const doa = document.getElementById('formDoa').value.trim() || 'Semoga menjadi amal jariyah yang diridhai Allah SWT. Aamiin.';
    const admin = document.getElementById('formAdmin').value;

    const formattedNominal = nominal ? formatRupiah(parseInt(nominal)) : 'Sesuai Kerelaan';
    const tanggalHariIni = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // WhatsApp Message Text
    const pesanWA = 
`Assalamu'alaikum Warahmatullahi Wabarakatuh,

Bismillah, perkenankan saya konfirmasi komitmen/donasi untuk program *Wakaf Perluasan Masjid Al-Firdaus Ngoto, Sewon, Bantul, D.I. Yogyakarta*:

📋 *DATA DONATUR:*
• *Nama:* ${nama}
• *No. WhatsApp:* ${noHp}
• *Paket Wakaf:* ${paket}
• *Nominal:* ${formattedNominal}
• *Metode:* ${metode}
• *Tanggal:* ${tanggalHariIni}

🤲 *DOA & HAJAT:*
"${doa}"

Mohon konfirmasi penerimaan dan doa dari para asatidz serta jamaah Masjid Al-Firdaus. Semoga menjadi amal jariyah penolong kita di akhirat kelak. Aamiin.

Jazakumullahu Khairan Katsiran.`;

    const encodedMsg = encodeURIComponent(pesanWA);
    const waUrl = `https://wa.me/${admin}?text=${encodedMsg}`;

    // Also add to Wall of Doa locally
    addPrayerToLocal({
      nama: nama,
      paket: `${paket} (${formattedNominal})`,
      doa: doa,
      waktu: 'Baru saja',
      aamiinCount: 1
    });

    // Open WhatsApp
    window.open(waUrl, '_blank');
    showToast('Membuka WhatsApp untuk mengirim konfirmasi donasi...');
  });
}

// Wall of Doa Functionality
function initWallOfDoa() {
  const container = document.getElementById('doaListContainer');
  if (!container) return;

  let prayers = [];
  try {
    const stored = localStorage.getItem('al_firdaus_prayers');
    if (stored) {
      prayers = JSON.parse(stored);
    }
  } catch (err) {
    console.warn('LocalStorage unavailable', err);
  }

  if (!prayers || prayers.length === 0) {
    prayers = DEFAULT_DOA;
  }

  renderPrayers(prayers);

  // Quick prayer submit from the wall section
  const directDoaForm = document.getElementById('directDoaForm');
  if (directDoaForm) {
    directDoaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const namaInput = document.getElementById('directNama');
      const doaInput = document.getElementById('directPesan');

      const nama = namaInput.value.trim() || 'Hamba Allah';
      const doa = doaInput.value.trim();

      if (!doa) {
        showToast('Silakan tulis doa atau harapan Anda.');
        return;
      }

      addPrayerToLocal({
        nama: nama,
        paket: 'Muhsinin Al-Firdaus',
        doa: doa,
        waktu: 'Baru saja',
        aamiinCount: 1
      });

      namaInput.value = '';
      doaInput.value = '';
      showToast('Aamiin! Doa Anda telah tercantum di dinding doa.');
    });
  }
}

function renderPrayers(prayers) {
  const container = document.getElementById('doaListContainer');
  if (!container) return;

  container.innerHTML = '';
  prayers.slice(0, 10).forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl p-5 border border-amber-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between';
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              ${item.nama.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 class="font-bold text-gray-800 text-sm leading-tight">${escapeHtml(item.nama)}</h4>
              <span class="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full inline-block mt-0.5 font-medium">${escapeHtml(item.paket || 'Donatur')}</span>
            </div>
          </div>
          <span class="text-[11px] text-gray-400">${item.waktu || 'Terkini'}</span>
        </div>
        <p class="text-gray-700 text-sm italic font-normal mt-2 leading-relaxed">
          "${escapeHtml(item.doa)}"
        </p>
      </div>
      <div class="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span class="text-xs text-gray-400">Amal Jariyah Masjid Al-Firdaus</span>
        <button onclick="incrementAamiin(${index})" class="flex items-center space-x-1.5 text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full transition-colors font-medium">
          <span>🤲 Aamiin</span>
          <span id="aamiin-cnt-${index}" class="font-semibold">(${item.aamiinCount || 1})</span>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function addPrayerToLocal(prayerObj) {
  let prayers = [];
  try {
    const stored = localStorage.getItem('al_firdaus_prayers');
    if (stored) {
      prayers = JSON.parse(stored);
    } else {
      prayers = [...DEFAULT_DOA];
    }
  } catch (err) {
    prayers = [...DEFAULT_DOA];
  }

  prayers.unshift(prayerObj);
  try {
    localStorage.setItem('al_firdaus_prayers', JSON.stringify(prayers));
  } catch (e) {}

  renderPrayers(prayers);
}

window.incrementAamiin = function(index) {
  let prayers = [];
  try {
    const stored = localStorage.getItem('al_firdaus_prayers');
    if (stored) prayers = JSON.parse(stored);
    else prayers = [...DEFAULT_DOA];
  } catch (e) {
    prayers = [...DEFAULT_DOA];
  }

  if (prayers[index]) {
    prayers[index].aamiinCount = (prayers[index].aamiinCount || 0) + 1;
    try {
      localStorage.setItem('al_firdaus_prayers', JSON.stringify(prayers));
    } catch (e) {}
    
    const countSpan = document.getElementById(`aamiin-cnt-${index}`);
    if (countSpan) {
      countSpan.textContent = `(${prayers[index].aamiinCount})`;
    }
    showToast('Aamiin Ya Rabbal \'Alamin! Semoga Allah mengijabah.');
  }
};

// Poster Modal Viewer
function initPosterModal() {
  const modal = document.getElementById('posterModal');
  const openBtns = document.querySelectorAll('.open-poster-modal');
  const closeBtns = document.querySelectorAll('.close-poster-modal');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// Animate Numbers on Scroll
function animateNumbers() {
  const elements = document.querySelectorAll('[data-target-num]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target-num'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        let start = 0;
        const duration = 1800;
        const stepTime = 25;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;

        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          el.textContent = `${prefix}${Math.floor(start).toLocaleString('id-ID')}${suffix}`;
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(el => observer.observe(el));
}

// Helper to escape HTML characters
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
