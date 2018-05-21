<template>
  <el-card class="margin-top">
    <div slot="header" class="align-text-center">
      <router-link :to="{name: 'complaints:details', params: {id: complaint.id}}">
        <b v-bind:style="{color: complaint.theme.color}">{{complaint.subject}}</b><br>
      </router-link>
      <i>
        <small>{{complaint.theme.name}}</small>
      </i> -
      <i>
        <small>{{complaint.municipality.name}}</small>
      </i><br>
      <span class="note">{{complaint.contact.name}}</span><br>
      <span class="note">{{formatDate(complaint.created_at)}}</span>
    </div>
    <div>
      <div style="text-align: right; margin-top: -40px">
        <div v-if="complaint.is_valid">
          <el-button
            type="success"
            icon="el-icon-check"
            :disabled="!complaint.is_valid"
            @click="invalidateComplaints(complaint)"
            size="mini"
            circle
          />
        </div>
        <div v-else>
          <el-button
            type="warning"
            @click="validateComplaints(complaint)"
            icon="el-icon-close"
            :disabled="complaint.is_valid"
            size="mini"
            circle
          />
        </div>
      </div>
      <p style="text-align: center; margin-top: 0">{{complaint.description}}</p>
      <el-row :gutter="8">
        <el-col :span="(complaint.attachments.length > 0 ? 12 : 24 )">
          <div>
            <l-map ref="map" style="height: 200px" :zoom="zoom" :center="center" :options="{scrollWheelZoom: false}">
              <l-tile-layer :url="url" :attribution="attribution"/>
              <l-marker :lat-lng="marker"/>
              <l-circle :lat-lng="marker" :radius="200"/>
            </l-map>
          </div>
        </el-col>
        <el-col :span="12">
          <div>
            <swiper :options="swiperOption">
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
      </el-row>
      <!--
      <el-row class="margin-top" :gutter="8">
        <el-col :span="6" class="img-crop ratio-4-to-3"
                v-for="(image, index) in complaint.attachments"
                :key="image.id"
                :style="{display: (index < 3 ? null : 'none')}"
        >
          <img class="element"
               :src="image.url"
               :alt="image.name"
               v-img="{group: complaint.id}"
          />
        </el-col>
      </el-row> -->
    </div>
  </el-card>
</template>

<script>

  import {Complaint} from "../../../models/complaints/Complaint";
  import moment from 'moment'
  import 'moment/locale/fr';

  moment.locale('fr');

  import {LMap, LTileLayer, LMarker, LCircle} from 'vue2-leaflet'
  import 'swiper/dist/css/swiper.css'

  import {swiper, swiperSlide} from 'vue-awesome-swiper'

  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  export default {
    name: "complaint-card",
    props: ['complaint'],
    components: {
      LMap,
      LTileLayer,
      LMarker,
      LCircle,
      swiper,
      swiperSlide,
    },
    data() {
      return {
        zoom: 15,
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        swiperOption: {
          slidesPerView: 'auto',
          spaceBetween: 16,
          centeredSlides: true,
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
    },
    mounted() {
      // console.log(this.images)
    },
    methods: {
      invalidateComplaints(data) {
        let c = new Complaint(data);
        c.is_valid = false;
        c.save().then(r => {
          data.is_valid = false;
        });
      },
      validateComplaints(data) {
        let c = new Complaint(data);
        c.is_valid = true;
        c.save().then(r => {
          data.is_valid = true;
        });
      },
      formatDate(date) {
        return moment(date).format('LLLL')
      },
    }
  }
</script>
