<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>administration</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'users:index' }">utilisateurs</el-breadcrumb-item>
    </el-breadcrumb>

    <div>
      <h2>Liste des utilisateurs</h2>
      <el-dialog
        :visible.sync="dialogVisible"
        width="30%"
        center
        :before-close="handleClose">
        <div>
          <el-form v-model="user">

            <el-form-item label="Nom & prénom">
              <el-input v-model="user.name" placeholder="merci de spécifier le nom et le prénom"/>
            </el-form-item>

            <el-form-item label="Adresse email">
              <el-input type="email" v-model="user.email" placeholder="merci de spécifier l'adresse email"/>
            </el-form-item>

            <el-form-item label="Mot de passe">
              <el-input type="password" v-model="user.password" placeholder="merci de choisir un mot de passe"/>
            </el-form-item>

            <el-form-item label="Confirmer le mot de passe">
              <el-input type="password" v-model="user.password_confirmation"
                        placeholder="merci de confirmer le mot de passe"/>
            </el-form-item>

            <el-form-item>
              <el-button style="width: 100%" type="primary" @click="saveUser">Valider</el-button>
            </el-form-item>

          </el-form>
        </div>
      </el-dialog>

      <el-card class="margin-top">
        <div style="padding: 1rem">

          <data-tables :data="users" :actions-def="actionsDef" :action-col-def="actionColDef">
            <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" sortable="custom"
                             :key="title.prop">
            </el-table-column>
          </data-tables>
        </div>
      </el-card>
    </div>

    <div>
      <h2>Historique des actions</h2>
      <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
        <el-card v-for="activity in activities" class="margin-top" :key="activity.id">
          <div slot="header" class="align-text-center">
            <b>{{activity.subject_type}} {{activity.description}}</b><br>
            <span class="note">{{formatDate(activity.date.date)}}</span>
          </div>
          <div>
            <pre v-highlightjs><code class="json">{{activity.properties}}</code></pre>
          </div>
        </el-card>
      </div>

      <el-card style="padding: 1rem; margin-top: 1rem" v-if="activitiesHaveNext">
        <div v-loading="activitiesHaveNext"
             element-loading-text="Chargement..."
             element-loading-spinner="el-icon-loading"
             style="width: 100%"
        ></div>
      </el-card>

    </div>

  </div>
</template>

<script>
  import moment from 'moment'
  import 'moment/locale/fr';

  moment.locale('fr');

  import {Loading} from 'element-ui';
  import {Activities} from "../../models/users/Activities";
  import {User} from "../../models/users/User";

  export default {
    name: "users-index",
    data() {
      return {
        dialogVisible: false,
        user: new User(),
        activities: [],
        users: [],
        busy: false,
        page: 1,
        activitiesHaveNext: false,
        titles: [
          {
            prop: "name",
            label: "Nom & Prénom"
          }, {
            prop: "email",
            label: "Adresse email"
          }
        ],
        actionsDef: {
          colProps: {
            span: 19
          },
          def: [
            {
              name: 'Ajouter un utilisateur',
              handler: () => {
                this.dialogVisible = true;
              }
            },
          ]
        },
        actionColDef: {
          label: 'Actions',
          def: [
            {
              icon: 'message',
              type: 'text',
              handler: row => {
                this.user = new User(row);
                this.dialogVisible = true
              },
              name: 'Modifier'
            },
            {
              icon: 'message',
              type: 'text',
              handler: row => {
                let user = new User(row);
                const name = user.name;
                this.$confirm('Voulez-vous supprimer l\'utilisateur ' + user.name + '. Continuer?', 'Warning', {
                  confirmButtonText: 'Continuer',
                  cancelButtonText: 'Annuler',
                  type: 'warning'
                }).then(() => {
                  user.delete()
                    .then(() => {
                      this.$message({
                        type: 'success',
                        message: 'L\'utilisateur ' + name + ' a été supprimé avec succès...'
                      });
                      this.loadData()
                    })
                    .catch((e) => {
                      console.log(e)
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
              name: 'Supprimer'
            },
          ]
        }
      }
    },
    methods: {
      formatDate(date) {
        return moment(date).format('L')
      },
      resetUser() {
        this.user = new User();
      },
      handleClose(done) {
        this.resetUser();
        done();
      },
      saveUser() {
        this.user.save()
          .then(() => {
            this.$message.success('Utilisateur suavegardé avec succèss...');
            this.loadData()
          })
          .catch(e => {
            this.$message.error('Merci de vérifier les paramètres saisie...');
            console.log(e)
          })
      },
      loadMore() {
        // this.busy = true;

        if (this.activitiesHaveNext) {
          setTimeout(() => {
            this.loadActivities({page: this.page});
          }, 1000);
        }
      },
      loadActivities(params) {
        this.busy = true;
        (new Activities())
          .fetchAll(params)
          .then(r => {
            this.activities = this.activities.concat(r.data);
            if (r.links.next !== null) {
              this.activitiesHaveNext = true;
              this.page = r.meta.current_page + 1;
              this.busy = false;
            } else {
              this.activitiesHaveNext = false;
              this.page = 1;
            }
          })
          .catch(e => {
            this.$message.error('Impossible d\'accéder au données, merci de contacter vote administrateur...');
            this.busy = false;
            console.log(e)
          });
      },
      loadUsers(params) {
        (new User())
          .fetchAll(params)
          .then(r => {
            this.users = this.users.concat(r.data)
            if (r.links.next !== null) {
              setTimeout(() => {
                this.loadUsers({page: r.meta.current_page + 1})
              }, 1000);
            }
          })
          .catch(e => {
            this.$message.error('Impossible d\'accéder au données, merci de contacter vote administrateur...');
            console.log(e)
          });
      },
      loadData() {
        let loadingInstance = Loading.service({target: '#container'});
        this.dialogVisible = false;
        this.activities = [];
        this.users = [];
        this.resetUser();
        this.loadUsers();
        this.loadActivities();
        loadingInstance.close();
      }
    },
    mounted() {
      this.loadData();
    }
  }
</script>
