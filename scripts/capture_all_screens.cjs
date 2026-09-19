const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '..', 'public', 'prints_entrega');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:4173';

const SCREENS = [
  // Seção 1: Landing Page & Autenticação
  {
    id: 'print_01_landing_hero',
    url: `${BASE_URL}/`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_02_landing_modalities',
    url: `${BASE_URL}/?scroll=modalidades`,
    viewport: { width: 1920, height: 1080 },
    delay: 1000
  },
  {
    id: 'print_03_landing_faq_footer',
    url: `${BASE_URL}/?scroll=faq`,
    viewport: { width: 1920, height: 1080 },
    delay: 1000
  },
  {
    id: 'print_04_auth_modal',
    url: `${BASE_URL}/?modal=auth`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },

  // Seção 2: Perfil Administrador / Gestor Geral
  {
    id: 'print_05_admin_dashboard_dark',
    url: `${BASE_URL}/?role=admin&view=dashboard&modality=all&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_06_admin_dashboard_light',
    url: `${BASE_URL}/?role=admin&view=dashboard&modality=all&theme=light`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_07_admin_cockpit_bjj',
    url: `${BASE_URL}/?role=admin&view=dashboard&modality=bjj&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_08_admin_cockpit_muay_thai',
    url: `${BASE_URL}/?role=admin&view=dashboard&modality=muay_thai&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_09_admin_cockpit_karate',
    url: `${BASE_URL}/?role=admin&view=dashboard&modality=karate&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_10_admin_cockpit_judo',
    url: `${BASE_URL}/?role=admin&view=dashboard&modality=judo&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_11_admin_cockpit_capoeira',
    url: `${BASE_URL}/?role=admin&view=dashboard&modality=capoeira&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_12_admin_cockpit_boxing',
    url: `${BASE_URL}/?role=admin&view=dashboard&modality=boxing&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_13_admin_students',
    url: `${BASE_URL}/?role=admin&view=students&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_14_admin_schedules',
    url: `${BASE_URL}/?role=admin&view=schedules&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_15_admin_finance',
    url: `${BASE_URL}/?role=admin&view=finance&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_16_admin_modalities',
    url: `${BASE_URL}/?role=admin&view=modalities&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },

  // Seção 3: Perfil Mestre / Instrutor
  {
    id: 'print_17_instructor_attendance',
    url: `${BASE_URL}/?role=instructor&view=attendance&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_18_instructor_evaluations',
    url: `${BASE_URL}/?role=instructor&view=evaluations&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_19_instructor_eligible',
    url: `${BASE_URL}/?role=instructor&view=eligible&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },

  // Seção 4: Perfil Aluno / Atleta
  {
    id: 'print_20_student_progress',
    url: `${BASE_URL}/?role=student&view=progress&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_21_student_schedules',
    url: `${BASE_URL}/?role=student&view=schedules&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },
  {
    id: 'print_22_student_invoices',
    url: `${BASE_URL}/?role=student&view=invoices&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },

  // Seção 5: Perfil Visitante / Aluno Experimental
  {
    id: 'print_23_visitor_trial',
    url: `${BASE_URL}/?role=visitor&view=trial&theme=dark`,
    viewport: { width: 1920, height: 1080 },
    delay: 800
  },

  // Seção 6: Mobile
  {
    id: 'print_24_mobile_cockpit',
    url: `${BASE_URL}/?role=admin&view=dashboard&modality=muay_thai&theme=dark`,
    viewport: { width: 412, height: 915, isMobile: true, hasTouch: true },
    delay: 800
  },
  {
    id: 'print_24_mobile_landing',
    url: `${BASE_URL}/`,
    viewport: { width: 412, height: 915, isMobile: true, hasTouch: true },
    delay: 800
  }
];

async function capture() {
  console.log('Iniciando captura de telas com Puppeteer e Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--hide-scrollbars']
  });

  const page = await browser.newPage();

  for (let i = 0; i < SCREENS.length; i++) {
    const s = SCREENS[i];
    console.log(`[${i + 1}/${SCREENS.length}] Capturando: ${s.id}...`);
    await page.setViewport(s.viewport);
    await page.goto(s.url, { waitUntil: 'networkidle0' });
    if (s.delay) {
      await new Promise(r => setTimeout(r, s.delay));
    }
    const outPath = path.join(OUTPUT_DIR, `${s.id}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
  }

  await browser.close();
  console.log('Todas as telas foram capturadas com sucesso em:', OUTPUT_DIR);
}

capture().catch(err => {
  console.error('Erro na captura:', err);
  process.exit(1);
});
