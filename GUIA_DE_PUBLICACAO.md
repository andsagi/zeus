# Guia de Publicação - Zeus Elite

Este documento orienta o passo a passo para colocar a sua aplicação Zeus Elite no ar gratuitamente, utilizando as melhores ferramentas do mercado (Vercel, Supabase, Firebase e Stripe).

## 1. Repositório (Opcional, porém recomendado)
Antes de tudo, garanta que seu código está em um repositório no GitHub. 
Se você usou o botão de exportar o app ("Export to GitHub") na direita da sua tela, isso já foi feito automaticamente. Você também pode exportar em ".ZIP" (em "Settings -> Export") e subir manualmente.

## 2. Configurar Autenticação (Firebase)
Seu aplicativo conta com "Login Integrado do Google".
1. Entre no [Firebase Console](https://console.firebase.google.com/).
2. Abra o seu projeto.
3. Acesse **Authentication -> Sign-in method** e garanta que o provedor **Google** está ativo.
4. Quando seu app for finalmente hospedado (na etapa 4), você precisará acessar **Authentication -> Settings -> Authorized Domains** e acrescentar a URL gerada (por exemplo: `zeus-elite.vercel.app`), senão o Google bloqueará o login em produção.

## 3. Configurar Banco de Dados (Supabase)
Todo o armazenamento do app usa o Supabase.
1. Crie uma conta ou acesse o [Supabase](https://supabase.com).
2. Selecione **New Project**.
3. No painel, vá em **SQL Editor** no menu esquerdo superior, clique em "New Query" e cole **EXATAMENTE** o conteúdo do arquivo local `supabase_schema.sql`. Isso criará todas as tabelas (users, notes, messages, etc).
4. Em seguida, acesse as configurações do Projeto: **Project Settings -> API**. Copie a `URL` do banco e a `anon public key`.

## 4. Configurar Pagamentos e Assinaturas (Stripe)
O App usa o Stripe Checkout. Para processar os pagamentos:
1. Cadastre-se ou acesse o painel da [Stripe](https://stripe.com/).
2. (Com o "Modo de Teste" ativo no canto superior da tela) Acesse **Product Catalog** e crie um Produto (ex: "Zeus Elite") com um modelo de pagamento "Recorrente".
3. A Stripe irá gerar no preço um ID chamado "Price ID" (iniciado com `price_...`). Se o ID for diferente, lembre-se de trocá-lo no arquivo raiz do projeto `src/components/SettingsView.tsx`.
4. Procure no painel da Stripe por **Developers > API Keys**. Você terá uma `Publishable key` (chave pública) e uma `Secret key` (chave secreta).

## 5. Hospedar o App gratuitamente na Vercel
1. Acesse o [Vercel](https://vercel.com/) e crie uma conta.
2. Selecione **Add New Project** e escolha o repositório do seu GitHub onde o código do projeto foi enviado. O Vercel detectará automaticamente as configurações "Vite".
3. **MUITO IMPORTANTE:** Antes de clicar no grande botão "Deploy", localize e abra a seção **Environment Variables**. É lá que seu App em produção lerá os "Secrets" das etapas anteriores.
4. Adicione as seguintes chaves e seus valores (copiados das etapas de cima e da do AI Studio):

* `GEMINI_API_KEY`: Chave do Gemini (criada no painel do Google AI Studio - *importante não revelar a ninguém*).
* `VITE_SUPABASE_URL`: (Supabase Project Settings > API > URL)
* `VITE_SUPABASE_ANON_KEY`: (Supabase Project Settings > API > anon public key)
* `STRIPE_SECRET_KEY`: (Stripe Developers > API > Secret Key)

5. Feito isso, clique em **Deploy**.

## Parabéns!
A Vercel construirá seu Web App e gerará um link definitivo (ex: `seu-projeto.vercel.app`). 
Não esqueça de adicionar este link aos domínios autorizados do Firebase (Passo 2) para que o login do Google funcione adequadamente!
