<template>
  <el-card class="margin-top">
    <div slot="header" class="align-text-center">
      <b v-bind:style="{color: complaint.theme.color}">{{complaint.subject}}</b><br>
      <i><small>{{complaint.theme.name}}</small></i> -
      <i><small>{{complaint.municipality.name}}</small></i><br>
      <span class="note">{{complaint.contact.name}}</span><br>
      <span class="note">{{formatDate(complaint.created_at)}}</span>
    </div>
    <div>
      <p style="text-align: center; margin-top: 0">{{complaint.description}}</p>
      <div>
        <l-map ref="map" style="height: 200px" :zoom="zoom" :center="center" :options="{scrollWheelZoom: false}">
          <l-tile-layer :url="url" :attribution="attribution"/>
          <l-marker :lat-lng="marker"/>
          <l-circle :lat-lng="marker" :radius="200"/>
        </l-map>
      </div>

      <div class="margin-top">
        <img
          style="max-height: 200px; margin-right: 1rem"
          v-for="image in complaint.attachments"
          :key="image.id"
          :src="image.url"
          :alt="image.name"
          v-img="{group: complaint.id}"
        />
      </div>

    </div>
  </el-card>
</template>

<script>

  import moment from 'moment'
  import 'moment/locale/fr';

  moment.locale('fr');

  import {LMap, LTileLayer, LMarker, LCircle} from 'vue2-leaflet'

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
    },
    data() {
      return {
        zoom: 15,
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
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
      formatDate(date) {
        return moment(date).format('LLLL')
      },
    }
  }
</script>
