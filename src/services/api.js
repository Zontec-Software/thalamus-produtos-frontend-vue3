import axios from 'axios';


const api = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,
  // devURL: process.env.VUE_APP_ROOT_DEV,

});

//local de armazenamento das fotos de visitante e colaborador
// export const urlFoto = {
//   caminhoFoto: process.env.VUE_APP_ROOT_STORAGE
// };

// api.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => {
//     return Promise.reject(error);
//   }
// );



export default api;