import { createRoot } from 'react-dom/client';

import App from './src/app'
import './index.css';
import ButtonAppBar from './src/componets/AppBar';

const container = document.querySelector('#app');
const root = createRoot(container);

root.render(<App/>);
