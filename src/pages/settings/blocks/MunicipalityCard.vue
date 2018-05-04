<template>
  <el-card :body-style="{ padding: '0px' }" style="position: relative">
    <div slot="header" class="clearfix">
      <el-button
        style="float: right; padding: 3px 0"
        @click="dialogVisible = true"
        :disabled="Object.values(municipality.translations).filter(e => e === false).length < 1"
        type="text">Ajouter une traduction
      </el-button>
    </div>

    <el-dialog
      :visible.sync="editDialogVisible"
      width="40%"
      title="Modifier la municipalité"
      :before-close="handleEditClose">
      <municipality-form :record="municipality" @submit="updateRecord"/>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      title="Ajouter une traduction"
      :before-close="handleClose">
      <div
        style="text-align: center"
        v-if="Object.values(municipality.translations).filter(e => e === false).length < 1">
        <p>L'object a été traduit dans toutes les langues disponibles</p>
      </div>
      <el-form v-model="langMunicipality" id="municipalityForm">

        <el-form-item label="langue" prop="lang">
          <el-select v-model="langMunicipality.lang" style="width: 100%" placeholder="sélectionner la langue">
            <el-option
              v-for="(value, key) in municipality.translations"
              :key="key"
              v-if="!value"
              :label="key"
              :value="key"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="name" label="name">
          <el-input v-model="langMunicipality.name"/>
        </el-form-item>

        <el-form-item prop="description" label="description" v-model="langMunicipality.description">
          <el-input type="textarea" :rows="3" v-model="langMunicipality.description"/>
        </el-form-item>

        <el-form-item class="margin-top">
          <el-button type="primary" style="width: 100%" @click="addLang">Valider</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <div class="" style="position: relative">
      <img v-if="municipality.miniature" v-bind:src="municipality.miniature" alt="" />
      <img v-else src="/static/no-image.png" alt="no image" />
      <div style="position: absolute; right: 1rem; top: 1rem">
        <el-button
          style="text-transform: uppercase; height: 45px; font-weight: bold"
          v-for="(value, key) in municipality.translations"
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
        <p>{{municipality.name}}</p>
        <p class="note" style="color: #ededed">{{municipality.description}}</p>
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
            @click="deleteMunicipality"
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

  import {Municipality} from "../../../models/locations/Municipality";
  import MunicipalityForm from './MunicipalityForm'

  export default {
    name: "municipality-card",
    props: ['municipalityData'],
    components: {
      MunicipalityForm
    },
    data() {
      return {
        langMunicipality: new Municipality(),
        dialogVisible: false,
        editDialogVisible: false,
        municipality: new Municipality()
      }
    },
    methods: {
      viewRecordDetails() {
        console.log('view details')
      },
      handleEditClose(done) {
        this.municipality = new Municipality(this.municipalityData);
        done();
      },
      formatDate(date) {
        return moment(date).format('L')
      },
      switchLang(lang) {
        (new Municipality()).fetch(this.municipality.id, {lang})
          .then(r => {
            this.municipality = new Municipality(r)
          })
          .catch(e => {
            this.$message.warning('Erreur lors de la lecture des données veuillez rééssayer...');
            console.log(e)
          });
      },
      handleClose(done) {
        this.langMunicipality = new Municipality();
        this.setLangMunicipality();
        done();
      },
      addLang() {
        this.langMunicipality.save()
          .then(() => {
            this.$emit('updated')
          })
      },
      updateRecord() {
        this.$emit('updated')
      },
      deleteMunicipality() {
        let municipality = new Municipality(this.municipality);
        this.$confirm('Voulez-vous supprimer le thème. Continuer?', 'Warning', {
          confirmButtonText: 'Continuer',
          cancelButtonText: 'Annuler',
          type: 'warning'
        }).then(() => {
          municipality.delete()
            .then(() => {
              this.$message.success('Municipalité supprimé avec succès...');
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
      setLangMunicipality() {
        this.langMunicipality.id = this.municipality.id;
        this.langMunicipality.translations = this.municipality.translations;
      }
    },
    mounted() {
      this.municipality = new Municipality(this.municipalityData);
      this.setLangMunicipality();
    }
  }
</script>

<style scoped>
  img {
    width: 100%;
  }
</style>
