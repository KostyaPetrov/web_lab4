<template>
  <el-table :data="tableData" border style="width: 100%" height="300">
    <el-table-column prop="x_axis" label="Ось X" />
    <el-table-column prop="y_axis" label="Ось Y" />
    <el-table-column prop="radius" label="Радиус"/>
    <el-table-column prop="is_hit" label="Результат">
      <template #default="scope">
          <Select v-if="scope.row.is_hit === true" style="width: 1em; height: 1em"/>
          <CloseBold v-else style="width: 1em; height: 1em"/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "v-table",
  data() {
    return {
      is_loading: false,
      tableData: [],
    }
  },
  mounted() {
    if (this.IS_AUTHED() && !this.TABLE_DATA().length)
      this.getAllData()
    else
      this.refreshData()
  },
  methods: {
    ...mapActions(['GET_ALL_DATA']),
    ...mapGetters(['TABLE_DATA', 'IS_AUTHED']),
    getAllData() {
      this.GET_ALL_DATA().then(
          result => {
            this.tableData = result.data
          },
          () => {
            this.tableData = []
          }
      );
    },
    refreshData() {
      this.tableData = this.TABLE_DATA()
    },
    deleteData() {
      this.tableData = []
    }
  }
}
</script>

<style>
  .cell {
    text-align: center !important;
  }
</style>