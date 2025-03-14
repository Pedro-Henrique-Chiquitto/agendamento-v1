# Sistema de Agendamento de Equipamentos Escolares 📚

Sistema web desenvolvido para gerenciar o agendamento de equipamentos escolares como tablets e notebooks, com integração ao Google Calendar e autenticação via Google.

## 🌟 Funcionalidades

- Gerenciamento de unidades escolares isoladas
- Agendamento de equipamentos (tablets, notebooks, etc.)
- Visualização por calendário interativo
- Integração com Google Calendar
- Interface responsiva e intuitiva

## 🛠️ Tecnologias Utilizadas

- **Frontend**:
  - React 18
  - TypeScript
  - Tailwind CSS
  - React Big Calendar
  - Shadcn/ui

- **Backend**:
  - Express
  - Passport.js (Google OAuth)
  - Drizzle ORM
  - PostgreSQL

## 🚀 Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/Pedro-Henrique-Chiquitto/Agenda-Online-v1.git
cd Agenda-Online-v1
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com:
```env
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
DATABASE_URL=sua_url_do_banco
SESSION_SECRET=seu_session_secret
```

4. Execute o projeto:
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5000`

## 📦 Estrutura do Projeto

```
.
├── client/            # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── hooks/      # Custom hooks
│   │   ├── lib/        # Utilitários
│   │   └── pages/      # Páginas da aplicação
├── server/            # Backend Express
│   ├── auth.ts        # Configuração de autenticação
│   ├── routes.ts      # Rotas da API
│   └── storage.ts     # Camada de dados
└── shared/            # Código compartilhado
    └── schema.ts      # Schemas e tipos
```

## 🔐 Segurança

- Autenticação via Google OAuth 2.0
- Sessões seguras com express-session
- Isolamento por unidade escolar
- Validação de dados com Zod

## 📝 Licença

MIT

## 👥 Autores

- Pedro Henrique Chiquitto
