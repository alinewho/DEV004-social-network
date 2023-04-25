import { loginGoogle } from '../lib/firebaseFunctions.js';
import { onNavigate } from '../router/index.js';
import logo from '../Imagenes/Cáo_logo_Welcome_white.png';

export const welcome = () => {
  const root = document.getElementById('root');
  // root.style.backgroundColor = '#E9ECE3';
  // se envuelven los botones en un contenedor con la clase "button-container"
  root.innerHTML = `
  <div class="container">
  <div class="button-container">
    <div class="logo-container">
      <img class="imageLogo" src="${logo}" alt="logocactus">
    </div><br>
    <button class="bw" id="buttonLogin"> INICIAR SESIÓN  </button> <br>
    <button id="buttonGoogle" class="googleButton bw"> INICIAR SESIÓN CON GOOGLE </button><br>
    <button class="bw" id="buttonRegister" > CREA CUENTA NUEVA</button>
  </div>
</div>`;
  const buttonLogin = document.getElementById('buttonLogin');
  const buttonGoogle = document.getElementById('buttonGoogle');
  const buttonRegister = document.getElementById('buttonRegister');
  buttonRegister.addEventListener('click', () => onNavigate('/register'));
  buttonLogin.addEventListener('click', () => onNavigate('/login'));
  buttonGoogle.addEventListener('click', () => {
    // new GoogleAuthProvider(auth, provider);
    loginGoogle().then(() => {
      // onNavigate('/posts');
    }).catch(() => {
      // alert('Verifica)
    });
  });
};

const post = document.getElementById('post');
post.innerHTML = `
 `;
