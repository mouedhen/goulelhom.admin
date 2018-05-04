import axios from 'axios'

import {appConfig} from '../../config/app'

const apiDomain = appConfig.apiUrl;

export class AbstractModel {

  constructor(attributes = {}, config = {apiUrl: apiDomain}) {
    this.serialize(attributes);
    this.config = config;

    if (new.target === AbstractModel) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  async fetchAll(params) {
    return axios(
      {
        method: 'GET',
        url: this.config.apiUrl,
        params
      })
      .then(response => {
        return response.data
      })
      .catch(error => {
        throw error
      })
  }

  async infiniteFetch(params) {
    return axios(
      {
        method: 'GET',
        url: this.config.apiUrl,
        params
      })
      .then(response => {
        return response.data.data
      })
      .catch(error => {
        throw error
      })
  }

  async fetch(id, params) {
    return axios(
      {
        method: 'GET',
        url: this.config.apiUrl + '/' + id,
        params: params
      })
      .then(response => {
        this.serialize(response.data.data);
        return this;
      })
      .catch(error => {
        throw error
      })
  }

  async save() {
    if (this.id === -1 || this.id === null || this.id === undefined) {
      return this.create()
    }
    return this.update()
  }

  async create() {
    return axios(
      {
        method: 'POST',
        url: this.config.apiUrl,
        data: this
      })
      .then(response => {
        this.serialize(response.data.data);
        return this
      })
      .catch(error => {
        throw error
      })
  }

  async update() {
    return axios(
      {
        method: 'PUT',
        url: this.config.apiUrl + '/' + this.id,
        data: this
      })
      .then(response => {
        this.serialize(response.data.data);
        return this
      })
      .catch(error => {
        throw error
      })
  }

  async delete() {
    return axios(
      {
        method: 'DELETE',
        url: this.config.apiUrl + '/' + this.id,
      })
      .then(() => {
        this.serialize();
        return this
      })
      .catch(error => {
        throw error
      })
  }

}
