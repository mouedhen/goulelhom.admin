import {AbstractModel} from "../core/AbstractModel";
import {appConfig} from "../../config/app";

const apiDomain = appConfig.apiUrl;

export class Contact extends AbstractModel {

  constructor(attributes = {
    id: -1,
    name: '',
    phone_number: '',
    email: '',
    address: '',
    complains: [],
  }, config = {apiUrl: apiDomain + 'locations/cities'}) {
    super(attributes, config)
  }

  serialize(attributes = {
    id: -1,
    name: '',
    phone_number: '',
    email: '',
    address: '',
    complains: [],
  }) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.phone_number = attributes.name;
  }

}
