import {AbstractModel} from "../core/AbstractModel";
import {appConfig} from "../../config/app";

const apiDomain = appConfig.apiUrl;

export class Slider extends AbstractModel {

  constructor(attributes = {
    id: -1,
    quote: '',
    author: '',
    lang: '',
    is_selected: false,
    slide: '',
    thumb: '',
    translations: [],
  }, config = {apiUrl: apiDomain + 'content/sliders'}) {
    super(attributes, config)
  }

  serialize(attributes = {
    id: -1,
    quote: '',
    author: '',
    lang: '',
    is_selected: false,
    slide: '',
    thumb: '',
    translations: [],
  }) {
    this.id = attributes.id;
    this.quote = attributes.quote;
    this.author = attributes.author;
    this.lang = attributes.lang;
    this.is_selected = attributes.is_selected;
    this.slide = attributes.slide;
    this.thumb = attributes.thumb;
    this.translations = attributes.translations;
  }

}
