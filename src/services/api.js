import axios from 'axios';


const api = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API,

});

export const urlFoto = {
  caminhoFoto: process.env.VUE_APP_ROOT_STORAGE
};


export default api;