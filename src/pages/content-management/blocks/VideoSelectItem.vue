<template>
  <el-row :body-style="{ padding: '0px' }">
    <el-col :span="12">
    <youtube
             ref="youtube"
             :video-id="getVideoID(video.url)"
             style="width: 100%; height: 300px"/>
    </el-col>
    <el-col :span="12">
    <el-card style="padding: 16px; height: 100%">
      <div class="align-text-center">
        <p>{{ video.name }}</p>
      </div>
    </el-card>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: "video-details",
    props: ['video'],
    methods: {
      getVideoID(videoURL) {
        return this.$youtube.getIdFromUrl(videoURL)
      },
    }
  }
</script>

<style scoped>

</style>
