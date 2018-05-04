import {ReadOnlyAbstractClass} from "../core/ReadOnlyAbstractClass"
import {appConfig} from "../../config/app"

const apiDomain = appConfig.apiUrl;

export class TopPages extends ReadOnlyAbstractClass {

  constructor(attributes = {url: '', pageTitle: '', pageViews: 0},
              config = {apiUrl: apiDomain + 'analytics/top-pages'}){
    super(attributes, config);
  }

  serialize(attributes = {url: '', pageTitle: '', pageViews: 0}) {
    this.url = attributes.url;
    this.pageTitle = attributes.pageTitle;
    this.pageViews = attributes.pageViews;
  }

  getDataSets(params) {

    return this.fetchAll(params)
      .then(result => {

        let pages = [];
        let pageViews = [];

        result.map(element => {
          pages.push(element.pageTitle);
          pageViews.push(element.pageViews);
        });

        return {
          pages,
          pageViews,
        };
      })
  }

  async fetch(id) {
    throw new TypeError("Not allowed method");
  }

}
