import moment from 'moment'
import 'moment/locale/fr';
moment.locale('fr');

export const DateFormatterMixin = {
  methods: {
    formatDate(date) {
      return moment(date).format('LL')
    },
    formatDateTime(date) {
      return moment(date).format('LLLL')
    }
  }
};
