<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>administration</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'events:index' }">évènements</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      top="5vh"
      :before-close="handleClose">
      <el-form v-model="event">
        <el-form-item prop="title" label="titre">
          <el-input v-model="event.title"/>
        </el-form-item>
        <el-form-item prop="description" label="description">
          <el-input type="textarea" :rows="4" v-model="event.description"/>
        </el-form-item>
        <el-form-item prop="start_date" label="date de début">
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
            v-model="event.start_date" style="width: 100%"/>
        </el-form-item>
        <el-form-item prop="end_date" label="date de fin">
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="dd-MM-yyyy"
            v-model="event.end_date" style="width: 100%"/>
        </el-form-item>
        <el-form-item prop="longitude" label="longitude" disabled>
          <el-input v-model="event.longitude" disabled/>
        </el-form-item>
        <el-form-item prop="latitude" label="latitude">
          <el-input v-model="event.latitude" disabled/>
        </el-form-item>
        <el-form-item>
          <l-map ref="map" style="height: 300px" :zoom="zoom" :center="center" @click="setPosition">
            <l-tile-layer :url="url" :attribution="attribution"/>
            <l-marker :lat-lng="marker"/>
          </l-map>
        </el-form-item>
        <el-form-item class="margin-top">
          <el-button type="primary" style="width: 100%" @click="saveEvent">Valider</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="align-text-right">
      <el-button type="primary" @click="dialogVisible = true" icon="el-icon-plus" circle/>
      <el-button type="info" icon="el-icon-question" v-popover:popover1 circle/>
      <el-popover
        ref="popover1"
        width="400"
        trigger="click">
        <div>
          <strong>Aide</strong>
          <p>Vous pouvez dans cette section ajouter les évènements organisés par l'organisation.</p>
          <p class="note">Tous les types de documents sont acceptés. La taille des documents doit être inférieures a
            8Mo.</p>
          <div class="margin-top">
            <el-button type="primary" icon="el-icon-plus" circle/>
            Ajouter un élément
          </div>
          <div class="margin-top">
            <el-button type="success" icon="el-icon-view" circle/>
            Voir les détails
          </div>
          <div class="margin-top">
            <el-button type="warning" icon="el-icon-edit" circle/>
            Modifier l'élément
          </div>
          <div class="margin-top">
            <el-button type="danger" icon="el-icon-delete" circle/>
            Supprimer la élément
          </div>
        </div>
      </el-popover>
    </div>
    <div class="margin-top">
      <vue-event-calendar
        :events="events"
        @day-changed="handleDayChanged"
        @month-changed="handleMonthChanged"
      >
        <template slot-scope="props">
          <div v-if="props.showEvents.length < 1">
            <div class="wrapper">
              <div class="event-item align-text-center" style="padding: 1rem">
                <p>Aucun évènements pour le mois sélectionné</p>
              </div>
            </div>
          </div>
          <div v-else v-for="event in props.showEvents" class="event-item">
            <event-details :event="event" @updated="loadData" @edit="editEvent"/>
          </div>
        </template>
      </vue-event-calendar>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import 'moment/locale/fr';

  moment.locale('fr');

  import {Loading} from 'element-ui'
  import {Event} from '../../models/posts/Event'
  import EventDetails from './blocks/EventDetails'
  import {LMap, LTileLayer, LMarker} from 'vue2-leaflet'

  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  export default {
    name: "events-index",
    components: {
      LMap,
      LTileLayer,
      LMarker,
      EventDetails,
    },
    data() {
      let today = (new Date()).toLocaleDateString();
      return {
        events: [],
        event: new Event({start_date: today, end_date: today}),
        dialogVisible: false,
        zoom: 13,
        center: L.latLng(36.81897, 10.16579),
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        marker: L.latLng(36.81897, 10.16579),
      }
    },
    methods: {
      editEvent(data) {
        console.log(data)
        this.event = data;
        this.dialogVisible = true;
        if (data.latitude && data.longitude) {
          this.center = L.latLng(data.latitude, data.longitude);
          this.marker = L.latLng(data.latitude, data.longitude);
        }
      },
      setPosition(data) {
        let map = this.$refs.map.mapObject;
        this.marker = data.latlng;
        this.event.latitude = data.latlng.lat;
        this.event.longitude = data.latlng.lng;
        map.flyTo(data.latlng);
      },
      handleDayChanged(data) {
        console.log('date-changed', data)
      },
      handleMonthChanged(data) {
        let loadingInstance = Loading.service({
          target: '.cal-events',
          background: 'rgba(242, 149, 67, 0.7)'
        });
        this.events = [];
        let date = data.split('/');
        let month = date[0];
        let year = date[1];
        this.loadEvents({year, month});
        loadingInstance.close();
      },
      formatDate(date) {
        return moment(date, 'YYYY-MM-DD').format('LL')
      },
      handleClose(done) {
        let today = (new Date()).toLocaleDateString();
        this.event = new Event({start_date: today, end_date: today});
        this.center = L.latLng(36.81897, 10.16579);
        this.marker = L.latLng(36.81897, 10.16579);
        done();
      },
      initData() {
        let today = (new Date()).toLocaleDateString();
        this.events = [];
        this.event = new Event({start_date: today, end_date: today});
        this.dialogVisible = false;
        this.center = L.latLng(36.81897, 10.16579);
        this.marker = L.latLng(36.81897, 10.16579);
      },
      loadEvents(params) {
        (new Event()).fetchAll(params)
          .then(r => {
            this.events = this.events.concat(r.data.map(e => new Event(e)));
            if (r.links.next !== null) {
              this.loadEvents({...params, page: r.meta.current_page + 1})
            }
          })
      },
      loadData() {
        let loadingInstance = Loading.service({target: '#container'});
        let today = new Date();
        this.initData();
        this.loadEvents({year: today.getFullYear(), month: today.getMonth() + 1});
        loadingInstance.close();
      },
      saveEvent() {
        this.event.save()
          .then(r => {
            this.loadData({})
          })
          .catch(e => {
            this.$message.error('Merci de vérifier vos paramètres...')
            console.log(e)
          })
      }
    },
    mounted() {
      this.loadData();
    }
  }
</script>

<style scoped>

</style>
