<template>
  <el-menu class="vertical-menu"
           background-color="#fff"
           active-text-color="#CE1836"
           :default-active="$route.path"
           router>
    <div class="logo">
      <h1>GoulelHom</h1>
    </div>

    <el-menu-item index="/dashboard">
      <i class="el-icon-menu"></i>
      <span>Tableau de bord</span>
    </el-menu-item>

    <el-submenu index="/complaints">
      <template slot="title">
        <map-marker-radius />
        <span>Gestion des plaintes</span>
      </template>
      <el-menu-item-group>

        <el-menu-item index="/complaints/dashboard">
          <i class="el-icon-menu"></i>
          <span>Tableau de bord</span>
        </el-menu-item>

        <el-menu-item index="/complaints/list">
          <view-list />
          <span>Historique des plaintes</span>
        </el-menu-item>

      </el-menu-item-group>
    </el-submenu>

    <el-submenu index="/petitions">
      <template slot="title">
        <pencil-circle />
        <span>Gestion des pétitions</span>
      </template>
      <el-menu-item-group>

        <el-menu-item index="/petitions/dashboard">
          <i class="el-icon-menu"></i>
          <span>Tableau de bord</span>
        </el-menu-item>

        <el-menu-item index="/petitions/list">
          <view-list />
          <span>Historique des pétitions</span>
        </el-menu-item>

      </el-menu-item-group>
    </el-submenu>

    <el-submenu index="/content">
      <template slot="title">
        <playlist-edit />
        <span>Gestion du contenu</span>
      </template>
      <el-menu-item-group>

        <el-menu-item index="/content-management/presentation-video">
          <youtube-icon />
          <span>Vidéo de présentation</span>
        </el-menu-item>

        <el-menu-item index="/content-management/slider">
          <i class="el-icon-picture"></i>
          <span>Slider</span>
        </el-menu-item>

      </el-menu-item-group>
    </el-submenu>

    <el-menu-item index="/events-management">
      <i class="el-icon-date"></i>
      <span>Gestion des évènements</span>
    </el-menu-item>

    <el-menu-item index="/reports">
      <i class="el-icon-document"></i>
      <span>Gestion des rapports</span>
    </el-menu-item>

    <el-menu-item index="/users">
      <account-circle-icon/>
      <span>Gestion des utilisateurs</span>
    </el-menu-item>

    <el-submenu index="/settings">
      <template slot="title">
        <i class="el-icon-setting"></i>
        <span>Configuration</span>
      </template>
      <el-menu-item-group>

        <el-menu-item index="/settings/themes">
          <bookmark />
          <span>Thèmes</span>
        </el-menu-item>

        <el-menu-item index="/settings/municipalities">
          <bank />
          <span>Municipalités</span>
        </el-menu-item>

      </el-menu-item-group>
    </el-submenu>

  </el-menu>
</template>

<script>

  import AccountCircleIcon from "vue-material-design-icons/account-circle"
  import ClipboardTextIcon from "vue-material-design-icons/clipboard-text"
  import DashboardIcon from "vue-material-design-icons/view-dashboard"
  import PlaylistEdit from "vue-material-design-icons/playlist-edit"
  import YoutubeIcon from "vue-material-design-icons/youtube"
  import Bookmark from "vue-material-design-icons/bookmark"
  import Bank from "vue-material-design-icons/bank"
  import MapMarkerRadius from "vue-material-design-icons/map-marker-radius"
  import MapMarkerMultiple from "vue-material-design-icons/map-marker-multiple"
  import PencilCircle from "vue-material-design-icons/pencil-circle-outline"
  import ViewList from "vue-material-design-icons/view-list"

  export default {
    name: "vertical-menu",
    components: {
      AccountCircleIcon,
      ClipboardTextIcon,
      DashboardIcon,
      PlaylistEdit,
      YoutubeIcon,
      Bookmark,
      Bank,
      MapMarkerRadius,
      MapMarkerMultiple,
      PencilCircle,
      ViewList,
    }
  }
</script>

<style scoped>

  .material-design-icon {
    font-size: 1.5rem;
    margin-right: .2rem;
    margin-bottom: .6rem;
  }

  .material-design-icon, i {
    color: #777;
  }

  .is-active > span.material-design-icon {
    color: #CE1836 !important;
  }
</style>
