<template>
  <div>
    <div>
      <h2>Statistiques des visites de l'application</h2>
      <div style="text-align: right">
        <el-select
          v-model="params.period"
          placeholder="selectionner une période..."
          @change="loadVisitorsData">
          <el-option
            v-for="item in periodOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>

    <el-row :gutter="16" class="margin-top">
      <el-col :span="12">
        <el-card class="align-text-center" style="background: #1693A7; color: #f4f4f4">
          <h3>visiteurs recurrents</h3>
          <p><b>{{returningVisitors}}</b></p>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="align-text-center" style="background: #009989; color: #f4f4f4">
          <h3>visiteurs uniques</h3>
          <p><b>{{uniqueVisitors}}</b></p>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="16" class="margin-top">
      <el-col :span="16">
        <el-card>
          <bar-chart :chartData="visitorsDataSet"
                     :options="{responsive: true, maintainAspectRatio: false}" :height="400"/>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card style="height: 440px">
          <div slot="header" class="align-text-center">
            <b>Pages les plus visitées</b>
          </div>
          <div>
            <el-table
              :data="topPages"
              height="350"
              style="width: 100%">
              <el-table-column
                prop="url"
                label="url">
              </el-table-column>
              <el-table-column
                prop="pageViews"
                label="vues"
                width="60">
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>

  import {Visitors} from "@/models/metrics/Visitors";
  import BarChart from '@/components/charts/BarChart'
  import {TopPages} from "@/models/metrics/TopPages";
  import {UsersTypes} from "@/models/metrics/UsersTypes";

  import {Loading} from 'element-ui';

  export default {
    name: "visits-stats",
    components: {BarChart},
    data() {
      return {
        periodOptions: [
          {
            label: '7 jours',
            value: 7
          },
          {
            label: '30 jours',
            value: 30
          },
          {
            label: '90 jours',
            value: 90
          },
          {
            label: 'Une année',
            value: 364
          },
        ],
        params: {
          period: 7
        },
        topPages: [],
        uniqueVisitors: 0,
        returningVisitors: 0,
        visitorsDataSet: {
          labels: [],
          datasets: [
            {
              label: 'Visites uniques',
              backgroundColor: '#EDB92E',
              data: []
            },
            {
              label: 'Visites des pages',
              backgroundColor: '#009989',
              data: []
            },
          ]
        },
      }
    },
    methods: {
      loadVisitorsData() {
        let loadingInstance = Loading.service({ target: '#container' });

        (new Visitors()).getDataSets(this.params)
          .then(r => {
            this.visitorsDataSet = {
              labels: r.dates,
              datasets: [
                {
                  label: 'Visiteurs',
                  backgroundColor: '#EDB92E',
                  data: r.visitors
                },
                {
                  label: 'Pages vues',
                  backgroundColor: '#A3A948',
                  data: r.pageViews
                },
              ],
            }
          })
          .catch(e => {
            this.$message.error('Une erreur innattendue est survenue, merci de contacter votre administrateur...');
            console.log(e)
          });

        (new TopPages()).fetchAll(this.params)
          .then(r => this.topPages = r.data)
          .catch(e => {
            this.$message.error('Une erreur innattendue est survenue, merci de contacter votre administrateur...');
            console.log(e)
          });

        (new UsersTypes()).fetchAll(this.params)
          .then(response => {
            let r = response.data;
            let index = r.findIndex((x) => x.type === 'New Visitor');
            if (index !== -1) {
              this.uniqueVisitors = r[index].sessions
            }
            index = r.findIndex((x) => x.type === 'Returning Visitor');
            if (index !== -1) {
              this.returningVisitors = r[index].sessions
            }
          })
          .catch(e => {
            this.$message.error('Une erreur innattendue est survenue, merci de contacter votre administrateur...');
            console.log(e)
          });

        loadingInstance.close();
      }
    },
    mounted() {
      this.loadVisitorsData()
    }
  }
</script>

<style scoped>

</style>
