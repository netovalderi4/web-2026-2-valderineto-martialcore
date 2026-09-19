import os
import sys
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"C:\Users\valde\Desktop\Valderi\UFERSA\2026.2\Programação WEB\Projeto_MartialCore"
PRINTS_DIR = os.path.join(BASE_DIR, "frontend", "public", "prints_entrega")
ACTIVITIES_DIR = os.path.join(BASE_DIR, "atividades")
os.makedirs(ACTIVITIES_DIR, exist_ok=True)

PDF_OUTPUT = os.path.join(ACTIVITIES_DIR, "MartialCore_Avaliacao05_CSS.pdf")

# Dimensão padrão de página paisagem Full HD (1920 x 1080)
PAGE_W = 1920
PAGE_H = 1080

def get_font(size, bold=False):
    # Tenta usar Arial ou Segoe UI do Windows
    fonts_to_try = [
        "C:\\Windows\\Fonts\\segoeuib.ttf" if bold else "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\calibrib.ttf" if bold else "C:\\Windows\\Fonts\\calibri.ttf"
    ]
    for fp in fonts_to_try:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                pass
    return ImageFont.load_default()

def create_section_divider(section_num, title, description, prints_list):
    """
    Cria uma página divisória limpa, moderna e minimalista em formato paisagem.
    """
    img = Image.new("RGB", (PAGE_W, PAGE_H), (10, 10, 12)) # Zinc-950 escuro elegante
    draw = ImageDraw.Draw(img)
    
    font_badge = get_font(20, bold=True)
    font_title = get_font(46, bold=True)
    font_desc = get_font(24, bold=False)
    font_list_title = get_font(22, bold=True)
    font_items = get_font(22, bold=False)
    font_footer = get_font(18, bold=False)
    
    # Linha de acento sutil no topo
    draw.rectangle([(0, 0), (PAGE_W, 6)], fill=(244, 244, 245))
    
    # Caixa de identificação da seção
    badge_text = f"SEÇÃO {section_num:02d}"
    draw.rectangle([(140, 140), (280, 180)], fill=(24, 24, 27), outline=(63, 63, 70), width=1)
    draw.text((155, 148), badge_text, font=font_badge, fill=(228, 228, 231))
    
    # Título da Seção
    draw.text((140, 210), title, font=font_title, fill=(255, 255, 255))
    
    # Descrição / Contexto
    draw.text((140, 280), description, font=font_desc, fill=(161, 161, 170))
    
    # Linha divisória fina
    draw.line([(140, 340), (PAGE_W - 140, 340)], fill=(39, 39, 42), width=1)
    
    # Título da lista de prints
    draw.text((140, 380), "PRINTS APRESENTADAS NESTA SEÇÃO:", font=font_list_title, fill=(212, 212, 216))
    
    # Lista de telas em duas colunas se houver muitos itens
    start_y = 430
    line_h = 42
    
    if len(prints_list) <= 6:
        for idx, item in enumerate(prints_list):
            # Marcador octogonal ou bala
            bullet_y = start_y + (idx * line_h)
            draw.text((140, bullet_y), f"• {item}", font=font_items, fill=(244, 244, 245))
    else:
        # Duas colunas
        half = (len(prints_list) + 1) // 2
        for idx, item in enumerate(prints_list):
            col = 0 if idx < half else 1
            row = idx if idx < half else idx - half
            x_pos = 140 if col == 0 else 1000
            y_pos = start_y + (row * line_h)
            draw.text((x_pos, y_pos), f"• {item}", font=font_items, fill=(244, 244, 245))
            
    # Rodapé institucional
    footer_text = "MartialCore — Sistema Web Modular para Centros de Treinamento e Artes Marciais | UFERSA PAM0462"
    draw.text((140, PAGE_H - 90), footer_text, font=font_footer, fill=(113, 113, 122))
    
    return img

