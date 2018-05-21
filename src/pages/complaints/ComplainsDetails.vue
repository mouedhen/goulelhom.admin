<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'complaints:dashboard' }">plaintes</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'complaints:list' }">historique</el-breadcrumb-item>
      <el-breadcrumb-item>détails</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="margin-top">
      <el-row :gutter="16">
        <el-col :span="18">
          <div>
            <h2 class="title">{{complaint.subject}}</h2>
          </div>
          <div class="align-text-right">
            <p class="note">{{formatDate(complaint.created_at)}}</p>
          </div>
          <div>
            <l-map ref="map" style="height: 300px" :zoom="zoom" :center="center" :options="{scrollWheelZoom: false}">
              <l-tile-layer :url="url" :attribution="attribution"/>
              <l-marker :lat-lng="marker"/>
              <l-circle :lat-lng="marker" :radius="200"/>
            </l-map>
            <el-row class="margin-top">
              <el-col :span="12">
                <p class="note" v-if="complaint.municipality">{{complaint.municipality.name}}</p>
                <p class="note" v-if="complaint.theme">{{complaint.theme.name}}</p></el-col>
              <el-col :span="12">
                <div class="align-text-right">
                  <div v-if="complaint.is_valid">
                    <el-button
                      type="success"
                      icon="el-icon-check"
                      :disabled="!complaint.is_valid"
                      @click="invalidateComplaints(complaint)"
                    >valide
                    </el-button>
                  </div>
                  <div v-else>
                    <el-button
                      type="warning"
                      @click="validateComplaints(complaint)"
                      icon="el-icon-close"
                      :disabled="complaint.is_valid"
                    >non valide
                    </el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
            <p>{{complaint.description}}</p>
          </div>

          <div class="margin-top">
            <swiper :options="swiperOption" ref="complaintSwiper">
              <swiper-slide
                style="width: auto"
                v-for="(image, index) in complaint.attachments"
                :key="image.id"
              >
                <img
                  height="200"
                  :src="image.url"
                  :alt="image.name"
                  v-img="{group: complaint.id}"
                />
              </swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
          </div>

        </el-col>
        <el-col :span="6" v-if="complaint.contact">
          <el-dialog :visible.sync="contactFormDialogVisible">
            <el-form>
              <el-form-item label="Nom & Prénom">
                <el-input v-model="contact.name"/>
              </el-form-item>
              <el-form-item label="Téléphone">
                <el-input v-model="contact.phone_number"/>
              </el-form-item>
              <el-form-item label="Email">
                <el-input v-model="contact.email"/>
              </el-form-item>
              <el-form-item label="address">
                <el-input type="textarea" v-model="contact.address"/>
              </el-form-item>
              <el-form-item>
                <el-button @click="submitContact">sauvegarder</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <h3>Infos contact</h3>
          <dl class="contact-infos">
            <dt>Nom & Prénom</dt>
            <dd>{{complaint.contact.name}}</dd>
            <dt>Tel.</dt>
            <dd v-if="complaint.contact.phone_number">{{complaint.contact.phone_number}}</dd>
            <dd v-else>-</dd>
            <dt>Email</dt>
            <dd v-if="complaint.contact.email">{{complaint.contact.email}}</dd>
            <dd v-else>-</dd>
            <dt>Adresse</dt>
            <dd v-if="complaint.contact.address">{{complaint.contact.address}}</dd>
            <dd v-else>-</dd>
          </dl>
          <div class="align-text-right">
            <el-button type="primary" plain icon="el-icon-edit" @click="initContactForm"/>
          </div>
          <div class="margin-top">
            <hr>
            <h4>Ajouter des images</h4>

            <el-upload
              ref="upload"
              :headers="headers"
              :auto-upload="false"
              :action="uploadUrl"
              :on-success="onUploadSuccess"
              :on-error="onUploadError"
              :on-remove="handleRemove"
              list-type="picture">
              <el-button size="small" plain type="primary">Ajouter des images</el-button>
            </el-upload>
            <!--
            <el-upload
              ref="upload"
              :action="uploadUrl"
              :headers="headers"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :auto-upload="false"
              :on-success="onUploadSuccess"
              :on-error="onUploadError"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          -->
          </div>
          <div class="margin-top">
            <el-button size="small" plain type="success" @click="submitUpload">Soumettre les images</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>
