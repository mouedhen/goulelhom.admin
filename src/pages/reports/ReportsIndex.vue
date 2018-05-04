<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>administration</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'reports:index' }">rapports</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose">
      <el-form v-model="report" id="reportForm">

        <el-form-item prop="published_at" label="Date de publication">
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
            v-model="report.published_at" style="width: 100%"/>
        </el-form-item>

        <el-form-item prop="title" label="title">
          <el-input v-model="report.title"/>
        </el-form-item>

        <el-form-item prop="description" label="description" v-model="report.description">
          <el-input type="textarea" :rows="3" v-model="report.description"/>
        </el-form-item>

        <el-form-item prop="period_start_at" label="Période concernée (date de début)">
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
            v-model="report.period_start_at" style="width: 100%"/>
        </el-form-item>

        <el-form-item prop="period_end_at" label="Période concernée (date de fin)">
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
            v-model="report.period_end_at" style="width: 100%"/>
        </el-form-item>

        <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadUrl"
          :headers="headers"
          :file-list="reportDocs"
          :auto-upload="false"
          :multiple="false"
          :on-success="onUploadSuccess"
          :on-error="onUploadError">
          <el-button size="small" type="primary">Attacher le rapport</el-button>
          <div slot="tip" class="el-upload__tip">seul les fichier de type pdf avec une taille maximale de 8Mo sont
            acceptées
          </div>
        </el-upload>

        <el-form-item class="margin-top">
          <el-button type="primary" style="width: 100%" @click="submitRecord">Valider</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <div class="no-reports margin-top" v-if="reports.length < 1">
      <div>
        <p>Aucune rapport n'a été ajouté pour le moment...</p>
        <el-button type="info" plain @click="dialogVisible = true">Ajouter un rapport</el-button>
      </div>
    </div>

    <div v-else>

      <div class="align-text-right">
        <el-button type="primary" @click="dialogVisible = true" icon="el-icon-plus" circle/>
        <el-button type="info" icon="el-icon-question" v-popover:popover1 circle/>
        <el-popover
          ref="popover1"
          width="400"
          trigger="click">
          <div>
            <strong>Aide</strong>
            <p>Vous pouvez dans cette section gérer les rapports trimestriels.</p>
            <div class="margin-top">
              <el-button type="primary" icon="el-icon-plus" circle/>
              Ajouter un élément
            </div>
            <div class="margin-top">
              <el-button type="success" icon="el-icon-view" circle/>
              Lire le rapport
            </div>
            <div class="margin-top">
              <el-button type="warning" icon="el-icon-edit" circle/>
              Modifer le rapport
            </div>
            <div class="margin-top">
              <el-button type="danger" icon="el-icon-delete" circle/>
              Supprimer le rapport
            </div>
          </div>
        </el-popover>
      </div>

      <el-row :gutter="16" type="flex" style="flex-flow: row wrap">
        <el-col :span="8" v-for="r in reports" :key="r.id" class="margin-top">
          <report-card :reportData="r" @updated="loadData"/>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
  import {Loading} from 'element-ui'
  import {Report} from "../../models/metrics/Report";
  import ReportCard from "./blocks/ReportCard";

  export default {
    components: {ReportCard},
    name: "reports-index",
    data() {
      let today = (new Date()).toLocaleDateString();
      return {
        dialogVisible: false,
        page: 1,
        loadMoreReports: false,
        reports: [],
        report: new Report({published_at: today, period_start_at: today, period_end_at: today}),
        reportDocs: [],
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('access-token')},
      }
    },
    computed: {
      uploadUrl: function () {
        return this.report.config.apiUrl + '/' + this.report.id + '/doc'
      }
    },
    methods: {
      initData() {
        let today = (new Date()).toLocaleDateString();
        this.dialogVisible = false;
        this.reports = [];
        this.report = new Report({published_at: today, period_start_at: today, period_end_at: today});
      },
      loadReports(params) {
        (new Report()).fetchAll()
          .then(r => {
            this.reports = this.reports.concat(r.data);
            if (r.links.next !== null) {
              this.loadReports({page: r.meta.current_page + 1})
            }
          })
      },
      loadData() {
        let loadingInstance = Loading.service({target: '#container'});
        this.initData();
        this.loadReports();
        loadingInstance.close();
      },
      handleClose(done) {
        this.report = new Report();
        if (this.$refs.upload !== null) {
          this.$refs.upload.clearFiles();
        }
        done();
      },
      checkFile(file) {
        return file.raw.type === 'application/pdf';
      },
      resetUpload() {
        this.$refs.upload.clearFiles();
        this.initData();
      },
      onUploadError() {
        this.$message.error('Une erreur est survenue, merci de réessayer...');
        this.report.delete()
          .catch(e => {
            console.log(e)
          })
      },
      onUploadSuccess() {
        this.resetUpload();
        this.loadData();
        this.$message.success('Rapport ajouté avec succès...')
      },
      submitRecord() {
        let loadingInstance = Loading.service({target: '#reportForm'});
        this.report.save()
          .then(r => {
            this.$refs.upload.submit();
            loadingInstance.close();
          })
          .catch(e => {
            console.log(e);
            loadingInstance.close();
          });
      },
    },
    mounted() {
      this.loadData();
    }
  }
</script>


<style lang="scss" scoped>
  .no-reports {
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

