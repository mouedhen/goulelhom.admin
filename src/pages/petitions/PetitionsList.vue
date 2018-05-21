<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'petitions:dashboard' }">gestion des pétitions</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'petitions:list' }">historique</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="margin-top">

      <div class="no-records" v-if="records.length < 1">
          <p>Aucune pétitions...</p>
      </div>

      <div v-else>
        <el-card>
          <data-tables
            :data="records"
            :table-props="{border: true, stripe: true}">
            <el-table-column label="Début" width="150">
              <template slot-scope="scope">
                <p>{{ formatDate(scope.row.start_date) }}</p>
              </template>
            </el-table-column>
            <el-table-column label="Fin" width="150">
              <template slot-scope="scope">
                <p>{{ formatDate(scope.row.end_date) }}</p>
              </template>
            </el-table-column>

            <el-table-column
              v-for="column in columns"
              :key="column.prop"
              :prop="column.prop"
              :width="column.width"
              :label="column.label"
              :fixed="column.fixed"
              sortable="custom"
            />

            <el-table-column
              class-name="table-actions"
              prop="actions"
              label="est valide"
              width="90"
              align="center"
              fixed="right"
              col-not-row-click>
              <template slot-scope="scope">
                <div v-if="scope.row.is_valid">
                  <el-button
                    type="success"
                    icon="el-icon-check"
                    :disabled="!scope.row.is_valid"
                    size="mini"
                    circle
                  />
                </div>
                <div v-else>
                  <el-button
                    type="warning"
                    icon="el-icon-close"
                    :disabled="scope.row.is_valid"
                    size="mini"
                    circle
                  />
                </div>
              </template>
            </el-table-column>
          </data-tables>
        </el-card>
      </div>

    </div>
  </div>
</template>

<script>
  import {Petition} from "../../models/petitions/Petition";
  import {DateFormatterMixin} from "../../mixins/DateFormatterMixin";
  import {RecordsListMixin} from "../../mixins/RecordsListMixin";

  export default {
    name: "PetitionsList",
    data() {
      return {
        columns: [
          {
            prop: 'organization.name',
            label: 'Cible',
            width: "200",
          },
          {
            prop: 'theme.name',
            label: 'Thème',
            width: "200",
          },
          {
            prop: 'requested_signatures_number',
            label: 'Signatures requises',
            width: "200",
          },
          {
            prop: 'signatures',
            label: 'Signatures acquises',
            width: "200",
          },
          {
            prop: 'name',
            label: 'Designation',
            width: "300",
          },
          {
            prop: 'description',
            label: 'Description',
            width: "400",
            fixed: "right",
          },
        ]
      }
    },
    mixins: [DateFormatterMixin, RecordsListMixin],
    computed: {
      factory: function () {
        return new Petition()
      }
    },
  }
</script>

<style scoped>
  .no-records {
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
</style>
