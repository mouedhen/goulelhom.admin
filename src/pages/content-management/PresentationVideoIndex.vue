<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>administration</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'content-management:index' }">gestion du contenu</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'content-management:presentation-video' }">vidéo de présentation
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="margin-top">

      <el-dialog
        :visible.sync="dialogVisible"
        width="50%"
        :before-close="handleClose">
        <div>
          <el-form v-model="presentationVideo">

            <el-form-item label="Titre">
              <el-input v-model="presentationVideo.name" placeholder="merci de spécifier le titre de la vidéo"/>
            </el-form-item>

            <el-form-item label="URL">
              <el-input type="url" v-model="presentationVideo.url" placeholder="merci de spécifier l'url de la vidéo"/>
            </el-form-item>

            <el-form-item label="Sélectionner comme video de présentation">
              <el-switch v-model="presentationVideo.is_selected"/>
            </el-form-item>

            <el-form-item>
              <el-button style="width: 100%" type="primary" @click="saveVideo">Valider</el-button>
            </el-form-item>

          </el-form>

          <youtube v-if="videoID"
                   :video-id="videoID"
                   ref="youtube"
                   style="width: 100%"/>

        </div>
      </el-dialog>

      <div class="no-videos" v-if="videos.length <= 0">
        <div>
          <video-off-icon/>
          <p>Aucune vidéo n'a été ajoutée pour le moment...</p>
          <el-button type="info" plain @click="dialogVisible = true">Ajouter une vidéo</el-button>
        </div>
      </div>

      <div v-if="videos.length > 0">

        <div class="align-text-right">
          <el-button type="primary" @click="dialogVisible = true" icon="el-icon-plus" circle/>
          <el-button type="info" icon="el-icon-question" v-popover:popover1 circle />
          <el-popover
            ref="popover1"
            width="400"
            trigger="click">
            <div>
              <strong>Aide</strong>
              <p>Vous pouvez dans cette section ajouter vos vidéos et définir la vidéo de présentation de l'application
              dans la page d'accueil du l'application web.</p>
              <ul class="note">
                <li>Seul les vidéos youtube sont acceptées.</li>
                <li>La première vidéo ajouté sera définie comme vidéo de présentation.</li>
                <li>Une seule vidéo peut être définie comme vidéo de présentation.</li>
                <li>La dernière vidéo ne peut pas être supprimée.</li>
                <li>Si la vidéo de présentation est supprimée, la dernière vidéo ajouté sera définie comme tel.</li>
              </ul>
              <div class="margin-top">
                <el-button type="primary" icon="el-icon-plus" circle/> Ajouter une vidéo
              </div>
              <div class="margin-top">
                <el-button type="success" icon="el-icon-star-on" circle/> Ajouter la vidéo à la playlist actuelle
              </div>
              <div class="margin-top">
                <el-button type="warning" icon="el-icon-close" circle/> Supprimer la vidéo de la playlist actuelle
              </div>
              <div class="margin-top">
                <el-button type="danger" icon="el-icon-delete" circle/> Supprimer la vidéo
              </div>
            </div>
          </el-popover>
        </div>
        <div><h2>Playlist actuelle</h2></div>
        <el-row :gutter="16">
          <el-col :span="8" v-for="v in videos" v-if="v.is_selected" :key="v.id">
            <!-- <video-hero @videoChange="loadData" :video="v" class="margin-top"/> -->
            <video-details
              @videoChange="loadData"
              :video="v"
              class="margin-top"
            />
          </el-col>
        </el-row>

        <div><h2>Vidéos disponible</h2></div>
        <el-row :gutter="16">
          <el-col :span="8" v-for="v in videos" v-if="!v.is_selected" :key="v.id">
            <video-details
              @videoChange="loadData"
              :video="v"
              class="margin-top"
            />
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import {Loading} from 'element-ui';

  import {PresentationVideo} from "../../models/contents/PresentationVideo";

  import VideoOffIcon from "vue-material-design-icons/video-off"
  import VideoHero from './blocks/VideoHero'
  import VideoDetails from './blocks/VideoDetails'

  export default {
    name: "presentation-video-index",
    components: {
      VideoOffIcon,
      VideoHero,
      VideoDetails,
    },
    data() {
      return {
        dialogVisible: false,
        presentationVideo: new PresentationVideo(),
        videos: [],
      }
    },
    computed: {
      videoID: function () {
        return this.$youtube.getIdFromUrl(this.presentationVideo.url)
      }
    },
    methods: {
      getVideoID(videoURL) {
        return this.$youtube.getIdFromUrl(videoURL)
      },
      handleClose(done) {
        this.presentationVideo = new PresentationVideo();
        done();
      },
      saveVideo() {
        this.presentationVideo
          .save()
          .then(() => {
            this.$message.success('Vidéo de présentation sauvegradée avec succès...');
            this.loadData();
          })
          .catch(e => {
            console.log(e);
            this.$message.error('Une erreur est survenue, merci de vérifier vos paramètres...')
          })
      },
      initData() {
        this.dialogVisible = false;
        this.presentationVideo = new PresentationVideo();
        this.videos = [];
      },
      loadVideos(params) {
        (new PresentationVideo())
          .fetchAll(params)
          .then(r => {
            this.videos = this.videos.concat(r.data);
            if (r.links.next !== null) {
              this.loadVideos({page: r.meta.current_page + 1})
            }
          })
          .catch(e => {
            this.$message.error('Impossible d\'accéder au données, merci de contacter vote administrateur...');
            console.log(e)
          });
      },
      loadData() {
        let loadingInstance = Loading.service({target: '#container'});
        this.initData();
        this.loadVideos();
        setTimeout(() => {
          loadingInstance.close();
        }, 1000);
      }
    },
    mounted() {
      this.loadData();
    }
  }
</script>

<style lang="scss" scoped>
  .no-videos {
    height: 400px;
    border: #e4e4e4 solid 1px;
    background: #e4e4e4;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-weight: bold;
    border-radius: 8px;
    color: #222;
  }

  .material-design-icon {
    font-size: 6rem;
  }

  .el-select-dropdown__item {
    height: auto;
  }
</style>
