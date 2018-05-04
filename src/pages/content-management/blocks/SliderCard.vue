<template>
  <el-card :body-style="{ padding: '0px' }" style="position: relative">

    <div slot="header" class="clearfix">
      <el-button
        style="float: right; padding: 3px 0"
        @click="dialogVisible = true"
        :disabled="Object.values(slider.translations).filter(e => e === false).length < 1"
        type="text">Ajouter une traduction</el-button>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      title="Ajouter une traduction"
      :before-close="handleClose">

      <div
        style="text-align: center"
        v-if="Object.values(slider.translations).filter(e => e === false).length < 1">
        <p>L'object a été traduit dans toutes les langues disponibles</p>
      </div>
      <el-form
        v-else
        v-model="langSlider">

        <el-form-item label="langue" prop="lang">
          <el-select v-model="langSlider.lang" style="width: 100%" placeholder="sélectionner la langue">
            <el-option
              v-for="(value, key) in slider.translations"
              :key="key"
              v-if="!value"
              :label="key"
              :value="key"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="citation" prop="quote">
          <el-input v-model="langSlider.quote" placeholder="spécifier la citation"/>
        </el-form-item>

        <el-form-item label="auteur" prop="author">
          <el-input v-model="langSlider.author" placeholder="spécifier l'auteur"/>
        </el-form-item>

        <el-form-item>
          <el-button style="width: 100%" type="primary" @click="addLang">Valider</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <div class="img-crop ratio-4-to-3" style="position: relative">
      <img v-if="slider.thumb" v-bind:src="slider.thumb" alt="">
      <img v-else-if="slider.slide" v-bind:src="slider.slide" alt="">
      <div style="position: absolute; right: 1rem; top: 1rem">
        <el-button
          style="text-transform: uppercase; height: 45px; font-weight: bold"
          v-for="(value, key) in slider.translations"
          :key="key"
          v-if="value"
          circle type="info"
          @click="switchLang(key)"
          plain
        >{{key}}
        </el-button>
      </div>
    </div>
    <div
      style="position: absolute; bottom: 0; background: rgba(34, 34, 34, .8); width: 100%; color: #ededed; font-weight: bold">
      <div style="margin: 1rem">
        <p>{{slider.quote}}</p>
        <p class="note" style="color: #ededed">{{slider.author}}</p>
        <div class="align-text-right">
          <el-button
            @click="updateToSelectedRecord"
            type="success"
            icon="el-icon-star-on"
            :disabled="slider.is_selected"
            circle/>
          <el-button
            @click="updateToNotSelectedRecord"
            type="warning"
            icon="el-icon-close"
            :disabled="!slider.is_selected"
            circle/>
          <el-button
            @click="deleteSlider"
            type="danger"
            icon="el-icon-delete"
            circle/>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
  import {Slider} from "../../../models/contents/Slider";

  export default {
    name: "slider-card",
    props: ['sliderData'],
    data() {
      return {
        langSlider: new Slider(),
        dialogVisible: false,
        slider: new Slider()
      }
    },
    methods: {
      switchLang(lang) {
        (new Slider()).fetch(this.slider.id, {lang})
          .then(r => {
            this.slider = r
          })
          .catch(e => {
            this.$message.warning('Erreur lors de la lecture des données veuillez rééssayer...');
            console.log(e)
          });
      },
      handleClose(done) {
        this.langSlider = new Slider();
        this.setLangSlider();
        done();
      },
      addLang() {
        this.langSlider.save()
          .then(() => {
            this.$emit('updated')
          })
      },
      updateToSelectedRecord() {
        let slider = new Slider(this.slider);
        slider.is_selected = true;
        slider.save()
          .then(() => {
            this.$emit('updated')
          })
      },
      updateToNotSelectedRecord() {
        let slider = new Slider(this.slider);
        slider.is_selected = false;
        slider.save()
          .then(() => {
            this.$emit('updated')
          })
      },
      deleteSlider() {
        let slider = new Slider(this.slider);
        slider.is_selected = false;
        this.$confirm('Voulez-vous supprimer le slider. Continuer?', 'Warning', {
          confirmButtonText: 'Continuer',
          cancelButtonText: 'Annuler',
          type: 'warning'
        }).then(() => {
          slider.delete()
            .then(() => {
              this.$message.success('Slider supprimé avec succès...');
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
      setLangSlider() {
        this.langSlider.id = this.slider.id;
        this.langSlider.is_selected = this.slider.is_selected;
        this.langSlider.translations = this.slider.translations;
      }
    },
    mounted() {
      this.slider = this.sliderData
      this.setLangSlider();
    }
  }
</script>

<style scoped>

</style>