<script>
  import moment from 'moment'
  import 'moment/locale/fr';

  moment.locale('fr');

  import {Loading} from 'element-ui';
  import {LMap, LTileLayer, LMarker, LCircle} from 'vue2-leaflet'

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  import {Complaint} from "../../models/complaints/Complaint";
  import {appConfig} from "../../config/app";
  import {Contact} from "../../models/contacts/Contact";

  export default {
    name: "complaints-details",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LCircle,
    },
    data() {
      return {
        complaint: new Complaint(),
        contact: new Contact(),
        zoom: 15,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('access-token')},
        dialogImageUrl: '',
        dialogVisible: false,
        contactFormDialogVisible: false,
        swiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 16,
          centeredSlides: true,
          keyboard: {
            enabled: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          pagination: {
            el: '.swiper-pagination',
            dynamicBullets: true,
            clickable: true,
          },
        },
      }
    },
    computed: {
      marker: function () {
        if (this.complaint.latitude !== null && this.complaint.longitude !== null) {
          return L.latLng(this.complaint.latitude, this.complaint.longitude);
        }
        return L.latLng(36.81897, 10.16579)
      },
      center: function () {
        if (this.complaint.latitude !== null && this.complaint.longitude !== null) {
          return L.latLng(this.complaint.latitude, this.complaint.longitude);
        }
        return L.latLng(36.81897, 10.16579)
      },
      uploadUrl: function () {
        return `${appConfig.apiUrl}complains/complains/${this.complaint.id}/upload`
      },
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    methods: {
      initContactForm() {
        this.contact = new Contact(this.complaint.contact);
        this.contactFormDialogVisible = true;
      },
      submitContact() {
        let loadingInstance = Loading.service({target: '#container'});
        this.contact.save()
          .then(r => {
            this.complaint.contact = r;
            this.contactFormDialogVisible = false;
            loadingInstance.close();
            this.$message.success('Modifications sauvegardées avec succès...');
          })
          .catch(e => {
            loadingInstance.close();
            this.$message.error('Erreur lors de la lecture des données, merci de réssayer...');
            console.log(e)
          })
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      resetUpload() {
        this.$refs.upload.clearFiles();
      },
      onUploadError() {
        this.$message.error('Une erreur est survenue, merci de réessayer...');
      },
      onUploadSuccess() {
        this.resetUpload();
        this.initData();
        this.loadData();
        this.$message.success('Image ajoutée avec succès...')
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      formatDate(date) {
        return moment(date).format('LLLL')
      },
      initData() {
        this.complaints = new Complaint()
      },
      async loadData() {
        let loadingInstance = Loading.service({target: '#container'});
        this.complaint.fetch(this.$route.params.id, {lang: 'fr'})
          .then(r => {
            loadingInstance.close();
          })
          .catch(e => {
            loadingInstance.close();
            this.$message.error('Erreur lors de la lecture des données, merci de réssayer...');
            console.log(e)
          })
      },
      invalidateComplaints(data) {
        let loadingInstance = Loading.service({target: '#container'});
        let c = new Complaint(data);
        c.is_valid = false;
        c.save().then(r => {
          loadingInstance.close();
          data.is_valid = false;
        })
          .catch(e => {
            loadingInstance.close();
            this.$message.error('Erreur lors de la lecture des données, merci de réssayer...');
            console.log(e)
          })
      },
      validateComplaints(data) {
        let loadingInstance = Loading.service({target: '#container'});
        let c = new Complaint(data);
        c.is_valid = true;
        c.save().then(r => {
          loadingInstance.close();
          data.is_valid = true;
        })
          .catch(e => {
            loadingInstance.close();
            this.$message.error('Erreur lors de la lecture des données, merci de réssayer...');
            console.log(e)
          })
      },
    },
    mounted() {
      this.initData();
      this.loadData();
    }
  }
</script>
