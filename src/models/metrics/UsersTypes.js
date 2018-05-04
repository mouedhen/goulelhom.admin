import {ReadOnlyAbstractClass} from "../core/ReadOnlyAbstractClass"
import {appConfig} from "../../config/app"

const apiDomain = appConfig.apiUrl;

export class UsersTypes extends ReadOnlyAbstractClass {

  constructor(attributes = {type: '', sessions: ''},
              config = {apiUrl: apiDomain + 'analytics/users-types'}){
    super(attributes, config);
  }

  serialize(attributes = {type: '', sessions: ''}) {
    this.type = attributes.type;
    this.sessions = attributes.sessions;
  }

  getDataSets(params) {

    return this.fetchAll(params)
      .then(result => {

        let usersTypes = [];
        let sessionsNumber = [];

        result.map(element => {
          usersTypes.push(element.type);
          sessionsNumber.push(element.sessions);
        });

        return {
          usersTypes,
          sessionsNumber,
        };
      })
  }

  async fetch(id) {
    throw new TypeError("Not allowed method");
  }

}
