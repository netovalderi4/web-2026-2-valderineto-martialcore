import os
import sys
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
import numpy as np

# Configuração de cada modalidade:
# - source_path: Imagem-fonte de alta resolução com atletas 100% íntegros
# - output_name: Nome do arquivo final 4:1
# - accent_color: Tupla RGB da cor temática
# - scale_fit: Altura desejada dos atletas dentro do canvas de 400px (ex: 370-390 para deixar margem de cabeça/pé)
# - top_padding: Deslocamento vertical do topo (para centralizar verticalmente ou garantir que a cabeça não encoste no topo)
# - right_offset: Deslocamento horizontal em relação à borda direita
MODALITIES = [
    {
        "id": "bjj",
        "name": "Brazilian Jiu-Jitsu",
        "source": r"C:\Users\valde\.gemini\antigravity\brain\043359a3-c476-40ae-b5ea-f8b129800c32\bjj_realistic_right_1789822577392.jpg",
        "output": "bjj_hero_4x1.jpg",
        "accent_rgb": (37, 99, 235), # #2563eb Blue
        "scale_h": 400,
        "top_offset": 0,
        "blend_width": 350,
        "color_intensity": 0.22,
    },
    {
        "id": "muay_thai",
        "name": "Muay Thai",
        "source": r"C:\Users\valde\.gemini\antigravity\brain\043359a3-c476-40ae-b5ea-f8b129800c32\muaythai_realistic_right_1789822796194.jpg",
        "output": "muay_thai_hero_4x1.jpg",
        "accent_rgb": (239, 68, 68), # #ef4444 Crimson Red
        "scale_h": 390, # Atleta em pé com chute: 390px garante cabeça e pés inteiros com folga
        "top_offset": 5, # 5px de margem no topo para a cabeça do lutador
        "blend_width": 380,
        "color_intensity": 0.25, # Realce vermelho nas luvas/cordas
    },
    {
        "id": "karate",
        "name": "Karatê",
        "source": r"C:\Users\valde\.gemini\antigravity\brain\043359a3-c476-40ae-b5ea-f8b129800c32\karate_realistic_right_1789822972746.jpg",
        "output": "karate_hero_4x1.jpg",
        "accent_rgb": (245, 158, 11), # #f59e0b Amber / Dourado
        "scale_h": 385,
        "top_offset": 10, # Folga superior para o coque e cabeça da karateka
        "blend_width": 360,
        "color_intensity": 0.20,
    },
    {
        "id": "judo",
        "name": "Judô",
        "source": r"C:\Users\valde\.gemini\antigravity\brain\043359a3-c476-40ae-b5ea-f8b129800c32\judo_realistic_right_1789823323344.jpg",
        "output": "judo_hero_4x1.jpg",
        "accent_rgb": (16, 185, 129), # #10b981 Esmeralda
        "scale_h": 385,
        "top_offset": 10, # Folga superior para as cabeças dos judocas
        "blend_width": 400,
        "color_intensity": 0.25, # Iluminação sutil verde-esmeralda no tatame
    },
    {
        "id": "capoeira",
        "name": "Capoeira",
        "source": r"C:\Users\valde\.gemini\antigravity\brain\043359a3-c476-40ae-b5ea-f8b129800c32\capoeira_realistic_right_1789823439260.jpg",
        "output": "capoeira_hero_4x1.jpg",
        "accent_rgb": (249, 115, 22), # #f97316 Laranja Vibrante
        "scale_h": 380,
        "top_offset": 15, # Folga para o pé erguido do golpe (meia-lua)
        "blend_width": 380,
        "color_intensity": 0.22,
    },
    {
        "id": "boxing",
        "name": "Boxe",
        "source": r"C:\Users\valde\.gemini\antigravity\brain\043359a3-c476-40ae-b5ea-f8b129800c32\boxing_hero_banner_1789818571607.jpg",
        "output": "boxing_hero_4x1.jpg",
        "accent_rgb": (139, 92, 246), # #8b5cf6 Roxo / Violeta
        "scale_h": 390,
        "top_offset": 5, # Folga para refletores e cabeças dos boxeadores
        "blend_width": 380,
        "color_intensity": 0.24,
    }
]

