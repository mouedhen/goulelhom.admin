import {AbstractModel} from "../core/AbstractModel";
import {appConfig} from "../../config/app";

const apiDomain = appConfig.apiUrl;

export class Municipality extends AbstractModel {

  constructor(attributes = {
    id: -1,
    name: '',
    description: '',
    population: null,
    houses: null,
    regional_council_number: null,
    municipal_council_number: null,
    website: '',
    phone: '',
    email: '',
    fax: '',
    longitude: null,
    latitude: null,
    is_active: false,
    city_id: null,
    city: null,
    cover: null,
    miniature: null,
    attachments: [],
    complains: [],
    lang: '',
    translations: [],
  }, config = {apiUrl: apiDomain + 'locations/municipalities'}) {
    super(attributes, config)
  }

  serialize(attributes = {
    id: -1,
    name: '',
    description: '',
    population: null,
    houses: null,
    regional_council_number: null,
    municipal_council_number: null,
    website: '',
    phone: '',
    email: '',
    fax: '',
    longitude: null,
    latitude: null,
    is_active: null,
    city_id: null,
    city: null,
    cover: null,
    miniature: null,
    attachments: [],
    complains: [],
    lang: '',
    translations: [],
  }) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.description = attributes.description;
    this.population = attributes.population;
    this.houses = attributes.houses;
    this.regional_council_number = attributes.regional_council_number;
    this.municipal_council_number = attributes.municipal_council_number;
    this.website = attributes.website;
    this.phone = attributes.phone;
    this.email = attributes.email;
    this.fax = attributes.fax;
    this.longitude = attributes.longitude;
    this.latitude = attributes.latitude;
    this.is_active = attributes.is_active;
    this.city_id = attributes.city_id;
    this.city = attributes.city;
    this.cover = attributes.cover;
    this.miniature = attributes.miniature;
    this.attachments = attributes.attachments;
    this.complains = attributes.complains;
    this.lang = attributes.lang;
    this.translations = attributes.translations;
  }

}
