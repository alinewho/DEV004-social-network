import {
  addDoc, documentId, onSnapshot, updateDoc, doc, deleteDoc, arrayUnion, arrayRemove,
} from 'firebase/firestore';
import { signOutUser, coleccPublic, qOrdered } from '../lib/firebaseFunctions';
import { auth, db } from '../firebase/firebaseConfig';
import logoBanner from '../Imagenes/cáo_navbarwhite.png';
import user from '../Imagenes/usersinfondo.png';

const userData = () => {
  const user = auth.currentUser;
  if (user !== null) {
    // The user object has basic properties such as display name, email, etc.
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;
  }
  return user;
};

export const posts = () => {
  const root = document.getElementById('root');
  root.innerHTML = `
    <section id= "containerMain">

        <div id="partOfwelcome">
            <img src="${logoBanner}">
            <button class="buttonsOfPosts logOutButton" id="logOutBoton"></button>
        </div>

        <form id="newPost">

            <div class="postContainer">
            <textarea id="description" rows="6" cols="50" placeholder="cuentanos algo de las plantas"> </textarea> <br>
            </div>
            <button  >Publicar</button>

        </form>
    </section>

    <footer></footer>
    `;
  async function like(idPublicacion, correoUsuario) {
    const docRef = doc(db, 'publicaciones', idPublicacion);
    await updateDoc(docRef, { likes: arrayUnion(correoUsuario) });
  }

  // Define la función "no me gusta"
  async function disLike(idPublicacion, correoUsuario) {
    const docRef = doc(db, 'publicaciones', idPublicacion);
    await updateDoc(docRef, { likes: arrayRemove(correoUsuario) });
  }

  onSnapshot(qOrdered, (querySnapshot) => {
    const postContainer = document.getElementById('post');
    postContainer.innerHTML = '';
    querySnapshot.forEach((post) => {
      // console.log(post.data().likes);
      postContainer.innerHTML += `
      <div id="historyOfPosts" class="historyOfPosts">
        <div class="informationOfUser" id="${post.id}">
              <div class="user-post">
                <img src="${user}" class="inLine">
                <div class="post-informacion">
                  <h3>${post.data().autor}</h3>
                  <h6>${post.data().creacion}</h6>
                </div>
              </div>
            <p class="mostrado" id="p-${post.id}">${post.data().descripcion}</p>
            <textarea class="oculto" id="textarea-${post.id}">${post.data().descripcion}</textarea>
            <div class="editright likeleft" id="buttonLike">
                <button class="like-button l-button" data-email="${post.id}" id="like-button" ></button>
              </div>
        </div>
         ${
  (post.data().autor === userData().email)
    ? `
            <div id="buttonsOfConfiguration">
              <div class="likeleft" id="likeleft">
                <button class="edit-button" data-id="${post.id}"></button>
                <button class="delete-button" data-id="${post.id}"></button>
              </div>
              
            </div>
            `
    : ''
}
      </div>
      `;
      // console.log(post.data().likes)
      const likeB = document.querySelectorAll('.l-button'); // transparente

      likeB.forEach((btn) => {
        btn.addEventListener('click', () => {
          if (post.data().likes.includes(userData().email)) {
            console.log('if');
            disLike(btn.dataset.email, userData().email).then(() => {
              btn.classList.toggle('like-button');
              btn.classList.toggle('dislike-button');
            }).catch((error) => {
              console.log(error);
            });
          } else {
            like(btn.dataset.email, userData().email).then(() => {
              btn.classList.toggle('like-button');
              btn.classList.toggle('dislike-button');
            }).catch((error) => {
              console.log(error);
            });
            console.log('entro al else');
          }
        });
      });
    });

    const editButton = postContainer.querySelectorAll('.edit-button');
    editButton.forEach((boton) => {
      boton.addEventListener('click', (e) => {
        document.getElementById(e.target.dataset.id)
          .innerHTML += `
       <button id="g-${e.target.dataset.id}">Guardar</button>
       `;
        document.getElementById(`p-${e.target.dataset.id}`)
          .setAttribute('class', 'oculto');
        const textAIn = document.getElementById(`textarea-${e.target.dataset.id}`);
        textAIn.setAttribute('class', 'mostrado');
        console.log(e.target.dataset.id);
        document.getElementById(`g-${e.target.dataset.id}`)
          .addEventListener('click', () => {
            console.log('click guardar');
            const docRef = doc(db, 'publicaciones', e.target.dataset.id);
            updateDoc(docRef, {
              descripcion: textAIn.value,
            });
          });
      });
    });
    const deleteButton = postContainer.querySelectorAll('.delete-button');
    deleteButton.forEach((boton) => {
      boton.addEventListener('click', (e) => {
        console.log('funciona el boton de eliminar', deleteButton);
        document.getElementById(e.target.dataset.id);
        if (confirm('¿Deseas eliminar este comentario?')) {
          const docRef = doc(db, 'publicaciones', e.target.dataset.id);
          deleteDoc(docRef);
        }
      });
    });
    // const likes = [];

    // const likePost = ((muro) => {
    //   muro.forEach((publicaciones) => {
    //     if (publicaciones.like.includes(userData().email)) {
    //       likeB.setAttribute('class', 'mostrado');
    //     } else {
    //       dislikeB.setAttribute('class', 'oculto');
    //     }
    //   });
    // });
    // const likeButton = document.querySelectorAll('.like-button');
    // likeButton.forEach((botonL) => {
    //   botonL.addEventListener('click', () => {
    //     console.log('funciona boton like');
    //   });
    // });
  });

  const logOut = document.getElementById('logOutBoton');
  logOut.addEventListener('click', () => signOutUser());
  const today = new Date();

  const publishButton = root.querySelector('#newPost');
  publishButton.addEventListener('submit', (e) => {
    e.preventDefault();

    const infoUser = userData();
    addDoc(coleccPublic, {
      autor: infoUser.email,
      descripcion: publishButton.description.value,
      creacion: today.toLocaleString('en-GB'),
      likes: [],
    })
      .then(() => {
        publishButton.reset();
      });
  });
  return root;
};
