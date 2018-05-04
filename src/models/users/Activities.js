import moment from 'moment'
import 'moment/locale/fr';

moment.locale('fr');

import {appConfig} from "../../config/app";
import {ReadOnlyAbstractClass} from "../core/ReadOnlyAbstractClass";

const apiDomain = appConfig.apiUrl;

export class Activities extends ReadOnlyAbstractClass {

  constructor(attributes = {
    id: -1, description: '', subject: {}, subject_type: '', causer: {}, date: {}, properties: {},
  }, config = {
    apiUrl: apiDomain + 'users/activities'
  }) {
    super(attributes, config);
  }

  serialize(attributes = {
    id: -1, description: '', subject: {}, subject_type: '', causer: {}, date: {}, properties: {},
  }) {
    this.id = attributes.id;
    this.description = attributes.description;
    this.subject = attributes.subject;
    this.subject_type = attributes.subject_type;
    this.causer = attributes.causer;
    this.date = moment(attributes.date.date).format('L');
    this.properties = attributes.properties;
  }

}
