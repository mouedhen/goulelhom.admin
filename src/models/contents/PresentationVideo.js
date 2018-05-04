import {AbstractModel} from "../core/AbstractModel";
import {appConfig} from "../../config/app";

const apiDomain = appConfig.apiUrl;

export class PresentationVideo extends AbstractModel {

  constructor(attributes = {
    id: -1,
    name: '',
    url: '',
    is_selected: false,
  }, config = {apiUrl: apiDomain + 'content/presentation-video'}) {
    super(attributes, config)
  }

  serialize(attributes = {
    id: -1,
    name: '',
    url: '',
    is_selected: false,
  }) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.url = attributes.url;
    this.is_selected = attributes.is_selected;
  }

}
