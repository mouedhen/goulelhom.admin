<template>
  <el-card :body-style="{ padding: '0px' }" :id="'#videoContainer' + video.id">

    <el-popover
      ref="popover1"
      trigger="hover"
      content="ajouter la vidéo à la playlist actulle.">
    </el-popover>

    <el-popover
      ref="popover2"
      trigger="hover"
      content="supprimer la vidéo.">
    </el-popover>

    <el-popover
      ref="popover3"
      trigger="hover"
      content="supprimer la vidéo de la playlist actuelle.">
    </el-popover>

    <div style="height: 200px; position: relative">
      <div style="position: absolute; right: 1rem; bottom: 1rem">

        <el-button
          @click="addVideoToPlaylist"
          type="success"
          icon="el-icon-star-on"
          :disabled="video.is_selected"
          v-popover:popover1
          circle/>

        <el-button
          @click="removeVideoFromPlaylist"
          type="warning"
          icon="el-icon-close"
          :disabled="!video.is_selected"
          v-popover:popover3
          circle/>

        <el-button
          @click="deleteVideo"
          type="danger"
          icon="el-icon-delete"
          v-popover:popover2
          circle/>

      </div>
      <youtube
        :video-id="videoID"
        ref="youtube"
        height="200"
        style="width: 100%;"/>
    </div>
  </el-card>
</template>

<script>
  import {PresentationVideo} from "../../../models/contents/PresentationVideo";

  export default {
    name: "video-details",
    props: ['video'],
    computed: {
      videoID: function () {
        return this.$youtube.getIdFromUrl(this.video.url)
      }
    },
    methods: {
      addVideoToPlaylist() {
        let video = new PresentationVideo(this.video);
        let name = video.name;

        this.$confirm('Ajouter la vidéo ' + video.name + ' à la playlist actuelle, Continuer?', 'Warning', {
          confirmButtonText: 'Continuer',
          cancelButtonText: 'Annuler',
          type: 'warning'
        }).then(() => {
          video.is_selected = true;
          video
            .save()
            .then(() => {
              this.$message({
                type: 'success',
                message: 'La vidéo ' + name + ' a été sauvegardée avec succès...'
              });
              this.$emit('videoChange')
            })
            .catch((e) => {
              console.log(e);
              this.$message({
                type: 'error',
                message: 'Une erreur inattendue est survenue, merci de rééssayer ou de contacter votre administrateur...'
              });
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Modification annulée...'
          });
        });
      },
      removeVideoFromPlaylist() {
        let video = new PresentationVideo(this.video);
        let name = video.name;

        this.$confirm('Suppriler la vidéo ' + video.name + ' de la playlist actuelle, Continuer?', 'Warning', {
          confirmButtonText: 'Continuer',
          cancelButtonText: 'Annuler',
          type: 'warning'
        }).then(() => {
          video.is_selected = false;
          video
            .save()
            .then(() => {
              this.$message({
                type: 'success',
                message: 'La vidéo ' + name + ' a été sauvegardée avec succès...'
              });
              this.$emit('videoChange')
            })
            .catch((e) => {
              console.log(e);
              this.$message({
                type: 'error',
                message: 'Une erreur inattendue est survenue, merci de rééssayer ou de contacter votre administrateur...'
              });
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Modification annulée...'
          });
        });
      },
      deleteVideo() {
        let video = new PresentationVideo(this.video);
        let name = video.name;

        this.$confirm('Voulez-vous supprimer la vidéo ' + video.name + '. Continuer?', 'Warning', {
          confirmButtonText: 'Continuer',
          cancelButtonText: 'Annuler',
          type: 'warning'
        }).then(() => {
          video
            .delete()
            .then(() => {
              this.$message({
                type: 'success',
                message: 'La vidéo ' + name + ' a été supprimé avec succès...'
              });
              this.$emit('videoChange')
            })
            .catch((e) => {
              if (e.response.status === 422) {
                this.$message({
                  type: 'warning',
                  message: 'Vous n\'êtes pas authorisé à supprimé la dernière video...'
                });
                return;
              }
              console.log(e);
              this.$message({
                type: 'error',
                message: 'Une erreur inattendue est survenue, merci de rééssayer ou de contacter votre administrateur...'
              });
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Suppression annulée...'
          });
        });
      },
    }
  }
</script>
