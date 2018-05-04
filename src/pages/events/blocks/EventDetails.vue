<template>
  <div class="wrapper">

    <el-dialog
      :visible.sync="dialogVisible">
      <el-form v-model="langEvent">
        <el-form-item label="langue" prop="lang">
          <el-select v-model="langEvent.lang" style="width: 100%" placeholder="sélectionner la langue">
            <el-option
              v-for="(value, key) in event.translations"
              :key="key"
              v-if="!value"
              :label="key"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Titre">
          <el-input v-model="langEvent.title"/>
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="langEvent.description" type="textarea"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="addLang" type="primary">Valider</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div style="text-align: right">
      <el-button
        @click="dialogVisible = true"
        :disabled="Object.values(event.translations).filter(e => e === false).length < 1"
        type="text">Ajouter une traduction
      </el-button>
    </div>
    <div>
      <h4 class="">{{event.title}}</h4>
      <p class="note align-text-right">{{formatDate(event.date)}}</p>
      <p class="desc" style="text-align: justify">{{event.desc}}</p>
    </div>
    <div class="clearfix margin-top">
      <div style="float: left">
        <el-button
          style="text-transform: uppercase; height: 45px; font-weight: bold"
          v-for="(value, key) in event.translations"
          :key="key"
          v-if="value"
          circle type="info"
          @click="switchLang(key)"
        >{{key}}
        </el-button>
      </div>

      <div style="float: right">
        <el-button
          @click="editEvent"
          type="warning"
          icon="el-icon-edit"
          circle/>
        <el-button
          @click="deleteEvent"
          type="danger"
          icon="el-icon-delete"
          circle/>
      </div>

    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import 'moment/locale/fr';
  import {Event} from "../../../models/posts/Event";

  moment.locale('fr');

  export default {
    name: "event-details",
    props: ['event'],
    data() {
      return {
        langEvent: new Event(),
        dialogVisible: false,
      }
    },
    methods: {
      formatDate(date) {
        return moment(date, 'YYYY-MM-DD').format('LL')
      },
      switchLang(lang) {
        this.event.fetch(this.event.id, {lang})
          .then(r => {
            this.event = r
          })
          .catch(e => {
            this.$message.warning('Erreur lors de la lecture des données veuillez rééssayer...');
            console.log(e)
          });
      },
      editEvent() {
        this.$emit('edit', this.event)
      },
      addLang() {
        this.langEvent.save()
          .then(() => {
            this.$message.success('Evènement supprimé avec succès...');
            this.$emit('updated')
          })
          .catch(e => {
            this.$message.error('Une erreur inattendue est survenue, merci de rééssayer ou de contacter votre administrateur...');
            console.log(e)
          })
      },
      deleteEvent() {
        let event = new Event(this.event);
        this.$confirm('Voulez-vous supprimer l\'évènement. Continuer?', 'Warning', {
          confirmButtonText: 'Continuer',
          cancelButtonText: 'Annuler',
          type: 'warning'
        }).then(() => {
          this.event.delete()
            .then(() => {
              this.$message.success('Evènement supprimé avec succès...');
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
      }
    },
    mounted() {
      this.langEvent.id = this.event.id;
      this.langEvent.translations = this.event.translations
    }
  }
</script>

<style scoped>

</style>
