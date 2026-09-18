# MartialCore — Frontend Web

Sistema Web Modular para Gestão de Centros de Treinamento Multi-Modalidades de Artes Marciais (**Brazilian Jiu-Jitsu, Muay Thai, Karatê, Judô, Capoeira e Boxe**).

- **Instituição:** UFERSA — Campus Pau dos Ferros
- **Disciplina:** PAM0462 — Programação Web (2026.2)
- **Aluno:** Valderi Alves de Souza Neto
- **Deploy:** AWS Amplify com domínio oficial mascarado (`https://valderi.mestre.web.ufersa.dev.br/`)

---

## 🚀 Tecnologias Utilizadas

- **React 19** + **TypeScript** (`verbatimModuleSyntax`)
- **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide React** (Ícones temáticos)

---

## 🛠️ Como Executar Localmente

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Rodar em ambiente de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Compilar para produção (Vite + TypeScript):**
   ```bash
   npm run build
   ```

---

## 🥋 Estrutura de Telas e Perfis

O sistema possui autenticação integrada e controle de acesso baseado em papéis (RBAC), permitindo vivenciar e demonstrar a experiência de cada perfil:

- 👑 **Gestor / Administrador**:
  - Dashboard executivo com KPIs (faturamento, atletas ativos, ocupação de tatames, inadimplência)
  - Gestão de Atletas e Matrículas (com ficha técnica detalhada)
  - Alocação de Tatames e Horários (Tatame 1, Tatame 2, Ringue e Octógono)
  - Gestão Financeira (planos individuais vs combo multi-artes e conciliação de faturas)
  - Parametrização da Camada de Metadados das 6 artes marciais
- 🥋 **Mestre / Instrutor**:
  - Tatame Digital: Chamada rápida com controle Gi / No-Gi para BJJ
  - Mural de Avaliações Técnicas adaptadas (Kata/Kumite, Gokyo, Sparring, Instrumentos)
  - Convocação de Alunos Aptos para Exame de Graduação
- 🥊 **Atleta / Aluno**:
  - Meu Tatame: Termômetro de graduação visual com faixa e graus, controle de carência, presenças e mensalidades
- 👥 **Visitante / Experimental**:
  - Consulta de grade de turmas abertas e agendamento gratuito de aula experimental
- 🎨 **Motor de Atmosfera Dinâmica por Arte Marcial**:
  - Personalização da aura e dos acentos visuais do sistema conforme a arte marcial selecionada (BJJ, Muay Thai, Karatê, Judô, Capoeira e Boxe).
  - Tema Claro / Escuro com persistência local e design minimalista sem poluição visual.

---

# 📝 ANEXO: Resumo do que foi Desenvolvido e Editado

> **Data:** 14/09/2026  
> **Objetivo:** Implementação completa da interface visual do sistema com suporte às 6 modalidades e 4 perfis RBAC, sem alterar a infraestrutura existente de deploy na AWS.

1. **Tipagem e Mock de Dados (`src/types/martial.ts` e `src/mock/martialData.ts`)**:
   - Modelagem de dados para modalidades, graduações, regras específicas, turmas, mestres, alunos, check-ins e faturamento.
2. **Componentes Especializados (`src/components/martial/`)**:
   - `BeltRenderer.tsx`: Desenho visual preciso de faixas (com graus de BJJ), cordéis e níveis.
   - `WeightCategoryBadge.tsx`: Exibição de pesagem e categorias oficiais de luta.
   - `TechniqueChecklist.tsx`: Checklist interativo para o sistema Gokyo (Judô) e instrumentos (Capoeira).
3. **Módulos de Páginas (`src/pages/`)**:
   - `LandingPage.tsx`: Landing page institucional conectada com CTA para o sistema.
   - `admin/`: Telas de Dashboard, Alunos, Tatames, Financeiro e Metadados.
   - `instructor/`: Telas de Chamada (Tatame Digital), Avaliação Técnica e Exames.
   - `student/`: Portal "Meu Tatame" do atleta.
   - `visitor/`: Agendamento de aula experimental.
4. **Preservação de Deploy e SEO (`index.html`)**:
   - Manutenção das tags de verificação do Google Search Console (`googlea3ed000c3cf65c57`), dados estruturados Schema.org e meta tags de compartilhamento.
