# Running ES6 code with node

- Install babel and others (`Babel 7`).

  ```bash
  npm install -D @babel/core @babel/cli @babel/preset-env @babel/node
  ```

- Make sure you add a `.babelrc` file at the root of your project.

  ```json
  {
    "presets": ["@babel/preset-env"]
  }
  ```

- Running ES6 code with node

  ```bash
  babel-node scripts/validateQuotes.js
  ```

  Or just run:

  ```bash
  npm run validate-quotes
  ```