def create_mobile_composite(landing_path, cockpit_path):
    """
    Combina as duas capturas mobile (Landing + Cockpit) lado a lado em um canvas 1920x1080.
    """
    img = Image.new("RGB", (PAGE_W, PAGE_H), (10, 10, 12))
    draw = ImageDraw.Draw(img)
    
    font_title = get_font(32, bold=True)
    font_sub = get_font(20, bold=False)
    
    draw.text((140, 60), "Responsividade Mobile & Bottom Navigation Bar", font=font_title, fill=(255, 255, 255))
    draw.text((140, 110), "Demonstração da adaptação fluida em smartphones (Landing Page e Cockpit Operacional com barra fixa inferior)", font=font_sub, fill=(161, 161, 170))
    
    # Carregar imagens mobile
    m_land = Image.open(landing_path).convert("RGB")
    m_cock = Image.open(cockpit_path).convert("RGB")
    
    # Altura desejada: 820px
    target_h = 820
    scale_land = target_h / m_land.height
    scale_cock = target_h / m_cock.height
    
    m_land_scaled = m_land.resize((int(m_land.width * scale_land), target_h), Image.Resampling.LANCZOS)
    m_cock_scaled = m_cock.resize((int(m_cock.width * scale_cock), target_h), Image.Resampling.LANCZOS)
    
    # Centralizar horizontalmente
    total_w = m_land_scaled.width + m_cock_scaled.width + 100
    start_x = (PAGE_W - total_w) // 2
    pos_y = 170
    
    # Adicionar moldura sutil em volta dos aparelhos
    for offset_x, sub_img, label in [
        (start_x, m_land_scaled, "Visão Mobile — Landing Page"),
        (start_x + m_land_scaled.width + 100, m_cock_scaled, "Visão Mobile — Cockpit & BottomNav")
    ]:
        # Borda de moldura
        draw.rectangle([
            (offset_x - 4, pos_y - 4),
            (offset_x + sub_img.width + 4, pos_y + sub_img.height + 4)
        ], outline=(63, 63, 70), width=2)
        img.paste(sub_img, (offset_x, pos_y))
        
        # Legenda abaixo do aparelho
        draw.text((offset_x + 20, pos_y + sub_img.height + 15), label, font=get_font(18, bold=True), fill=(212, 212, 216))
        
    return img

def fit_print_to_page(print_path):
    """
    Ajusta a captura 1920x1080 diretamente à página, sem margens ou distorções.
    """
    im = Image.open(print_path).convert("RGB")
    if im.size != (PAGE_W, PAGE_H):
        im = im.resize((PAGE_W, PAGE_H), Image.Resampling.LANCZOS)
    return im

