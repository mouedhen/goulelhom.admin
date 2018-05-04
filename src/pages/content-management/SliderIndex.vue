<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>administration</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'content-management:index' }">gestion du contenu</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'content-management:slider' }">slider</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="margin-top">

      <el-dialog
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
        <el-form v-model="slider" id="sliderForm">

          <el-form-item label="citation" prop="quote">
            <el-input v-model="slider.quote" placeholder="spécifier la citation"/>
          </el-form-item>

          <el-form-item label="auteur" prop="author">
            <el-input v-model="slider.author" placeholder="spécifier l'auteur"/>
          </el-form-item>

          <el-form-item label="Sélectionner">
            <el-switch v-model="slider.is_selected"/>
          </el-form-item>

          <el-form-item label="image">
            <el-upload
              class="avatar-uploader"
              ref="upload"
              :action="uploadUrl"
              :show-file-list="false"
              :auto-upload="false"
              :headers="headers"
              :on-change="handlePictureCardPreview"
              :on-success="onUploadSuccess"
              :on-error="onUploadError">

              <div class="img-crop ratio-4-to-3" v-if="displayImg">
                <img v-if="dialogImageUrl" v-bind:src="dialogImageUrl" alt="">
              </div>

              <i v-else class="el-icon-plus avatar-uploader-icon"></i>

            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitSlide" style="width: 100%">Valider</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="default" @click="resetUpload" style="width: 100%">Annuler</el-button>
          </el-form-item>

        </el-form>
      </el-dialog>
      <div class="no-images" v-if="sliders.length < 1">
        <div>
          <image-off-icon/>
          <p>Aucune image n'a été ajoutée pour le moment...</p>
          <el-button type="info" plain @click="dialogVisible = true">Ajouter une image</el-button>
        </div>
      </div>

      <div v-else>

        <div class="align-text-right">
          <el-button type="primary" @click="dialogVisible = true" icon="el-icon-plus" circle/>
          <el-button type="info" icon="el-icon-question" v-popover:popover1 circle/>
          <el-popover
            ref="popover1"
            width="400"
            trigger="click">
            <div>
              <strong>Aide</strong>
              <p>Vous pouvez dans cette section ajouter vos sliders et sélectionner ceux qui seront sélectionnés et ceux
                qui ne le seront pas.</p>
              <p class="note">Seules les images de type png/jpeg sont acceptées.</p>
              <div class="margin-top">
                <el-button type="primary" icon="el-icon-plus" circle/>
                Ajouter un élément
              </div>
              <div class="margin-top">
                <el-button type="success" icon="el-icon-star-on" circle/>
                Sélectionner un élément
              </div>
              <div class="margin-top">
                <el-button type="warning" icon="el-icon-close" circle/>
                Désélectionner un élement
              </div>
              <div class="margin-top">
                <el-button type="danger" icon="el-icon-delete" circle/>
                Supprimer la élément
              </div>
            </div>
          </el-popover>
        </div>

        <h3>Sliders de présentation sélectionnées</h3>

        <el-row :gutter="16">
          <el-col :span="12" v-for="s in sliders" v-if="s.is_selected" :key="s.id" class="margin-top">
            <slider-card :sliderData="s" @updated="loadData"/>
          </el-col>
        </el-row>

        <h3>Sliders de présentation disponibles</h3>

        <el-row :gutter="16">
          <el-col :span="8" v-for="s in sliders" v-if="!s.is_selected" :key="s.id" class="margin-top">
            <slider-card :sliderData="s" @updated="loadData"/>
          </el-col>
        </el-row>

      </div>

    </div>

  </div>
</template>

<script>
  import {Loading} from 'element-ui'

  import {Slider} from "../../models/contents/Slider"
  import SliderCard from './blocks/SliderCard'

  import ImageOffIcon from "vue-material-design-icons/image-off"

  export default {
    name: "slider-index",
    components: {
      ImageOffIcon,
      SliderCard,
    },
    data() {
      return {
        slider: new Slider(),
        sliders: [],
        dialogImageUrl: '',
        displayImg: '',
        dialogVisible: false,
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('access-token')}
      }
    },
    computed: {
      uploadUrl: function () {
        return this.slider.config.apiUrl + '/' + this.slider.id + '/img'
      }
    },
    methods: {
      handlePictureCardPreview(file) {
        if (file.status === 'ready') {
          if (!this.checkFile(file)) {
            return false
          }
          this.dialogImageUrl = file.url;
          this.displayImg = true
        }
      },
      checkFile(file) {
        const isImg = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isImg) {
          this.$message.warning('Le fichier doit être une image !');
        }
        if (!isLt2M) {
          this.$message.warning('La taille du fichier ne doit pas dépasser les 2MB !');
        }
        return isImg && isLt2M;
      },
      resetUpload() {
        this.$refs.upload.clearFiles();
        this.initialData();
      },
      onUploadError() {
        this.$message.error('Une erreur est survenue, merci de réessayer...');
        this.slider.delete()
          .catch(e => {
            console.log(e)
          })
      },
      onUploadSuccess() {
        this.resetUpload();
        this.loadData();
        this.$message.success('Image ajoutée avec succès...')
      },
      submitSlide() {
        let loadingInstance = Loading.service({target: '#sliderForm'});
        this.slider.save()
          .then(r => {
            this.$refs.upload.submit();
            loadingInstance.close();
          })
          .catch(e => {
            console.log(e);
            loadingInstance.close();
          });
      },
      loadSliders(params) {
        (new Slider())
          .fetchAll(params)
          .then(r => {
            this.sliders = this.sliders.concat(r.data);
            if (r.links.next !== null) {
              this.loadSliders({page: r.meta.current_page + 1})
            }
          })
          .catch(e => {
            this.$message.error('Impossible d\'accéder au données, merci de contacter vote administrateur...');
            console.log(e)
          });
      },
      initialData() {
        this.slider = new Slider();
        this.dialogImageUrl = '';
        this.displayImg = false;
        this.dialogVisible = false;
        this.sliders = [];
      },
      handleClose(done) {
        this.slider = new Slider();
        if (this.$refs.upload !== null) {
          this.$refs.upload.clearFiles();
        }
        done();
      },
      loadData() {
        let loadingInstance = Loading.service({target: '#container'});
        this.initialData();
        this.loadSliders();
        loadingInstance.close();
      }
    },
    mounted() {
      this.loadData();
    }
  }
</script>

<style lang="scss" scoped>
  .no-images {
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

  .avatar-uploader {
    border: rgba(#e4e4e4, .5) solid 1px;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: #e4e4e4;
    width: 100%;
    &:hover {
      border: rgba(#409EFF, .5) dashed 1px;
      background: #f4f4f4;
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>
