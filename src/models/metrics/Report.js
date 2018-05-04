import {AbstractModel} from "../core/AbstractModel";
import {appConfig} from "../../config/app";

const apiDomain = appConfig.apiUrl;

export class Report extends AbstractModel {

  constructor(attributes = {
    id: -1,
    title: '',
    description: '',
    document: '',
    published_at: '',
    period_start_at: '',
    period_end_at: '',
    thumb: '',
    attachments: [],
    lang: '',
    translations: [],
  }, config = {apiUrl: apiDomain + 'metrics/reports'}) {
    super(attributes, config)
  }

  serialize(attributes = {
    id: -1,
    title: '',
    description: '',
    document: '',
    published_at: '',
    period_start_at: '',
    period_end_at: '',
    thumb: '',
    attachments: '',
    lang: '',
  }) {
    this.id = attributes.id;
    this.title = attributes.title;
    this.description = attributes.description;
    this.document = attributes.document;
    this.published_at = attributes.published_at;
    this.period_start_at = attributes.period_start_at;
    this.period_end_at = attributes.period_end_at;
    this.thumb = attributes.thumb;
    this.attachments = attributes.attachments;
    this.lang = attributes.lang;
    this.translations = attributes.translations;
  }

}
