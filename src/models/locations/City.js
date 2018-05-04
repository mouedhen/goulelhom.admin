import {AbstractModel} from "../core/AbstractModel";
import {appConfig} from "../../config/app";

const apiDomain = appConfig.apiUrl;

export class City extends AbstractModel {

  constructor(attributes = {
    id: -1,
    name: '',
    description: '',
    population: null,
    longitude: null,
    latitude: null,
    country_id: null,
    country: null,
    municipalities: [],
    cover: null,
    miniature: null,
    attachments: [],
    lang: '',
    translations: [],
  }, config = {apiUrl: apiDomain + 'locations/cities'}) {
    super(attributes, config)
  }

  serialize(attributes = {
    id: -1,
    name: '',
    description: '',
    population: null,
    longitude: null,
    latitude: null,
    country_id: null,
    country: null,
    municipalities: [],
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
    this.country_id = attributes.country_id;
    this.country = attributes.country;
    this.municipalities = attributes.municipalities;
    this.cover = attributes.cover;
    this.miniature = attributes.miniature;
    this.attachments = attributes.attachments;
    this.lang = attributes.lang;
    this.translations = attributes.translations;
  }

}
