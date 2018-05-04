import {AbstractModel} from "../core/AbstractModel";
import {appConfig} from "../../config/app";

const apiDomain = appConfig.apiUrl;

export class Country extends AbstractModel {

  constructor(attributes = {
    id: -1,
    name: '',
    description: '',
    population: null,
    longitude: null,
    latitude: null,
    cities: [],
    cover: null,
    miniature: null,
    attachments: [],
    lang: '',
    translations: [],
  }, config = {apiUrl: apiDomain + 'locations/countries'}) {
    super(attributes, config)
  }

  serialize(attributes = {
    id: -1,
    name: '',
    description: '',
    population: null,
    longitude: null,
    latitude: null,
    cities: [],
    cover: null,
    miniature: null,
    attachments: [],
    lang: '',
    translations: [],
  }) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.description = attributes.description;
    this.population = attributes.population;
    this.cities = attributes.cities;
    this.cover = attributes.cover;
    this.miniature = attributes.miniature;
    this.attachments = attributes.attachments;
    this.lang = attributes.lang;
    this.translations = attributes.translations;
  }

}
