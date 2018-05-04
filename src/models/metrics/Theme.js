import {AbstractModel} from "../core/AbstractModel";
import {appConfig} from "../../config/app";

const apiDomain = appConfig.apiUrl;

export class Theme extends AbstractModel {

  constructor(attributes = {
    id: -1,
    name: '',
    description: '',
    color: '',
    cover: '',
    miniature: '',
    attachments: [],
    lang: '',
    translations: [],
  }, config = {apiUrl: apiDomain + 'metrics/themes'}) {
    super(attributes, config)
  }

  serialize(attributes = {
    id: -1,
    name: '',
    description: '',
    color: '',
    cover: '',
    miniature: '',
    attachments: [],
    lang: '',
    translations: [],
  }) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.description = attributes.description;
    this.color = attributes.color;
    this.cover = attributes.cover;
    this.miniature = attributes.miniature;
    this.attachments = attributes.attachments;
    this.lang = attributes.lang;
    this.translations = attributes.translations;
  }

}
