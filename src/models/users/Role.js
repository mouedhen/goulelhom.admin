import {appConfig} from "../../config/app";
import {ReadOnlyAbstractClass} from "../core/ReadOnlyAbstractClass";

const apiDomain = appConfig.apiUrl;

export class Role extends ReadOnlyAbstractClass {

  constructor(attributes = {id: -1, name: '', display_name: '', description: ''},
              config = {apiUrl: apiDomain + 'users/roles'}) {
    super(attributes, config);
  }

  serialize(attributes = {id: -1, name: '', display_name: '', description: ''}) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.display_name = attributes.display_name;
    this.description = attributes.description;
  }

}
