<template>
  <a-card title="链接信息" :bordered="false">
    <a-button type="primary" @click="showModal" style="margin-bottom: 24px">新增</a-button>
    <a-table
      :columns="columns"
      :row-key="record => record.key"
      :data-source="data"
      :loading="loading"
      @change="handleTableChange"
      :pagination="pagination"
    >
      <template v-slot:name="{ text, record}">{{ text }}</template>
      <template v-slot:url="{ text, record}">
        <a :href="record.url" target="_blank" rel="noopener noreferrer">{{ record.url }}</a>
      </template>
      <template v-slot:keyword="{ text, record}">
        <a
          :href="baseUrl + '/' + record.keyword"
          target="_blank"
          rel="noopener noreferrer"
        >{{ baseUrl + '/' + record.keyword }}</a>
      </template>
      <template v-slot:operation="{ text, record}">
        <a-popconfirm title="确定删除吗？" ok-text="确定" cancel-text="取消" @confirm="toDelete(record)">
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal v-model:visible="visible" title="Basic Modal" @ok="onSuccess">
      <a-form ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item
          label="长链接"
          name="url"
          :rules="[
          {
            required: true,
            message: '长地址不能为空',
            trigger: 'blur'
          },
          {
            type: 'url',
            message: '地址格式不正确',
            trigger: 'blur'
          }
        ]"
        >
          <a-input v-model:value="form.url" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>
<script>
import axios from 'axios'
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: '20%',
  },
  {
    title: '长链接',
    dataIndex: 'url',
    width: 200,
    slots: { customRender: 'url' },
  },
  {
    title: '短链接',
    dataIndex: 'keyword',
    slots: { customRender: 'keyword' },
  },
  {
    title: '时间',
    dataIndex: 'update_at',
    slots: { customRender: 'name' },
  },
  {
    title: '操作',
    slots: { customRender: 'operation' },
  },
]

export default {
  components: {},
  data() {
    return {
      baseUrl: 'http://localhost:4001',
      data: [],
      loading: false,
      pagination: {
        pageSize: 5,
        total: 0,
      },
      columns,
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        url: '',
      },
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    handleTableChange(pagination) {
      console.log(pagination)
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch(pagination.current)
    },
    fetch(pageNum = 1) {
      this.loading = true
      this.pagination.current = pageNum
      axios
        .post(`${this.baseUrl}/api/shortUrl/getLinks`, {
          pageSize: this.pagination.pageSize,
          pageNum,
        })
        .then((res) => {
          const { data } = res
          if (data.flag === 0) {
            const result = data.data
            this.loading = false
            this.data = result.list
            const pagination = { ...this.pagination }
            pagination.total = result.total
            this.pagination = pagination
          }
        })
        .catch((error) => {
          this.loading = false
          console.log('error', error.toString())
          this.$message.error(error.toString())
        })
    },
    showModal() {
      this.visible = true
    },
    onSuccess() {
      this.$refs.ruleForm
        .validate()
        .then(() => {
          console.log('values', this.form)
          const params = this.form
          axios
            .post(`${this.baseUrl}/api/shortUrl/create`, params)
            .then((res) => {
              console.log('object, res')
              this.visible = false
              this.$message.success('操作成功！')
              this.fetch(1)
            })
        })
        .catch((error) => {
          console.log('error', error.toString())
          this.$message.error(error.toString())
        })
    },
    toDelete(item) {
      const params = {
        id: item.id,
      }
      axios
        .post(`${this.baseUrl}/api/shortUrl/deleteLink`, params)
        .then((res) => {
          const { data } = res
          if (data.flag === 0) {
            this.$message.success('操作成功！')
            this.fetch(1)
          }
        })
        .catch(() => {
          this.loading = false
          console.log('error', error.toString())
          this.$message.error(error.toString())
        })
    },
  },
}
</script>