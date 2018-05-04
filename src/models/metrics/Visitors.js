import moment from 'moment'
import 'moment/locale/fr';

moment.locale('fr');

import {ReadOnlyAbstractClass} from "../core/ReadOnlyAbstractClass"
import {appConfig} from "../../config/app"

const apiDomain = appConfig.apiUrl;

export class Visitors extends ReadOnlyAbstractClass {

  constructor(attributes = {date: {date: '', timezone_type: -1, timezone: ''}, visitors: 0, pageViews: 0},
              config = {apiUrl: apiDomain + 'analytics/visitors'}) {
    super(attributes, config);
  }

  serialize(attributes = {date: {date: '', timezone_type: -1, timezone: ''}, visitors: 0, pageViews: 0}) {
    this.date = attributes.date.date;
    this.visitors = attributes.visitors;
    this.pageViews = attributes.pageViews;
  }

  getDataSets(params) {

    return this.fetchAll(params)
      .then(result => {

        let visitors = [];
        let dates = [];
        let pageViews = [];

        result.data.map(element => {
          visitors.push(element.visitors);
          dates.push(moment(element.date.date).format('L'));
          pageViews.push(element.pageViews);
        });

        return {
          visitors,
          dates,
          pageViews,
        };
      })
  }

  async fetch(id) {
    throw new TypeError("Not allowed method");
  }

}
