// Este es el punto de entrada de tu aplicacion

// import { myFunction } from './lib/index.js';
import { collection, getDocs } from 'firebase/firestore';
import { welcome } from './components/welcome.js';
import { register } from './components/register.js';
import { loginwithGoogle } from './components/loginwithGoogle.js';
import { login } from './components/login.js';
import { dataBase } from './firebase/firebaseConfig.js';

// myFunction();
const rootDiv = document.getElementById('root');

const routes = {
  '/': welcome,
  '/login': login,
  '/register': register,
  '/loginwithGoogle': loginwithGoogle,
  // '/content': content,
};

export const App = () => {
  const obtainData = async () => {
    const datos = await getDocs(collection(dataBase, 'usuarios'));
    console.log('estos son mis datos', datos.docs[0].data());
  };
  obtainData();
};

export const onNavigate = (pathname) => {
  window.history.pushState(
    {},
    pathname,
    window.location.origin + pathname,
  );
  while (rootDiv.firstChild) {
    rootDiv.removeChild(rootDiv.firstChild);
  }
  rootDiv.appendChild(routes[pathname](onNavigate));
};

const component = routes[window.location.pathname];
rootDiv.appendChild(component(onNavigate));
