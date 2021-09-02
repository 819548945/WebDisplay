import App from './App'
import store from './store'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$adpid = "1111111111"
Vue.prototype.$backgroundAudioData = {
	playing: false,
	playTime: 0,
	formatedPlayTime: '00:00:00'
}
Vue.prototype.checkUrl=async function(url){
	let checkUrl;
	if(url)checkUrl=url;
	else {
		let setting=uni.getStorageSync("setting");
		if(setting)checkUrl=setting.url;
	}
	return new Promise(function(resolve, reject) {
		if(checkUrl){
			uni.request({
				url:checkUrl+"?"+new Date().getTime(),
				method:"GET",
				timeout:5000,
				success:res=>{
					resolve(true);
				},
				fail:res =>{
					resolve(false);
				}
			})
		}else resolve(false);
	})
};
Vue.prototype.shutdown=function(){
	var Runtime= plus.android.importClass("java.lang.Runtime");
	Runtime.getRuntime().exec(["su","-c","reboot","-p"]).waitFor();
};
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.config.globalProperties.$adpid = "1111111111"
	app.config.globalProperties.$backgroundAudioData = {
		playing: false,
		playTime: 0,
		formatedPlayTime: '00:00:00'
	}
	return {
		app
	}
}
// #endif
