# [WIP] NiiVue Apps

A monorepo for NiiVue applications (desktop, web, mobile). 

## Packages

- [niivuejs](packages/niivuejs/README.md)
- [desktop](packages/desktop/README.md)
- [widgets](packages/widgets/README.md)
- [niivue](packages/niivue/README.md)

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) (at least the latest LTS version)

### Setup

```bash
git clone git@github.com:niivue/niivue-apps.git
cd niivue-apps
npm install
```

### Dev workflow

```bash
# start all packages in dev mode (enables hot reloading of the render process only)
# changes to the main process require a restart of the app (ctrl+c)
npm run dev
```

