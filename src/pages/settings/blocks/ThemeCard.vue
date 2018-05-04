<template>
  <el-card :body-style="{ padding: '0px' }" style="position: relative">
    <div slot="header" class="clearfix">
      <el-button
        style="float: right; padding: 3px 0"
        @click="dialogVisible = true"
        :disabled="Object.values(theme.translations).filter(e => e === false).length < 1"
        type="text">Ajouter une traduction
      </el-button>
    </div>

    <el-dialog
      :visible.sync="editDialogVisible"
      width="40%"
      title="Modifier le thème"
      :before-close="handleEditClose">
      <theme-form :record="theme" @submit="updateRecord"/>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      title="Ajouter une traduction"
      :before-close="handleClose">
      <div
        style="text-align: center"
        v-if="Object.values(theme.translations).filter(e => e === false).length < 1">
        <p>L'object a été traduit dans toutes les langues disponibles</p>
      </div>
      <el-form v-model="langTheme" id="themeForm">

        <el-form-item label="langue" prop="lang">
          <el-select v-model="langTheme.lang" style="width: 100%" placeholder="sélectionner la langue">
            <el-option
              v-for="(value, key) in theme.translations"
              :key="key"
              v-if="!value"
              :label="key"
              :value="key"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="name" label="name">
          <el-input v-model="langTheme.name"/>
        </el-form-item>

        <el-form-item prop="description" label="description" v-model="langTheme.description">
          <el-input type="textarea" :rows="3" v-model="langTheme.description"/>
        </el-form-item>

        <el-form-item class="margin-top">
          <el-button type="primary" style="width: 100%" @click="addLang">Valider</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <div class="" style="position: relative">
      <img v-if="theme.miniature" v-bind:src="theme.miniature" alt="" />
      <img v-else src="/static/no-image.png" alt="no image" />
      <div style="position: absolute; right: 1rem; top: 1rem">
        <el-button
          style="text-transform: uppercase; height: 45px; font-weight: bold"
          v-for="(value, key) in theme.translations"
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
        <p>{{theme.name}}</p>
        <p class="note" style="color: #ededed">{{theme.description}}</p>
        <div class="align-text-right">
          <el-button
            @click="viewRecordDetails"
            type="success"
            icon="el-icon-view"
            circle/>
          <el-button
            @click="editDialogVisible = true"
            type="warning"
            icon="el-icon-edit"
            circle/>
          <el-button
            @click="deleteTheme"
            type="danger"
            icon="el-icon-delete"
            circle/>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
  import moment from 'moment'
  import 'moment/locale/fr';

  moment.locale('fr');

  import {Theme} from "../../../models/metrics/Theme";
  import ThemeForm from './ThemeForm'

  export default {
    name: "theme-card",
    props: ['themeData'],
    components: {
      ThemeForm
    },
    data() {
      return {
        langTheme: new Theme(),
        dialogVisible: false,
        editDialogVisible: false,
        theme: new Theme()
      }
    },
    methods: {
      viewRecordDetails() {
        console.log('view details')
      },
      handleEditClose(done) {
        this.theme = new Theme(this.themeData);
        done();
      },
      formatDate(date) {
        return moment(date).format('L')
      },
      switchLang(lang) {
        (new Theme()).fetch(this.theme.id, {lang})
          .then(r => {
            this.theme = new Theme(r)
          })
          .catch(e => {
            this.$message.warning('Erreur lors de la lecture des données veuillez rééssayer...');
            console.log(e)
          });
      },
      handleClose(done) {
        this.langTheme = new Theme();
        this.setLangTheme();
        done();
      },
      addLang() {
        this.langTheme.save()
          .then(() => {
            this.$emit('updated')
          })
      },
      updateRecord() {
        this.$emit('updated')
      },
      deleteTheme() {
        let theme = new Theme(this.theme);
        this.$confirm('Voulez-vous supprimer le thème. Continuer?', 'Warning', {
          confirmButtonText: 'Continuer',
          cancelButtonText: 'Annuler',
          type: 'warning'
        }).then(() => {
          theme.delete()
            .then(() => {
              this.$message.success('Thème supprimé avec succès...');
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
      setLangTheme() {
        this.langTheme.id = this.theme.id;
        this.langTheme.translations = this.theme.translations;
      }
    },
    mounted() {
      this.theme = new Theme(this.themeData);
      this.setLangTheme();
    }
  }
</script>

<style scoped>
  img {
    width: 100%;
  }
</style>
