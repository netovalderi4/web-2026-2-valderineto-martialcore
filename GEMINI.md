# DIRETRIZES MANDATÓRIAS DE DESENVOLVIMENTO — MARTIALCORE (UFERSA)

Este arquivo define as instruções permanentes e obrigatórias para qualquer agente de IA ou desenvolvedor trabalhando no projeto **MartialCore**. Todas as regras abaixo devem ser consultadas e estritamente seguidas a cada nova modificação, planejamento ou implementação.

---

## 1. 📖 Consulta Obrigatória às Documentações do Projeto
Antes de iniciar qualquer planejamento, refatoração de código ou implementação de novas funcionalidades:
1. **Especificação Oficial da Disciplina:**
   - Consultar o documento original do professor:
     `../Documentação/Projeto_Final_-_MartialCore_-_Documento_de_Especificao (1).pdf`
   - Respeitar os requisitos acadêmicos da disciplina PAM0462 (Programação Web - UFERSA).
2. **Documentação Viva do Sistema:**
   - Consultar o histórico completo de arquitetura e decisões técnicas:
     `../Documentação/DOCUMENTACAO_SISTEMA_MARTIALCORE.md`
   - Nunca reescrever ou contradizer padrões e regras de negócio já consolidados no sistema.

---

## 2. 📝 Atualização Contínua da Documentação
Sempre que concluir o desenvolvimento de uma nova funcionalidade, ajuste arquitetural ou nova tela:
- **É OBRIGATÓRIO** atualizar o arquivo `../Documentação/DOCUMENTACAO_SISTEMA_MARTIALCORE.md`.
- Registrar a data da alteração, o escopo da feature, os arquivos/componentes criados ou modificados e o impacto na solução.
- Manter o documento sempre atualizado para que sirva de referência imediata para avaliações e bancas acadêmicas.

---

## 3. 🛡️ Segurança em Primeiro Lugar (Security First)
Em todas as alterações de código e infraestrutura:
1. **Zero Segredos e Credenciais no Repositório:**
   - Nunca incluir chaves de API, credenciais AWS (Access Keys, Secret Keys), senhas de banco de dados ou tokens JWT diretamente no código ou em commits do Git.
   - Utilizar variáveis de ambiente (`.env`) e manter o `.gitignore` devidamente configurado.
2. **Controle de Acesso RBAC Rígido:**
   - Validar rigorosamente as permissões dos 4 perfis de usuário do sistema:
     - `admin` (Gestor do CT / Administrador com acesso total)
     - `instructor` (Mestre / Corpo Técnico com acesso a chamadas e avaliações)
     - `student` (Atleta / Aluno com acesso a seu progresso e faturas)
     - `visitor` (Visitante com acesso apenas a agendamento de aula experimental)
3. **Sanitização de Entradas e Prevenção de Falhas:**
   - Sanitizar e validar todos os inputs de formulários no front-end e back-end para prevenir XSS (Cross-Site Scripting) e SQL Injection.
4. **Dependências Seguras:**
   - Utilizar apenas pacotes conhecidos e verificar vulnerabilidades (`npm audit`).

---

## 4. 🎨 Padrão de Identidade Visual e Design System
1. **Padrão Monocromático Base:**
   - A identidade da marca MartialCore na Landing Page e na visão unificada ("Todas") é estritamente **Preto e Branco**.
   - Garantir suporte total a **Modo Escuro (Dark Mode)** e **Modo Claro (Light Mode)** via Tailwind CSS v4, preservando contraste e legibilidade.
2. **Cores Dinâmicas por Modalidade:**
   - As cores vivas entram em ação **apenas** quando uma das 6 modalidades marciais for selecionada:
     - **Brazilian Jiu-Jitsu (BJJ):** Azul Royal (`#2563eb`)
     - **Muay Thai:** Vermelho Combate (`#ef4444`)
     - **Karatê:** Âmbar Dourado (`#f59e0b`)
     - **Judô:** Verde Esmeralda (`#10b981`)
     - **Capoeira:** Laranja Solar (`#f97316`)
     - **Boxe:** Violeta Ringue (`#8b5cf6`)
   - Ao selecionar a arte, apenas a aura de fundo (`AmbientAura`), o banner hero, o núcleo interno da logo oficial (`MartialCoreLogo`) e os botões de ação adotam a respectiva cor.
3. **Banners Panorâmicos 4:1:**
   - Fotos esportivas reais com a ação posicionada à direita, cabeça e membros 100% íntegros (sem cortes na borda superior) e transição suave em gradiente para o fundo escuro à esquerda.

---

## 5. 🧪 Validação Técnica Pré-Entrega
Antes de concluir qualquer tarefa ou propor um commit:
- Executar a compilação de produção (`cmd /c "npm run build"` dentro de `frontend/`) para certificar **zero erros de TypeScript e zero falhas de bundling**.
- Assegurar que nenhuma alteração quebre o deploy contínuo no **AWS Amplify** (`https://valderi.mestre.web.ufersa.dev.br/`).

