# NEM Explorer Frontend

## Requirements

- Node.js >= 14 on local development machine (but it’s not required on the server).

## Installation

1. Install the required dependencies.

```sh
npm install
```

2. Prepare configuration:\
2.1. Create `.env` file on the root of the project.\
2.2. Add environment variables following the configuration example in the `.env.example` file.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in browser.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.

## Project Structure

```sh
src/
├── __tests__/         # test suites
├── assets/            # contains all the static files such as images, fonts, etc.
├── components/        # shared components used across the entire application
├── config/            # all the global configurations get exported from here
├── locales/           # contains localization JSON files
├── pages/             # website pages
├── services/          # API communication services used to fetch data from the server
├── styles/            # global style definitions and helpers
│   ├── abstracts/     # partial that contains variables, mixins and templates
│   ├── base/          # partial that contains boilerplate, reset file and typographic rules 
│   ├── components/    # partial that contains styles for atom and Bootstrap components
│   ├── pages/         # partial that contains the global page styles
│   ├── vendors/       # partial that contains the CSS files from external libraries
│   └── main.scss      # primary Sass file
├── utils/             # shared utilities used across the entire application
│   ├── helper.js      # shared helper functions
│   └── hooks.js       # shared React Hooks
├── i18n.js            # provides multilingual support for the application
├── router.js          # routes configuration
└── index.jsx          # app entry point
```

## CSS Naming Conventions

This project uses BEM Methodology.

```css
.block__element--modifier {

}
```
