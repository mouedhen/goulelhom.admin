import axios from 'axios'
import {Storage} from './helpers/localstorage'

// import Echo from "laravel-echo"
//
// window.io = require('socket.io-client');
//
// window.Echo = new Echo({
//   broadcaster: 'socket.io',
//   host: window.location.hostname + ':6001',
// });

axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'multipart/form-data',
  'Authorization': 'Bearer ' + (new Storage).get('access-token'),
  'Access-Control-Allow-Origin': '*',
};
