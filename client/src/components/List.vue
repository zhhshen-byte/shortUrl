<template>
  <div>
    <a-button type="primary" @click="showModal">新增</a-button>       
    <a-table
      :columns="columns"
      :row-key="record => record.key"
      :data-source="data"
      :loading="loading"
    >
      <template v-slot:name="{ text, record}"> {{ text }} </template>
    </a-table>
    <a-modal v-model:visible="visible" title="Basic Modal" @ok="onSuccess">
      <a-form ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="长链接" name="url" :rules="[
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
        ]">
          <a-input v-model:value="form.url" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
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
    title: 'url',
    dataIndex: 'url',
  },
  {
    title: 'keyword',
    dataIndex: 'keyword',
  },
  {
    title: '时间',
    dataIndex: 'update_at',
    slots: { customRender: 'name' },
  }
];

export default {
  components: {
  },
  data() {
    return {
      data: [],
      loading: false,
      columns,
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        url: '',
      },
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    fetch(params = {}) {
      console.log('params:', params);
      this.loading = true;
      axios.get('http://localhost:4001/api/shortUrl/getLinks', {
        params: {}
      }).then(res => {
        const { data } = res
        if (data.flag === 0) {
          this.loading = false
          this.data = data.data
        }
      })
    },
    showModal() {
      this.visible = true
    },
    onSuccess() {
      this.$refs.ruleForm
        .validate()
        .then(() => {
          console.log('values', this.form);
          const params = this.form
          axios.post('http://localhost:4001/api/shortUrl/create', params).then(res => {
            console.log('object, res')
            this.visible = false
            this.fetch()
          })
        })
        .catch(error => {
          console.log('error', error);
        });
    }
  },
};
</script>