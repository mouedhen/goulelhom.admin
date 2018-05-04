<template>
  <el-card :body-style="{ padding: '0px' }" :id="'#videoContainer' + video.id">
    <div style="height: 600px;">
      <youtube
        :video-id="videoID"
        ref="youtube"
        height="600"
        style="width: 100%;"/>
    </div>
  </el-card>
</template>

<script>

  export default {
    name: "video-hero",
    props: ['video'],
    computed: {
      videoID: function () {
        return this.$youtube.getIdFromUrl(this.video.url)
      }
    },
  }
</script>
