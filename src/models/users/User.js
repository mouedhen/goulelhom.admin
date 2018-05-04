import axios from "axios/index";

import {AbstractModel} from "../core/AbstractModel";
import {appConfig} from "../../config/app";
import {Storage} from '../../helpers/localstorage'
import {Role} from "./Role";

const apiDomain = appConfig.apiUrl;

export class User extends AbstractModel {

  constructor(attributes = {
                id: -1,
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                avatar: '',
                roles: [],
                activity: [],
                actions: []
              },
              config = {apiUrl: apiDomain + 'users/users', storage: new Storage()}) {
    super(attributes, config);
    this.storage = config.storage;
  }

  serialize(attributes = {
    id: -1,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    avatar: '',
    roles: [],
    activity: [],
    actions: []
  }) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.email = attributes.email;
    this.password = attributes.password;
    this.password_confirmation = attributes.password_confirmation;
    this.avatar = attributes.avatar;
    this.roles = attributes.roles
  }

  async login() {
    return axios(
      {
        method: 'POST',
        url: apiDomain + 'auth/login',
        data: {
          email: this.email,
          password: this.password,
        }
      })
      .then(response => {
        this.serialize(response.data.data);
        let token = response.data.data.token;
        this.storage.set('access-token', token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        return this
      })
      .catch(error => {
        throw error
      })
  }

  async isLoggedIn() {
    return this.storage.has('access-token')
  }

  logout() {
    return axios(
      {
        method: 'POST',
        url: apiDomain + 'auth/logout',
      })
      .then(() => {
        this.serialize();
        this.storage.remove('access-token');
        axios.defaults.headers.common['Authorization'] = '';
        return this
      })
      .catch(error => {
        throw error
      })
  }

  getProfile() {
    return axios(
      {
        method: 'GET',
        url: apiDomain + 'auth/profile',
      })
      .then((response) => {
        this.serialize(response.data.data);
        return this
      })
      .catch(error => {
        throw error
      })
  }

}
