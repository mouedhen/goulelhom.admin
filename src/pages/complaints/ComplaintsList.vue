<template>

  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>plaintes</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'events:index' }">historique</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="margin-top" :gutter="8">
      <el-col :span="6">
        <el-select
          v-model="themesFilter"
          multiple
          style="width: 100%"
          placeholder="Thème(s)">
          <el-option
            v-for="theme in themes"
            :key="theme.id"
            :label="theme.name"
            :value="theme.id">
          </el-option>
        </el-select>
      </el-col>

      <el-col :span="6">
        <el-select
          style="width: 100%"
          v-model="municipalitiesFilter"
          multiple
          placeholder="Municipalité(s)">
          <el-option
            v-for="municipality in municipalities"
            :key="municipality.id"
            :label="municipality.name"
            :value="municipality.id">
          </el-option>
        </el-select>
      </el-col>

      <el-col :span="10">
        <el-date-picker
          style="width: 100%"
          v-model="dateFilter"
          type="daterange"
          unlink-panels
          value-format="yyyy-MM-dd"
          format="dd-MM-yyyy"
          range-separator="à"
          start-placeholder="Date de début"
          end-placeholder="Date de fin">
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-button style="width: 100%" type="info" plain @click="filter">Filtrer</el-button>
      </el-col>
    </el-row>

    <div class="no-images margin-top" v-if="records.length < 1">
      <div>
        <p>Aucune plaintes...</p>
      </div>
    </div>

    <div v-else>
      <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <complaint-card v-for="record in records" :key="record.id" :complaint="record"/>
      </div>

      <el-card style="padding: 1rem; margin-top: 1rem" v-if="recordsHaveNext">
        <div v-loading="recordsHaveNext"
             element-loading-text="Chargement..."
             element-loading-spinner="el-icon-loading"
             style="width: 100%"
        ></div>
      </el-card>
    </div>

  </div>
</template>

<script>
  import moment from 'moment'
  import 'moment/locale/fr';

  moment.locale('fr');

  import {Loading} from 'element-ui';

  import {Complaint} from "../../models/complaints/Complaint";
  import ComplaintCard from "./blocks/ComplaintCard";
  import {Theme} from "../../models/metrics/Theme";
  import {Municipality} from "../../models/locations/Municipality";

  export default {
    components: {ComplaintCard},
    name: "complaints-list",
    data() {
      return {
        records: [],
        dateFilter: [],
        themes: [],
        municipalities: [],
        municipalitiesFilter: null,
        themesFilter: null,
        busy: false,
        page: 1,
        recordsHaveNext: false,
      }
    },
    computed: {
      startDate: function () {
        if (this.dateFilter === null) return null;
        if (this.dateFilter[0] !== undefined)
          return this.dateFilter[0];
        else
          return null
      },
      endDate: function () {
        if (this.dateFilter === null) return null;
        if (this.dateFilter[1] !== undefined)
          return this.dateFilter[1];
        else
          return null
      },
    },
    methods: {
      async filter() {
        let params = {
          themes: this.themesFilter.toString(),
          municipalities: this.municipalitiesFilter.toString(),
        };

        if (this.startDate !== null && this.endDate !== null) {
          params.start_date = this.startDate;
          params.end_date = this.endDate;
        }

        this.loadData(params)
      },
      formatDate(date) {
        return moment(date).format('L')
      },
      initData() {
        this.records = [];
        this.busy = false;
        this.page = 1;
        this.recordsHaveNext = false;
      },
      loadRecords(params) {
        this.busy = true;
        (new Complaint())
          .fetchAll(params)
          .then(r => {
            this.records = this.records.concat(r.data);
            if (r.links.next !== null) {
              this.recordsHaveNext = true;
              this.page = r.meta.current_page + 1;
              this.busy = false;
            } else {
              this.recordsHaveNext = false;
              this.page = 1;
            }
          })
          .catch(e => {
            this.$message.error('Impossible d\'accéder au données, merci de contacter vote administrateur...');
            this.busy = false;
            console.log(e)
          });
      },
      loadMore(params) {
        if (this.recordsHaveNext) {
          setTimeout(() => {
            this.loadRecords({page: this.page, ...params});
          }, 1000);
        }
      },
      loadData(params) {
        let loadingInstance = Loading.service({target: '#container'});
        this.initData();
        this.loadRecords(params);
        loadingInstance.close();
      },
      loadThemes() {
        (new Theme()).fetchAll({lang: 'fr'})
          .then(r => {
            this.themes = r.data;
          })
          .catch(e => {
            this.$message.error('Impossible d\'accéder au données, merci de contacter vote administrateur...');
            console.log(e)
          });
      },
      loadMunicipalities() {
        (new Municipality()).fetchAll({lang: 'fr'})
          .then(r => {
            this.municipalities = r.data;
          })
          .catch(e => {
            this.$message.error('Impossible d\'accéder au données, merci de contacter vote administrateur...');
            console.log(e)
          });
      },
    },
    mounted() {
      this.loadData(this.params);
      this.loadThemes();
      this.loadMunicipalities();
    }
  }
</script>

<style scoped>
  .no-images {
    height: 400px;
    border: #e4e4e4 solid 1px;
    background: #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-weight: bold;
    border-radius: 8px;
    color: #222;
  }
</style>