def apply_subtle_color_grade(img, accent_rgb, intensity=0.20):
    """
    Aplica um efeito leve e atmosférico na cor temática da arte:
    - Cria um mapa de luz nas altas/médias luzes e nas bordas
    - Mantém tons de pele e detalhes fotográficos naturais
    """
    r_acc, g_acc, b_acc = accent_rgb
    w, h = img.size
    
    # Criar camada colorida
    color_layer = Image.new("RGB", (w, h), accent_rgb)
    
    # Criar máscara gradiente que afeta principalmente os contornos e atmosfera (luz da direita e topo)
    mask = Image.new("L", (w, h), 0)
    draw = ImageDraw.Draw(mask)
    
    # Gradiente radial / lateral suave
    for x in range(w):
        # Aumenta suavemente da esquerda para a direita (onde está a ação)
        ratio_x = x / w
        alpha = int(255 * intensity * (0.4 + 0.6 * ratio_x))
        draw.line([(x, 0), (x, h)], fill=alpha)
        
    # Misturar suavemente
    blended = Image.blend(img, color_layer, intensity * 0.5)
    
    # Combina usando a máscara
    final = Image.composite(blended, img, mask)
    
    # Ligeiro realce de contraste fotográfico
    enhancer = ImageEnhance.Contrast(final)
    final = enhancer.enhance(1.05)
    return final

def composite_modality_panoramic(config, output_dir):
    source_path = config["source"]
    if not os.path.exists(source_path):
        print(f"[ERRO] Fonte não encontrada: {source_path}")
        return False
        
    src = Image.open(source_path).convert("RGB")
    src_w, src_h = src.size
    
    target_w, target_h = 1600, 400
    scale_h = config["scale_h"]
    top_offset = config["top_offset"]
    blend_w = config["blend_width"]
    
    # Redimensiona proporcionalmente para que toda a altura dos atletas caiba em scale_h
    scale = scale_h / src_h
    new_w = int(src_w * scale)
    scaled_img = src.resize((new_w, scale_h), Image.Resampling.LANCZOS)
    
    # Aplicar efeito suave e elegante da cor temática da arte
    scaled_img = apply_subtle_color_grade(scaled_img, config["accent_rgb"], config["color_intensity"])
    
    # Cor do fundo escuro (pega a média da borda esquerda da foto ou tom escuro elegante)
    # Pegamos amostra da borda esquerda de scaled_img
    left_strip = scaled_img.crop((0, 0, min(20, new_w), scale_h))
    avg_color = tuple(int(c * 0.7) for c in np.array(left_strip).mean(axis=(0, 1))[:3])
    # Garante que seja um tom escuro neutro/azulado (mínimo de brilho para harmonizar com dark mode)
    base_dark = (
        min(avg_color[0], 24),
        min(avg_color[1], 24),
        min(avg_color[2], 28)
    )
    
    # Criar canvas 1600x400
    canvas = Image.new("RGB", (target_w, target_h), base_dark)
    
    # Posição onde a imagem do atleta vai entrar (à direita)
    paste_x = target_w - new_w
    paste_y = top_offset
    
    # Criar máscara de transição suave à esquerda para que a foto se funda perfeitamente
    # Máscara tem tamanho (new_w, scale_h)
    mask = Image.new("L", (new_w, scale_h), 255)
    draw = ImageDraw.Draw(mask)
    
    # Gradiente na borda esquerda de scaled_img ao longo de blend_w pixels
    for x in range(min(blend_w, new_w)):
        alpha = int(255 * (x / blend_w))
        draw.line([(x, 0), (x, scale_h)], fill=alpha)
        
    # Colar na canvas usando a máscara
    canvas.paste(scaled_img, (paste_x, paste_y), mask)
    
    # Adicionar uma vinheta sutil nos 4 cantos e na base para um look fotográfico premium
    vignette = Image.new("L", (target_w, target_h), 0)
    v_draw = ImageDraw.Draw(vignette)
    for y in range(25): # topo suave
        alpha = int(70 * (1 - y / 25))
        v_draw.line([(0, y), (target_w, y)], fill=alpha)
    for y in range(target_h - 25, target_h): # base suave
        alpha = int(70 * ((y - (target_h - 25)) / 25))
        v_draw.line([(0, y), (target_w, y)], fill=alpha)
        
    dark_overlay = Image.new("RGB", (target_w, target_h), (0, 0, 0))
    canvas = Image.composite(dark_overlay, canvas, vignette)
    
    output_path = os.path.join(output_dir, config["output"])
    os.makedirs(output_dir, exist_ok=True)
    canvas.save(output_path, quality=95)
    print(f"[SUCESSO] Gerado 4:1 para {config['name']}: {output_path} (Tamanho: {target_w}x{target_h})")
    return True

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.abspath(os.path.join(script_dir, "..", "public", "images", "modalities"))
    
    print("=== Processando Composição Panorâmica 4:1 com Enquadramento Total & Efeitos de Cor ===")
    for config in MODALITIES:
        composite_modality_panoramic(config, output_dir)
    print("=== Concluído com Sucesso! ===")

if __name__ == "__main__":
    main()

