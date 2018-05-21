import {AbstractModel} from "../models/core/AbstractModel";
import {Loading} from 'element-ui';

export const RecordsListMixin = {
  data() {
    return {
      records: [],
    }
  },
  computed: {
    factory: function () {
      return new AbstractModel()
    }
  },
  methods: {
    initData() {
      this.records = [];
    },
    async loadData() {
      let loadingInstance = Loading.service({target: '#container'});
      this.factory.fetchAll({lang: 'fr'})
        .then(r => {
          loadingInstance.close();
          this.records = r.data
        })
        .catch(e => {
          loadingInstance.close();
          this.$message.error('Erreur lors de la lecture des données, veuillez contacter votre administrateur...');
          console.log(e)
        })
    }
  },
  mounted() {
    this.loadData();
  }
};