def build_pdf():
    print("=== Iniciando Montagem do PDF da Avaliação 05 - CSS ===")
    pages = []
    
    # -------------------------------------------------------------
    # SEÇÃO 1: Landing Page Institucional & Modal de Autenticação
    # -------------------------------------------------------------
    sec1_prints = [
        "Print 01: Landing Page — Topo & Hero Section (Proposta de Valor e CTA)",
        "Print 02: Landing Page — Vitrine Fotográfica Panorâmica das 6 Modalidades",
        "Print 03: Landing Page — FAQ Estruturado & Rodapé Institucional",
        "Print 04: Modal de Autenticação — Seleção Rápida de Perfis (RBAC) & Login"
    ]
    pages.append(create_section_divider(
        1,
        "Landing Page Institucional & Modal de Autenticação",
        "Apresentação da identidade visual pública da marca, vitrine das modalidades e controle de acesso multiperfil.",
        sec1_prints
    ))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_01_landing_hero.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_02_landing_modalities.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_03_landing_faq_footer.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_04_auth_modal.png")))

    # -------------------------------------------------------------
    # SEÇÃO 2: Perfil Administrador / Gestor Geral (Perfil Máximo)
    # -------------------------------------------------------------
    sec2_prints = [
        "Print 05: Dashboard Geral — Modo Escuro (Visão unificada 'Todas' em Preto & Branco)",
        "Print 06: Dashboard Geral — Modo Claro (Alternância de Tema Claro / CSS)",
        "Print 07: Cockpit BJJ — Brazilian Jiu-Jitsu (Aura Azul #2563eb, Banner 4:1 e KPIs)",
        "Print 08: Cockpit Muay Thai — Muay Thai (Aura Vermelha #ef4444, Banner 4:1 e KPIs)",
        "Print 09: Cockpit Karatê — Karatê (Aura Dourada #f59e0b, Banner 4:1 e KPIs)",
        "Print 10: Cockpit Judô — Judô (Aura Esmeralda #10b981, Banner 4:1 e KPIs)",
        "Print 11: Cockpit Capoeira — Capoeira (Aura Laranja #f97316, Banner 4:1 e KPIs)",
        "Print 12: Cockpit Boxe — Boxe (Aura Violeta #8b5cf6, Banner 4:1 e KPIs)",
        "Print 13: Módulo de Atletas & Matrículas (Tabela com filtros de faixas e status)",
        "Print 14: Módulo de Grade de Horários & Ocupação de Tatames (Cronograma semanal)",
        "Print 15: Módulo Financeiro & Fluxo de Caixa (Inadimplência, faturamento e carnês)",
        "Print 16: Configurações Técnicas das Modalidades (Regras de graduação e carência)"
    ]
    pages.append(create_section_divider(
        2,
        "Perfil Administrador / Gestor Geral",
        "Visão administrativa completa, demonstrando dashboards em Dark/Light mode, as 6 modalidades com cores dinâmicas e módulos operacionais.",
        sec2_prints
    ))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_05_admin_dashboard_dark.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_06_admin_dashboard_light.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_07_admin_cockpit_bjj.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_08_admin_cockpit_muay_thai.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_09_admin_cockpit_karate.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_10_admin_cockpit_judo.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_11_admin_cockpit_capoeira.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_12_admin_cockpit_boxing.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_13_admin_students.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_14_admin_schedules.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_15_admin_finance.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_16_admin_modalities.png")))

    # -------------------------------------------------------------
    # SEÇÃO 3: Perfil Mestre / Instrutor
    # -------------------------------------------------------------
    sec3_prints = [
        "Print 17: Diário de Presença & Chamada Digital de Aulas no Tatame",
        "Print 18: Avaliação Técnica de Atletas (Critérios de Kata, Sparring e Fundamentos)",
        "Print 19: Gestão de Alunos Aptos para Graduação / Troca de Faixa"
    ]
    pages.append(create_section_divider(
        3,
        "Perfil Mestre / Instrutor",
        "Interface de alta usabilidade para mestres e professores: chamada rápida em tatame e avaliação técnica de critérios marciais.",
        sec3_prints
    ))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_17_instructor_attendance.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_18_instructor_evaluations.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_19_instructor_eligible.png")))

    # -------------------------------------------------------------
    # SEÇÃO 4: Perfil Aluno / Atleta
    # -------------------------------------------------------------
    sec4_prints = [
        "Print 20: Portal do Aluno — Meu Progresso Marcial (Barras de carência e presenças)",
        "Print 21: Portal do Aluno — Minha Grade de Treinos e Horários",
        "Print 22: Portal do Aluno — Minhas Mensalidades e Faturas"
    ]
    pages.append(create_section_divider(
        4,
        "Perfil Aluno / Atleta",
        "Experiência do praticante de artes marciais: termômetro de graduação, tempo na faixa atual, treinos matriculados e pagamentos.",
        sec4_prints
    ))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_20_student_progress.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_21_student_schedules.png")))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_22_student_invoices.png")))

    # -------------------------------------------------------------
    # SEÇÃO 5: Perfil Visitante / Aluno Experimental
    # -------------------------------------------------------------
    sec5_prints = [
        "Print 23: Agendamento de Aula Experimental Gratuita nas 6 Modalidades"
    ]
    pages.append(create_section_divider(
        5,
        "Perfil Visitante / Aluno Experimental",
        "Porta de captação de novos praticantes com agendamento simplificado de aulas experimentais e escolha de arte marcial.",
        sec5_prints
    ))
    pages.append(fit_print_to_page(os.path.join(PRINTS_DIR, "print_23_visitor_trial.png")))

    # -------------------------------------------------------------
    # SEÇÃO 6: Responsividade Mobile
    # -------------------------------------------------------------
    sec6_prints = [
        "Print 24: Interface Mobile Adaptativa com Bottom Navigation Bar e Cards Otimizados"
    ]
    pages.append(create_section_divider(
        6,
        "Responsividade Mobile",
        "Demonstração da adaptação dos componentes em telas verticais de smartphones com barra de navegação inferior permanente.",
        sec6_prints
    ))
    mobile_composite = create_mobile_composite(
        os.path.join(PRINTS_DIR, "print_24_mobile_landing.png"),
        os.path.join(PRINTS_DIR, "print_24_mobile_cockpit.png")
    )
    pages.append(mobile_composite)

    # -------------------------------------------------------------
    # SALVAR PDF FINAL OTIMIZADO
    # -------------------------------------------------------------
    print(f"Total de páginas a serem geradas: {len(pages)}")
    first_page = pages[0]
    other_pages = pages[1:]
    
    first_page.save(
        PDF_OUTPUT,
        save_all=True,
        append_images=other_pages,
        quality=85,
        optimize=True
    )
    
    file_size_mb = os.path.getsize(PDF_OUTPUT) / (1024 * 1024)
    print(f"=== PDF Gerado com Sucesso! ===")
    print(f"Local: {PDF_OUTPUT}")
    print(f"Total de Páginas: {len(pages)}")
    print(f"Tamanho do Arquivo: {file_size_mb:.2f} MB (Limite permitido: 10.00 MB)")

if __name__ == "__main__":
    build_pdf()

