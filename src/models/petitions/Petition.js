import {AbstractModel} from "../core/AbstractModel";
import {appConfig} from "../../config/app";

const apiDomain = appConfig.apiUrl;

export class Petition extends AbstractModel {

  constructor(attributes = {
    id: -1,
    uuid: -1,
    start_date: -1,
    end_date: -1,
    name: -1,
    description: -1,
    theme_id: -1,
    contact_id: -1,
    organization_id: -1,
    requested_signatures_number: -1,
    status: -1,
    is_boosted: -1,
    is_new: -1,
    is_moderated: -1,
    is_valid: -1,
    has_approved_sworn_statement: -1,
    has_approved_term_of_use: -1,
  }, config = {apiUrl: apiDomain + 'petitions/petitions'}) {
    super(attributes, config)
  }

  serialize(attributes = {
    id: -1,
    uuid: -1,
    start_date: -1,
    end_date: -1,
    name: -1,
    description: -1,
    theme_id: -1,
    contact_id: -1,
    organization_id: -1,
    requested_signatures_number: -1,
    status: -1,
    is_boosted: -1,
    is_new: -1,
    is_moderated: -1,
    is_valid: -1,
    has_approved_sworn_statement: -1,
    has_approved_term_of_use: -1,
  }) {
    this.id = attributes.id;
    this.uuid = attributes.uuid;
    this.start_date = attributes.start_date;
    this.end_date = attributes.end_date;
    this.description = attributes.description;
    this.theme_id = attributes.theme_id;
    this.contact_id = attributes.contact_id;
    this.organization_id = attributes.organization_id;
    this.requested_signatures_number = attributes.requested_signatures_number;
    this.status = attributes.status;
    this.is_boosted = attributes.is_boosted;
    this.is_new = attributes.is_new;
    this.is_moderated = attributes.is_moderated;
    this.is_valid = attributes.is_valid;
    this.has_approved_sworn_statement = attributes.has_approved_sworn_statement;
    this.has_approved_term_of_use = attributes.has_approved_term_of_use;
  }
}
