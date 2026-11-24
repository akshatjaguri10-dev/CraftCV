// ---------- helpers ----------
const $ = (id) => document.getElementById(id);
const form = $('resume-form');
const PAPER_W = 794;

const DEFAULTS = { color: '#1a9c8f', size: '14' };
const custom = { ...DEFAULTS };
const FIELDS = ['name', 'email', 'phone', 'city', 'summary', 'degree', 'college', 'year'];

// ---------- 1. Load & Switch Templates ----------
const urlParams = new URLSearchParams(window.location.search);
const urlTemplate = urlParams.get('t');
let currentTemplate = urlTemplate || localStorage.getItem('cvforge-template') || 'classic';

function loadTemplate(templateName) {
  currentTemplate = templateName;
  localStorage.setItem('cvforge-template', templateName);
  $('paper-fit').innerHTML = RESUME_TEMPLATES[templateName];
  applyCustom();
  render();
  setTimeout(() => { fitPreview(); }, 50);
}

// ---------- 2. Collect Data ----------
function getData() {
  const skills = Array.from(document.querySelectorAll('#skillsList .form-input'))
    .map(input => input.value.trim())
    .filter(Boolean);

  const certifications = Array.from(document.querySelectorAll('#certificationsList .cert-row'))
    .map(row => {
      const name = row.querySelector('input[name="cert_name[]"]').value.trim();
      const year = row.querySelector('input[name="cert_year[]"]').value.trim();
      return name ? (year ? `${name} (${year})` : name) : null;
    })
    .filter(Boolean);

  const projects = Array.from(document.querySelectorAll('#projectsList .project-item'))
    .map(item => {
      const title = item.querySelector('input').value.trim();
      const desc = item.querySelector('textarea').value.trim();
      return (title || desc) ? `${title}: ${desc}` : null;
    })
    .filter(Boolean);

  return {
    name: $('name').value.trim(),
    email: $('email').value.trim(),
    phone: $('phone').value.trim(),
    city: $('city').value.trim(),
    summary: $('summary').value.trim(),
    degree: $('degree').value.trim(),
    college: $('college').value.trim(),
    year: $('year').value.trim(),
    skills: skills,
    certifications: certifications,
    projects: projects,
    template: currentTemplate,
    color: custom.color,
    size: Number(custom.size)
  };
}

// ---------- 3. Save / Load ----------
function save() {
  try {
    const raw = {};
    FIELDS.forEach(f => { if($(f)) raw[f] = $(f).value; });
    localStorage.setItem('cvforge-data', JSON.stringify(raw));
    localStorage.setItem('cvforge-custom', JSON.stringify(custom));
  } catch (e) {}
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem('cvforge-data') || '{}');
    FIELDS.forEach(f => { if (raw[f] && $(f)) $(f).value = raw[f]; });
    const c = JSON.parse(localStorage.getItem('cvforge-custom') || 'null');
    if (c) Object.assign(custom, c);
  } catch (e) {}
}

// ---------- 4. Live Preview ----------
function toggle(sectionId, hasContent) {
  const el = $(sectionId);
  if (el) el.classList.toggle('is-empty', !hasContent);
}

function render() {
  const d = getData();
  if (!$('resume')) return;

  $('p-name').textContent = d.name || 'Your Name';

  if (currentTemplate === 'modern') {
    $('p-contact').innerHTML = [d.email, d.phone, d.city].filter(Boolean).join('<br>') || 'email<br>phone<br>city';
  } else {
    $('p-contact').textContent = [d.email, d.phone, d.city].filter(Boolean).join(' · ') || 'email · phone · city';
  }

  $('p-summary').textContent = d.summary || 'A short summary about you will show up here.';
  toggle('s-summary', d.summary);

  const edu = [d.degree, d.college, d.year].filter(Boolean).join(', ');
  $('p-education').textContent = edu || 'Your degree, college and years.';
  toggle('s-education', edu);

  $('p-skills').textContent = d.skills.length ? d.skills.join(', ') : 'Your skills, separated by commas.';
  toggle('s-skills', d.skills.length);

  const certText = d.certifications.length ? `<br><strong>Certifications:</strong> ${d.certifications.join(', ')}` : '';
  if (certText) {
    $('p-education').innerHTML += certText;
  }

  const list = $('p-projects');
  list.innerHTML = '';
  (d.projects.length ? d.projects : ['One project per line.']).forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    list.appendChild(li);
  });
  toggle('s-projects', d.projects.length);

  $('summary-count').textContent = $('summary').value.length;

  const checks = [d.name, d.email, d.phone, d.city, d.summary, d.degree, d.college, d.skills.length, d.projects.length];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  $('score-pill').textContent = pct + '%';
  $('bar-fill').style.width = pct + '%';

  fitPreview();
  save();
}

function fitPreview() {
  const stage = $('stage');
  const resumeEl = $('resume');
  if (!resumeEl || !stage) return;

  const pad = parseFloat(getComputedStyle(stage).paddingLeft) * 2;
  const scale = Math.min(1, (stage.clientWidth - pad) / PAPER_W);
  resumeEl.style.transform = `scale(${scale})`;
  $('paper-fit').style.height = resumeEl.offsetHeight * scale + 'px';
}

