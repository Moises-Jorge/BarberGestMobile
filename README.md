<h1 align="center">BarberGestMobile</h1>

<p align="center">
  Aplicativo mobile da plataforma <strong>BarberGest</strong>, um sistema de gestão para barbearias.<br>
  Conheça os barbeiros, veja os serviços e agende seu horário direto pelo celular.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
</p>

<p align="center">
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#como-rodar">Como rodar</a> •
  <a href="#estrutura-do-projeto">Estrutura</a> •
  <a href="#integração-com-o-backend">Backend</a> •
  <a href="#equipe">Equipe</a> •
  <a href="#roadmap">Roadmap</a>
</p>

<hr>

<h2 id="sobre">📖 Sobre</h2>

<p>
  O <strong>BarberGestMobile</strong> é a frente mobile do BarberGest. Foi desenvolvido em equipe na
  <a href="https://www.42.fr/">42 School</a>, com o mobile em React Native + Expo e um backend próprio
  para a gestão das barbearias.
</p>

<h2 id="funcionalidades">✨ Funcionalidades</h2>

<ul>
  <li>Login e cadastro de usuários</li>
  <li>Home com carrossel de barbeiros (foto, nome e horário)</li>
  <li>Seção de serviços</li>
  <li>Tela de detalhes do corte selecionado</li>
  <li>Fluxo de agendamento: corte, barbeiro e horário</li>
  <li>Loader e estados de carregamento nas listas</li>
</ul>

<blockquote>Ajuste esta lista conforme o que já está implementado.</blockquote>

<h2 id="tecnologias">🛠️ Tecnologias</h2>

<ul>
  <li><a href="https://reactnative.dev/">React Native</a></li>
  <li><a href="https://expo.dev/">Expo</a></li>
  <li>TypeScript</li>
  <li>AsyncStorage, para guardar os dados do agendamento entre telas</li>
  <li>Camada de API mockada (<code>types.ts</code>, <code>mockData.ts</code>, <code>api.ts</code>) enquanto o backend não está integrado</li>
</ul>

<h2 id="pré-requisitos">📋 Pré-requisitos</h2>

<ul>
  <li><a href="https://nodejs.org/">Node.js</a> 18 ou superior</li>
  <li>npm ou yarn</li>
  <li>App <strong>Expo Go</strong> no celular, ou um emulador Android/iOS</li>
</ul>

<h2 id="como-rodar">🚀 Como rodar</h2>

<pre><code># clonar o repositório
git clone &lt;url-do-repositorio&gt;
cd BarberGestMobile

# instalar as dependências
npm install

# iniciar o projeto
npx expo start
</code></pre>

<p>
  Depois, escaneie o QR Code com o Expo Go ou pressione <kbd>a</kbd> (Android) / <kbd>i</kbd> (iOS)
  para abrir no emulador.
</p>

<h2 id="estrutura-do-projeto">📁 Estrutura do projeto</h2>

<pre><code>BarberGestMobile/
├── app/ ou src/        # telas e navegação
├── components/         # componentes reutilizáveis (ex.: BlurCarousel)
├── services/           # camada de API (api.ts)
├── mocks/              # dados mockados (mockData.ts)
├── types/              # tipos TypeScript (types.ts)
└── assets/             # imagens e fontes
</code></pre>

<blockquote>Ajuste os nomes das pastas para refletir a estrutura real.</blockquote>

<h2 id="integração-com-o-backend">🔌 Integração com o backend</h2>

<p>
  Por enquanto o app consome uma API mockada, seguindo o contrato de API do BarberGest.
  Quando o backend estiver pronto, basta trocar a implementação em <code>api.ts</code> para apontar para a API real.
</p>

<p>O backend roda localmente na pasta <code>bgBackEnd</code>:</p>

<pre><code>cd bgBackEnd
npm run dev
</code></pre>

<p>Configure a URL da API em um arquivo <code>.env</code>:</p>

<pre><code>EXPO_PUBLIC_API_URL=http://&lt;seu-ip-local&gt;:&lt;porta&gt;
</code></pre>

<blockquote>No celular físico, use o IP da sua máquina na rede local, não <code>localhost</code>.</blockquote>

<h2 id="equipe">👥 Equipe</h2>

<table>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Função</th>
    </tr>
  </thead>
  <tbody>
    <tr>
     <td><em>Lubanzadio Kingui</em></td>
      <td>Desenvolvimento mobile</td>
    </tr>
    <tr>
      <td><em>Jormaedes Luis</em></td>
      <td>Desenvolvimento Web</td>
    </tr>
    <tr>
      <td><em>Cesênio Filipe</em></td>
      <td>Backend</td>
    </tr>
    <tr>
      <td><em>Moises Jorge</em></td>
      <td>Backend</td>
    </tr>
    <tr>
      <td><em>Margareth Fontes</em></td>
      <td>UI</td>
    </tr>
  </tbody>
</table>

<h2 id="roadmap">🗺️ Roadmap</h2>

<ul>
  <li>✅ Telas de login e cadastro</li>
  <li>✅ Camada de API mockada</li>
  <li>✅ Integração com o backend real</li>
  <li>⬜ Fluxo completo de agendamento</li>
  <li>⬜ Tela de perfil do cliente</li>
  <li>⬜ Notificações de agendamento</li>
</ul>

