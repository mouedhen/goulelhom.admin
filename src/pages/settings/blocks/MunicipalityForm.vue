<template>
  <el-form v-model="record" id="municipalityForm" ref="municipalityForm">

    <el-form-item style="text-align: center">
      <croppa
        v-model="miniature"
        ref="miniature"
        placeholder=""
        prevent-white-space
        :width="300"
        :height="300">
        <img slot="placeholder" v-bind:src="defaultImg"/>
      </croppa>
    </el-form-item>

    <el-form-item prop="name" label="designation">
      <el-input v-model="record.name"/>
    </el-form-item>

    <el-form-item label="Ville" prop="city">
      <el-select v-model="record.city_id" placeholder="Selectionner la ville" style="width: 100%">
        <el-option v-for="city in cities" :key="city.id" :label="city.country.name + ' - ' + city.name" :value="city.id"/>
      </el-select>
    </el-form-item>

    <el-form-item prop="description" label="description">
      <el-input type="textarea" :rows="3" v-model="record.description"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" style="width: 100%" @click="submitRecord">Valider</el-button>
    </el-form-item>

    <el-form-item>
      <el-button type="default" style="width: 100%" @click="resetForm('municipalityForm')">Annuler</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
  import axios from 'axios'
  import {appConfig} from "../../../config/app";
  import {City} from "../../../models/locations/City";

  export default {
    name: "municipality-form",
    props: ['record'],
    data() {
      return {
        miniature: {},
        defaultImg: '/static/no-image.png',
        cities: [],
      }
    },
    mounted() {
      this.miniature.remove();
      this.getCities()
    },
    methods: {
      getCities() {
        (new City()).fetchAll()
          .then(response => {
            this.cities = response.data
          })
      },
      submitRecord() {
        this.record.save()
          .then(response => {
            this.upload(appConfig.apiUrl + 'locations/municipalities/' + response.id + '/upload?collection=miniatures');
          })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.miniature.remove();
        this.$emit('reset');
      },
      upload(url) {
        if (!this.miniature.hasImage()) {
          console.log('no image to upload');
          this.$emit('submit');
          return
        }
        this.miniature.generateBlob((blob) => {
          let data = new FormData();
          data.append('file', blob, this.miniature.chosenFile.name);
          axios.post(url, data)
            .then(r => {
              this.miniature.remove();
              this.$emit('submit')
            })
        })
      }
    },
  }
</script>