form.addEventListener('input', render);
window.addEventListener('resize', fitPreview);

// ---------- 5. Customize Tab ----------
function applyCustom() {
  const resumeEl = $('resume');
  if (!resumeEl) return;

  resumeEl.style.setProperty('--r-accent', custom.color);
  resumeEl.style.setProperty('--r-fs', custom.size + 'px');

  document.querySelectorAll('.swatch').forEach(b =>
    b.classList.toggle('active', b.dataset.color === custom.color));
  document.querySelectorAll('.size').forEach(b =>
    b.classList.toggle('active', b.dataset.size === String(custom.size)));

  fitPreview();
  save();
}

$('swatches').addEventListener('click', (e) => {
  const b = e.target.closest('.swatch');
  if (!b) return;
  custom.color = b.dataset.color;
  applyCustom();
});

$('sizes').addEventListener('click', (e) => {
  const b = e.target.closest('.size');
  if (!b) return;
  custom.size = b.dataset.size;
  applyCustom();
});

$('reset-custom').addEventListener('click', () => {
  Object.assign(custom, DEFAULTS);
  applyCustom();
});

// ---------- 6. Tabs ----------
function showTab(which) {
  const edit = which === 'edit';
  $('panel-edit').hidden = !edit;
  $('panel-customize').hidden = edit;
  $('tab-edit').classList.toggle('active', edit);
  $('tab-customize').classList.toggle('active', !edit);
}
$('tab-edit').addEventListener('click', () => showTab('edit'));
$('tab-customize').addEventListener('click', () => showTab('customize'));

// ---------- 7. PDF Generation ----------
function setStatus(msg, bad) {
  const s = $('form-status');
  if (!s) return;
  s.textContent = msg;
  s.className = bad ? 'bad' : '';
}

form.addEventListener('submit', (e) => e.preventDefault());

function fileName() {
  return (getData().name.replace(/\s+/g, '_').replace(/[^\w-]/g, '') || 'resume') + '_CV.pdf';
}

async function generatePdf(outputType) {
  if (!form.reportValidity()) return null;
  setStatus('Generating PDF…');

  const resumeEl = $('resume');
  const paperFit = $('paper-fit');
  const originalTransform = resumeEl.style.transform;

  resumeEl.style.transform = 'none';
  paperFit.style.height = 'auto';

  const opt = {
    margin: 0, filename: fileName(),
    html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  try {
    if (outputType === 'download') {
      await html2pdf().set(opt).from(resumeEl).save();
      setStatus('Downloaded!');
    } else {
      return await html2pdf().set(opt).from(resumeEl).outputPdf('bloburl');
    }
  } catch (err) {
    setStatus('Failed to generate PDF.', true);
  } finally {
    resumeEl.style.transform = originalTransform;
    fitPreview();
  }
}

$('download-btn').addEventListener('click', () => generatePdf('download'));
$('preview-btn').addEventListener('click', async () => {
  const url = await generatePdf('bloburl');
  if (url) { $('pdf-frame').src = url; $('pdf-modal').hidden = false; setStatus(''); }
});
$('modal-close').addEventListener('click', () => { $('pdf-modal').hidden = true; });

// ---------- 8. Dynamic "Add More" Buttons ----------
const addProjectBtn = document.getElementById("addProjectBtn");
if(addProjectBtn) {
  addProjectBtn.addEventListener("click", () => {
    const count = document.querySelectorAll("#projectsList .project-item").length + 1;
    const div = document.createElement("div");
    div.className = "project-item";
    div.innerHTML = `
      <input type="text" name="project_title[]" class="form-input" placeholder="Project ${count} title">
      <textarea name="project_desc[]" rows="3" class="form-textarea" placeholder="Project ${count} description"></textarea>
    `;
    document.getElementById("projectsList").appendChild(div);
  });
}

const addCertBtn = document.getElementById("addCertBtn");
if(addCertBtn) {
  addCertBtn.addEventListener("click", () => {
    const count = document.querySelectorAll("#certificationsList .cert-row").length + 1;
    const div = document.createElement("div");
    div.className = "cert-row";
    div.innerHTML = `
      <input type="text" name="cert_name[]" class="form-input" placeholder="Certification ${count} name">
      <input type="text" name="cert_year[]" class="form-input cert-year" placeholder="Year">
    `;
    document.getElementById("certificationsList").appendChild(div);
  });
}

const addSkillBtn = document.getElementById("addSkillBtn");
if(addSkillBtn) {
  addSkillBtn.addEventListener("click", () => {
    const count = document.querySelectorAll("#skillsList .form-input").length + 1;
    const div = document.createElement("div");
    div.className = "field";
    div.innerHTML = `<input type="text" name="skills[]" class="form-input" placeholder="Skill ${count}">`;
    document.getElementById("skillsList").appendChild(div);
  });
}

// Contact Popup
const contactBtn = document.getElementById('contact-btn');
if (contactBtn) {
  contactBtn.addEventListener('click', () => { $('contact-modal').hidden = false; });
  $('close-modal').addEventListener('click', () => { $('contact-modal').hidden = true; });
}

// Init
load();
loadTemplate(currentTemplate);