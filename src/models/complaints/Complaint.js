import {AbstractModel} from "../core/AbstractModel";
import {appConfig} from "../../config/app";

const apiDomain = appConfig.apiUrl;

export class Complaint extends AbstractModel {

  constructor(attributes = {
    id: -1,
    subject: '',
    description: '',
    longitude: null,
    latitude: null,
    is_new: false,
    is_moderated: false,
    is_valid: false,
    has_approved_sworn_statement: false,
    has_approved_term_of_use: false,
    theme_id: null,
    theme: null,
    contact_id: null,
    contact: null,
    municipality_id: null,
    municipality: null,
    complain_id: null,
    complain: null,
    attachments: [],
    created_at: null,
  }, config = {apiUrl: apiDomain + 'complains/complains'}) {
    super(attributes, config)
  }

  serialize(attributes = {
    id: -1,
    subject: '',
    description: '',
    longitude: null,
    latitude: null,
    is_new: false,
    is_moderated: false,
    is_valid: false,
    has_approved_sworn_statement: false,
    has_approved_term_of_use: false,
    theme_id: null,
    theme: null,
    contact_id: null,
    contact: null,
    municipality_id: null,
    municipality: null,
    complain_id: null,
    complain: null,
    attachments: [],
    created_at: null,
  }) {
    this.id = attributes.id;
    this.subject = attributes.subject;
    this.description = attributes.description;
    this.longitude = attributes.longitude;
    this.latitude = attributes.latitude;
    this.is_new = attributes.is_new;
    this.is_moderated = attributes.is_moderated;
    this.is_valid = attributes.is_valid;
    this.has_approved_sworn_statement = attributes.has_approved_sworn_statement;
    this.has_approved_term_of_use = attributes.has_approved_term_of_use;
    this.theme_id = attributes.theme_id;
    this.theme = attributes.theme;
    this.contact_id = attributes.contact_id;
    this.contact = attributes.contact;
    this.municipality_id = attributes.municipality_id;
    this.municipality = attributes.municipality;
    this.complain_id = attributes.complain_id;
    this.complain = attributes.complain;
    this.attachments = attributes.attachments;
    this.created_at = attributes.created_at;
  }

}
