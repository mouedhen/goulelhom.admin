<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>configuration</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'settings:themes' }">municipalités</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      title="Ajouter un thème"
      :before-close="handleClose">
      <municipality-form :record="record" @submit="loadData"/>
    </el-dialog>

    <div class="align-text-right">
      <el-button type="primary" @click="dialogVisible = true" icon="el-icon-plus" circle/>
      <el-button type="info" icon="el-icon-question" v-popover:popover1 circle/>
      <el-popover
        ref="popover1"
        width="400"
        trigger="click">
        <div>
          <strong>Aide</strong>
          <p>Vous pouvez dans cette section gérer les municipalités.</p>
          <div class="margin-top">
            <el-button type="primary" icon="el-icon-plus" circle/>
            Ajouter une municipalité
          </div>
          <div class="margin-top">
            <el-button type="success" icon="el-icon-view" circle/>
            Détails de la municipalité
          </div>
          <div class="margin-top">
            <el-button type="warning" icon="el-icon-edit" circle/>
            Modifer la municipalité
          </div>
          <div class="margin-top">
            <el-button type="danger" icon="el-icon-delete" circle/>
            Supprimer la municipalité
            <p class="note">En supprimant une municipalité, toutes les plaintes, les pétitions... qui lui sont associées seront
              supprimées de façon définitive...</p>
          </div>
        </div>
      </el-popover>
    </div>

    <el-row :gutter="12">
      <el-col :span="8" v-for="r in records" :key="r.id" class="margin-top">
        <municipality-card :municipalityData="r" @updated="loadData"/>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {Loading} from 'element-ui'
  import {Municipality} from "../../models/locations/Municipality";
  import MunicipalityCard from "./blocks/MunicipalityCard";
  import MunicipalityForm from "./blocks/MunicipalityForm";

  export default {
    components: {
      MunicipalityForm,
      MunicipalityCard
    },
    name: "municipalities-index",
    data() {
      return {
        records: [],
        dialogVisible: false,
        record: new Municipality(),
      }
    },
    methods: {
      initData() {
        this.records = [];
        this.record = new Municipality();
        this.dialogVisible = false;
      },
      getRecords(params) {
        (new Municipality()).fetchAll()
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
      loadData() {
        let loadingInstance = Loading.service({target: '#container'});
        this.initData();
        this.getRecords();
        loadingInstance.close();
      },
      handleClose(done) {
        this.record = new Municipality();
        done();
      },
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
