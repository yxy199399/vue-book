<template>
  <div id="app">
    <div class="daily-menu">
      <div class="daily-menu-item" :class="{on: type === 'recommend'}" @click="handleToRecommend()" >每日推荐</div>
      <div class="daily-menu-item" :class="{on: type === 'daily'}" @click="showThemes = !showThemes">主题日报
        <ul v-show="showThemes">
          <li v-for="item in themes" :key="item">
            <a :class="{on: item.id === themeId && type === 'daily'}" @click="handleToTheme(item.id)" >{{item.name}}</a>
          </li>
        </ul>

      </div>
    </div>
    <div class="daily-list" ref="list">
      <template v-if="type === 'recommend'">
        <div v-for="list in recommendList" :key='list.date'>
          <div class="daily-date">{{formatDay(list.date)}}</div>
          <Item v-for="story in list.stories" :data="story" :key="story.id" @click.native="handleClick(story.id)"></Item>
          
        </div>
      </template>
      <template v-if="type === 'daily'">
        <Item v-for="story in list" :key="story.id" :data="story" @click="handleClick(story.id)"></Item>
        <!-- <daily-article :id="articleId"></daily-article> -->
        
      </template>
    </div>
    <daily-article :id="articleId"></daily-article>
    
  </div>
</template>

<script>
  // import HelloWorld from './components/HelloWorld.vue';
  import $ from './libs/util';
  import Item from './components/item.vue';
  import DailyArticle from './components/dailyArticle.vue'

export default {
  name: 'app',
  components: {
    Item,
    // HelloWorld
    DailyArticle
  },
  data(){
    return {
      themes: [],
      recommendList: [],
      dailyTime: $.getTodayTime(),
      isLoading: false,
      showThemes: false,
      type: 'recommend',
      themeId: 0,
      articleId: 0,
      list: []
    }
  },
  methods: {
    getThemes() {
      $.ajax.get('themes').then(res => {
        this.themes = res.others; 
        console.log(res.others);
      })
    },
    handleToTheme(id) { 
      this.type = "daily";
      this.themeId = id;
      this.list = [];
      this.get('theme/' + id).then(res => {
        this.list = res.stories
        .filter(item => item.type !== 1)
      })
    },
    handleToRecommend(){
      this.type = 'recommend';
      this.recommendList = [];
      this.dailyTime = $.getTodayTime();
      this.getRecommendList();
    },
    getRecommendList(){
      this.isLoading = true;
      const prevDay = $.getPrevDay(this.dailyTime + 43200000);
      console.log(prevDay);
      $.ajax.get('news/before/' + prevDay).then(res => {
        console.log(res);
        this.recommendList.push(res);
        this.isLoading = false;
      })
    },
    formatDay(date){
      let month = date.substr(4, 2);
      let day = date.substr(6, 2);
      if(month.substr(0, 1) === '0') month = month.substr(1, 1);
      if(day.substr(0, 1) === '0') day = day.substr(1, 1);
      return `${month} 月 ${day} 日`;
    },
    handleClick(id){
      console.log(id);
      this.articleId = id;
    }
  },
  mounted(){
    this.getThemes();
    this.getRecommendList();
    const $list = this.$refs.list;
    //监听滚动事件
    $list.addEventListener('scroll', () => {
      //在主题日报或者正在加载推荐列表时停止操作
      if(this.type === 'daily' || this.isLoading) return;
      //已滚动的距离加页面的高度等于整个内容区域的高度时，视为接触底部
      if($list.scrollTop + document.body.clientHeight >= $list.scrollHeight){
        //时间相对少一天
        this.dailyTime -= 86400000;
        this.getRecommendList();
      }
    })
  }
}
</script>

<style>
  .daily-menu ul{
    list-style: none;
  }
  .daily-menu ul li a{
     display: block;
     color: inherit; 
     text-decoration: none;
     padding: 5px 0;
     margin: 5px 0;
     cursor: pointer;
  }
  .daily-menu ul li a:hover{
    color: #3399ff;
  }
  .daily-list{
    width: 300px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 150px;
    overflow: auto;
    border-right: 1px solid #d7dde4;
  }
  .daily-date{
    text-align: center;
    margin: 10px 0;
  }
  .daily-article{
    margin-left: 450px;
    padding: 20px;
  }

</style>
