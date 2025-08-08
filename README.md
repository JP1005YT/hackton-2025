# Cuidar+ (Protótipo)

App React Native (Expo) para gestão de cuidado de idosos conectando familiares e cuidadores.

## Funcionalidades
- Autenticação local com CPF/nome e senha (hash com bcryptjs).
- Papel: Familiar (gerencia perfis de idosos) ou Cuidador (formal/informal).
- Familiar: cria/edita perfil do idoso, lembretes de medicação, gera código de vínculo, lista cuidadores vinculados.
- Cuidador: insere código para se vincular, vê dados do idoso em modo leitura.
- Banco SQLite local com o esquema fornecido.

## Rodando
1. Instale dependências:
```
npm install
```
2. Inicie (web para teste rápido ou Expo Go no celular):
```
npm start -- --web --clear
```
3. Também pode abrir no Android:
- Com Android Studio emulador aberto, pressione `a` no terminal do Expo.

## Estrutura
- `src/db`: inicialização do SQLite e helpers.
- `src/services`: regras de negócio (auth, familiares, cuidadores).
- `src/navigation`: navegação com React Navigation.
- `src/screens`: telas (login, cadastro, familiar, cuidador).

## Notas
- Este é um protótipo acadêmico; sem backend.
- Códigos de vínculo são strings (simulando QR).
- Armazenamento de sessão via AsyncStorage.
