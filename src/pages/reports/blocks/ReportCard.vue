<template>
  <el-card :body-style="{ padding: '0px' }" style="position: relative">

    <div slot="header" class="clearfix">
      <el-button
        style="float: right; padding: 3px 0"
        @click="dialogVisible = true"
        :disabled="Object.values(report.translations).filter(e => e === false).length < 1"
        type="text">Ajouter une traduction
      </el-button>
    </div>

    <el-dialog
      :visible.sync="editDialogVisible"
      width="40%"
      :before-close="handleEditClose">
      <el-form v-model="report" id="reportEditForm">

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
          :on-remove="removeDocument"
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

    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      title="Ajouter une traduction"
      :before-close="handleClose">
      <div
        style="text-align: center"
        v-if="Object.values(report.translations).filter(e => e === false).length < 1">
        <p>L'object a été traduit dans toutes les langues disponibles</p>
      </div>
      <el-form v-model="langReport" id="reportForm">

        <el-form-item label="langue" prop="lang">
          <el-select v-model="langReport.lang" style="width: 100%" placeholder="sélectionner la langue">
            <el-option
              v-for="(value, key) in report.translations"
              :key="key"
              v-if="!value"
              :label="key"
              :value="key"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="title" label="title">
          <el-input v-model="langReport.title"/>
        </el-form-item>

        <el-form-item prop="description" label="description" v-model="langReport.description">
          <el-input type="textarea" :rows="3" v-model="langReport.description"/>
        </el-form-item>

        <el-form-item class="margin-top">
          <el-button type="primary" style="width: 100%" @click="addLang">Valider</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <el-dialog
      :title="report.title"
      :visible.sync="readerVisible"
      style="padding: 0 !important;"
      center
      top="5vh"
      lock-scroll
      width="60%">
      <pdf :url="report.document" height="70vh"/>
    </el-dialog>

    <div class="" style="position: relative">
      <img v-if="report.thumb" v-bind:src="report.thumb" alt="">
      <pdf v-else-if="report.document"  :url="report.document" height="500px"/>
      <img v-else src="/static/no-image.png" alt="no image" />
      <div style="position: absolute; right: 1rem; top: 1rem">
        <el-button
          style="text-transform: uppercase; height: 45px; font-weight: bold"
          v-for="(value, key) in report.translations"
          :key="key"
          v-if="value"
          circle type="info"
          @click="switchLang(key)"
        >{{key}}
        </el-button>
      </div>
    </div>
    <div
      style="position: absolute; bottom: 0; background: rgba(34, 34, 34, .8); width: 100%; color: #ededed; font-weight: bold">
      <div style="margin: 1rem">
        <p>{{report.title}}</p>
        <p class="note" style="color: #ededed">{{report.description}}</p>
        <dl class="note align-text-right" style="color: #a2a2a2">
          <dt>Date de publication</dt>
          <dd>{{formatDate(report.published_at)}}</dd>
          <dt>Période concernée</dt>
          <dd>{{formatDate(report.period_start_at)}} - {{formatDate(report.period_end_at)}}</dd>
        </dl>
        <div class="align-text-right">
          <el-button
            @click="readerVisible = true"
            type="success"
            icon="el-icon-view"
            circle/>
          <el-button
            @click="editDialogVisible = true"
            type="warning"
            icon="el-icon-edit"
            circle/>
          <el-button
            @click="deleteReport"
            type="danger"
            icon="el-icon-delete"
            circle/>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
  import {Loading} from 'element-ui'
  import moment from 'moment'
  import 'moment/locale/fr';

  import axios from 'axios'

  moment.locale('fr');

  import {Report} from "../../../models/metrics/Report";
  import PDFObject from 'pdfobject'

  window.PDFObject = PDFObject;
  import pdf from 'vue-instant-pdf-viewer'
  import {appConfig} from "../../../config/app";

  export default {
    name: "report-card",
    components: {pdf},
    props: ['reportData'],
    data() {
      return {
        langReport: new Report(),
        dialogVisible: false,
        readerVisible: false,
        editDialogVisible: false,
        reportDocs: [],
        report: new Report(),
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('access-token')},
      }
    },
    computed: {
      uploadUrl: function () {
        return this.report.config.apiUrl + '/' + this.report.id + '/doc'
      }
    },
    methods: {
      formatDate(date) {
        return moment(date).format('L')
      },
      switchLang(lang) {
        (new Report()).fetch(this.report.id, {lang})
          .then(r => {
            this.report = new Report(r)
          })
          .catch(e => {
            this.$message.warning('Erreur lors de la lecture des données veuillez rééssayer...');
            console.log(e)
          });
      },
      handleClose(done) {
        this.langReport = new Report();
        this.setLangReport();
        done();
      },
      addLang() {
        this.langReport.save()
          .then(() => {
            this.$emit('updated')
          })
      },
      deleteReport() {
        let report = new Report(this.report);
        this.$confirm('Voulez-vous supprimer le raport. Continuer?', 'Warning', {
          confirmButtonText: 'Continuer',
          cancelButtonText: 'Annuler',
          type: 'warning'
        }).then(() => {
          report.delete()
            .then(() => {
              this.$message.success('Raport supprimé avec succès...');
              this.$emit('updated')
            })
            .catch(e => {
              this.$message.error('Une erreur inattendue est survenue, merci de rééssayer ou de contacter votre administrateur...');
              console.log(e)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Suppression annulée...'
          })
        });
      },
      setLangReport() {
        this.langReport.id = this.report.id;
        this.langReport.translations = this.report.translations;
      },

      handleEditClose(done) {
        this.report = new Report(this.reportData);
        done();
      },
      checkFile(file) {
        return file.raw.type === 'application/pdf';
      },
      onUploadError() {
        this.$message.error('Une erreur est survenue, merci de réessayer...');
        this.report.delete()
          .catch(e => {
            console.log(e)
          })
      },
      onUploadSuccess() {
        this.$message.success('Rapport ajouté avec succès...');
      },
      removeDocument(file, fileList) {
        axios.delete(appConfig.apiUrl + 'metrics/reports/' + this.reportData.id + '/doc/' + file.id)
      },
      submitRecord() {
        let loadingInstance = Loading.service({target: '#reportForm'});
        this.report.save()
          .then(r => {
            this.$refs.upload.submit();
            this.$emit('updated');
            loadingInstance.close();
          })
          .catch(e => {
            console.log(e);
            loadingInstance.close();
          });
      },
    },
    mounted() {
      this.report = new Report(this.reportData);
      this.reportDocs = this.reportData.attachments
      this.setLangReport();
    }
  }
</script>

<style scoped>
  img {
    width: 100%;
  }
</style>
