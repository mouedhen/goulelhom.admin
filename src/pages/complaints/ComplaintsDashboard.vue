<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'complains:dashboard' }">gestion des plaintes</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'complains:list' }">Tableau de bord</el-breadcrumb-item>
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

    <el-card class="margin-top">
      <h2>Evolution du nombre de plaintes par rapport au temps</h2>
      <bar-chart :chartData="claimsDataCollection"
                 :options="{responsive: true, maintainAspectRatio: false}"
                 :height="400"/>
    </el-card>

    <el-card class="margin-top">
      <el-row>
        <el-col :span="24">
          <h2>Plaintes par thème</h2>
        </el-col>

        <el-col :span="12">
          <doughnut-chart :chartData="themesDataCollection"
                          :options="{responsive: true, maintainAspectRatio: false}" :height="500"/>
        </el-col>
        <el-col :span="12">
          <el-table
            :data="themesData"
            style="width: 100%">
            <el-table-column
              prop="theme"
              label="Thème">
            </el-table-column>
            <el-table-column
              prop="count"
              label="Total des plaintes"
              width="180">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="margin-top">
      <el-row>
        <el-col :span="24">
          <h2>Plaintes par municipalité</h2>
        </el-col>
        <el-col :span="12">
          <doughnut-chart :chartData="municipalitiesDataCollection"
                          :options="{responsive: true, maintainAspectRatio: false}" :height="500"/>
        </el-col>

        <el-col :span="12">
          <el-table
            :data="municipalitiesData"
            style="width: 100%">
            <el-table-column
              prop="municipality"
              label="Municipalité">
            </el-table-column>
            <el-table-column
              prop="count"
              label="Total des plaintes"
              width="180">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'
  import 'moment/locale/fr';

  moment.locale('fr');
  require('twix');
  import randomColor from 'randomcolor'

  import {Loading} from 'element-ui';

  import {Theme} from "../../models/metrics/Theme";
  import {Municipality} from "../../models/locations/Municipality";
  import {appConfig} from "../../config/app";
  import DoughnutChart from "../../components/charts/DoughnutChart";
  import BarChart from "../../components/charts/BarChart";
  import ElCard from "element-ui/packages/card/src/main";

  const apiUrl = appConfig.apiUrl;

  export default {
    components: {
      ElCard,
      DoughnutChart, BarChart
    },
    name: "complaints-dashboard",
    data() {
      return {
        dateFilter: [],
        themes: [],
        municipalities: [],
        municipalitiesFilter: null,
        themesFilter: null,

        themesDataCollection: null,
        municipalitiesDataCollection: null,
        claimsDataCollection: null,

        claimsData: [],
        themesData: [],
        municipalitiesData: [],
      }
    },
    computed: {
      startDate: function () {
        if (this.dateFilter === null) return null;
        if (this.dateFilter[0] !== undefined)
          return this.dateFilter[0];
        return null
      },
      endDate: function () {
        if (this.dateFilter === null) return null;
        if (this.dateFilter[1] !== undefined)
          return this.dateFilter[1];
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
      async fillThemesData(config = {params: {}}) {
        let themes = [];
        let colors = [];
        let counter = [];
        axios(
          {
            method: 'GET',
            params: config.params,
            url: apiUrl + 'stats/themes?lang=fr',
          })
          .then(response => {
            let data = response.data;
            this.themesData = data;
            for (let i = 0; i < data.length; i++) {
              themes.push(data[i].theme);
              colors.push(data[i].color);
              counter.push(data[i].count);
            }
            this.themesDataCollection = {
              labels: themes,
              datasets: [
                {
                  label: 'Plaintes par thèmes',
                  backgroundColor: colors,
                  data: counter
                },
              ]
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      async fillMunicipalitiesData(config = {params: {}}) {
        let municipalities = [];
        let colors = [];
        let counter = [];
        axios(
          {
            method: 'GET',
            params: config.params,
            url: apiUrl + 'stats/municipalities?lang=fr',
          })
          .then(response => {
            let data = response.data;
            this.municipalitiesData = response.data;
            for (let i = 0; i < data.length; i++) {
              municipalities.push(data[i].municipality);
              colors.push(randomColor());
              counter.push(data[i].count);
            }
            this.municipalitiesDataCollection = {
              labels: municipalities,
              datasets: [
                {
                  label: 'Plaintes par municipalité',
                  backgroundColor: colors,
                  data: counter
                },
              ]
            }
          })
          .catch(error => {
            console.log(error)
          })
      },

      async fillClaimsData(config = {params: {}}) {
        let calendar = [];
        let counter = [];

        axios(
          {
            method: 'GET',
            params: config.params,
            url: apiUrl + 'stats/dates',
          })
          .then(response => {
            let data = response.data;
            this.claimsData = response.data;

            let period = moment(data[0].dates).twix(data[data.length - 1].dates, true).toArray('days');

            for (let i = 0; i < period.length; i++) {
              calendar.push(period[i].format("DD/MM/YYYY"));

              let index = data.findIndex((x) => moment(x.dates).isSame(period[i]));
              if (index === -1) {
                counter.push(0)
              } else {
                counter.push(data[index].count)
              }
            }

            this.claimsDataCollection = {
              labels: calendar,
              datasets: [
                {
                  label: 'Nombre de plaintes',
                  backgroundColor: '#70a1ff',
                  data: counter
                },
              ]
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      loadData(params) {
        let loadingInstance = Loading.service({target: '#container'});
        this.fillThemesData({params});
        this.fillMunicipalitiesData({params});
        this.fillClaimsData({params});
        loadingInstance.close();
      }
    },
    mounted() {
      this.loadThemes();
      this.loadMunicipalities();
      this.loadData();
    }

  }
</script>

<style scoped>

</style>
