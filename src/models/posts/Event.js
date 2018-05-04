import {AbstractModel} from "../core/AbstractModel";
import {appConfig} from "../../config/app";
import moment from 'moment'

const apiDomain = appConfig.apiUrl;

export class Event extends AbstractModel {

  constructor(attributes = {
    id: -1,
    title: '',
    description: '',
    lang: '',
    start_date: '',
    end_date: '',
    longitude: '',
    latitude: '',
    document: '',
    thumb: '',
    translations: [],
  }, config = {apiUrl: apiDomain + 'posts/events'}) {
    super(attributes, config)
  }

  serialize(attributes = {
    id: -1,
    title: '',
    description: '',
    lang: '',
    start_date: '',
    end_date: '',
    longitude: '',
    latitude: '',
    document: '',
    thumb: '',
    translations: [],
  }) {
    this.id = attributes.id;
    this.title = attributes.title;
    this.description = attributes.description;
    this.desc = attributes.description;
    this.lang = attributes.lang;
    this.date = moment(attributes.start_date, 'YYYY-MM-DD').format('YYYY/MM/DD');
    this.start_date = attributes.start_date;
    this.end_date = attributes.end_date;
    this.longitude = attributes.longitude;
    this.latitude = attributes.latitude;
    this.document = attributes.document;
    this.thumb = attributes.thumb;
    this.translations = attributes.translations;
  }

}
