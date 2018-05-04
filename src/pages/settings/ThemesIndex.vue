<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>configuration</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'settings:themes' }">thèmes</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      title="Ajouter un thème"
      :before-close="handleClose">
      <theme-form :record="record" @submit="loadData"/>
    </el-dialog>

    <div>

      <div class="align-text-right">
        <el-button type="primary" @click="dialogVisible = true" icon="el-icon-plus" circle/>
        <el-button type="info" icon="el-icon-question" v-popover:popover1 circle/>
        <el-popover
          ref="popover1"
          width="400"
          trigger="click">
          <div>
            <strong>Aide</strong>
            <p>Vous pouvez dans cette section gérer les thématiques proposées.</p>
            <div class="margin-top">
              <el-button type="primary" icon="el-icon-plus" circle/>
              Ajouter un thème
            </div>
            <div class="margin-top">
              <el-button type="success" icon="el-icon-view" circle/>
              Détails du thème
            </div>
            <div class="margin-top">
              <el-button type="warning" icon="el-icon-edit" circle/>
              Modifer le thème
            </div>
            <div class="margin-top">
              <el-button type="danger" icon="el-icon-delete" circle/>
              Supprimer le thème
              <p class="note">En supprimant un thème, toutes les plaintes, les pétitions... qui lui sont associées seront
              supprimées de façon définitive...</p>
            </div>
          </div>
        </el-popover>
      </div>

      <el-row :gutter="12">
        <el-col :span="8" v-for="r in records" :key="r.id" class="margin-top">
          <theme-card :themeData="r" @updated="loadData"/>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {Loading} from 'element-ui'
  import {Theme} from "../../models/metrics/Theme";

  import ThemeCard from './blocks/ThemeCard'
  import ThemeForm from "./blocks/ThemeForm";

  export default {
    name: "themes-index",
    components: {
      ThemeForm,
      ThemeCard
    },
    data() {
      return {
        records: [],
        record: new Theme(),
        dialogVisible: false,
      }
    },
    methods: {
      getRecords(params) {
        (new Theme()).fetchAll(params)
          .then(r => {
            this.records = r.data;
            // @NOTE this can handle pagination
            // this.records = this.records.concat(r.data);
            // if (r.links.next !== null) {
            //   this.getRecords({page: r.meta.current_page + 1})
            // }
          })
          .catch(e => {
            this.$message.error('Impossible d\'accéder au données, merci de contacter vote administrateur...');
            console.log(e)
          });
      },
      handleClose(done) {
        this.record = new Theme();
        done();
      },
      initData() {
        this.records = [];
        this.dialogVisible = false;
      },
      loadData() {
        let loadingInstance = Loading.service({target: '#container'});
        this.initData();
        this.getRecords();
        loadingInstance.close();
      }
    },
    mounted() {
      let loadingInstance = Loading.service({target: '#container'});
      this.initData();
      this.getRecords();
      loadingInstance.close();
    }
  }
</script>

<style scoped>

</style>
