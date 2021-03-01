import Vue from 'vue'

Vue.config.productionTip = false
Vue.config.devtools = true
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import '@/assets/css/reset.scss'
import FlexPage from './../index'

import ApiDataSource from "./api_datasource";


new ApiDataSource();


FlexPage.configure('upload',{
  uploader: 'mock'
})

FlexPage.configure('date', {
  shortcuts: {
    date: [{
      text: 'Now',
      value: 'now'
    }, {
      text: 'Yesterday',
      value: 'yesterday'
    }, {
      text: '1 Week ago',
      value: 'lastweek'
    }, {
      text: '1 Month ago',
      value: 'lastmonth'
    }],
    daterange: [{
      text: 'Now',
      value: 'now'
    }, {
      text: 'Yesterday',
      value: 'yesterday'
    }, {
      text: 'Last 5 days',
      value: '-5 days'
    }, {
      text: 'This Week',
      value: 'thisweek'
    }, {
      text: 'Last Week',
      value: 'lastweek'
    }, {
      text: 'This month',
      value: 'thismonth'
    }, {
      text: 'Last Month',
      value: 'lastmonth'
    }, {
      text: 'This Year',
      value: 'thisyear'
    }, {
      text: 'Last Year',
      value: 'lastyear'
    }]
  }

});

Vue.use(ElementUI);


export default {
  init: function (app, node) {
    new Vue({
      store,
      render: h => h(app)
    }).$mount(node)

  },
};
