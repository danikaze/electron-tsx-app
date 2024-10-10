import React from 'react';
import ReactDOM from 'react-dom/client';

import { BoilerplateApp } from './components/boilerplate-app';

import './assets/styles.css';

const containerId = 'root';
const container = document.getElementById(containerId);
if (!container) {
  throw new Error(`#${containerId} not found in the html!`);
}
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <BoilerplateApp />
  </React.StrictMode>
);
