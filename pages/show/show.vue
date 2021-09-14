<template>
	<view class="body">
		<view v-if="flag">
			<web-view :src="setting.url" ></web-view>
		</view>
		<view v-else>
			{{message}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				flag:true,
				screenBrightness:0.5,
				setting:{},
				message:"启动中...",
				timerId:"",
				heartbeatTaskIsOpen:true
			}
		},
		onLoad() {
			this.openHeartbeatTask();
		},
		async onShow() {
			var setting=this.setting=uni.getStorageSync("setting");
			uni.getScreenBrightness({
			    success: function (res) {
					this.screenBrightness=res.value
					uni.setScreenBrightness({
					    value:setting.brightness/100
					});	
			    }
			});
			let pwi = uni.requireNativePlugin('lich-PowerOnAutoStart');
			pwi.wakeAndUnlock({"wake":true,"unlock":true});
			plus.navigator.setFullscreen(true);
			setTimeout(function(){
				plus.screen.lockOrientation(setting.orientation);
			},500)
		},onUnload(){
			plus.navigator.setFullscreen(false);
			uni.setKeepScreenOn({
			    keepScreenOn: false
			});
			uni.setScreenBrightness({
			    value: this.screenBrightness
			});
			plus.screen.lockOrientation("portrait-primary");
		},	
		methods: {
			heartbeatTask:async function(){
				let pwi = uni.requireNativePlugin('lich-PowerOnAutoStart');
				let flag= await this.checkUrl(this.setting.url);
				if(this.flag!=flag){
					this.flag=flag
					if(this.flag==false){
						this.message="无信号输入";
						if(this.setting.heartbeatError=="restScreen"){
							setTimeout(() => {			
								if(this.flag==false){
									pwi.wakeAndUnlock({"wake":false,"unlock":false});
								}
							},5000)	
						}else if(this.setting.heartbeatError=="shutdown"){
							setTimeout(() => {
								if(this.flag==false)this.shutdown();
							},5000)	
						}	
					}else{
						pwi.wakeAndUnlock({"wake":true,"unlock":true});
					}
				}
				if(this.heartbeatTaskIsOpen){
					setTimeout(async () => {
						this.heartbeatTask();
					},this.setting.heartbeatDetection*1000)
				}
			},
			openHeartbeatTask:function(){
				this.heartbeatTaskIsOpen=true;
				this.heartbeatTask();
			},
			closeHeartbeatTask:function(){
				this.heartbeatTaskIsOpen=false;
			}
		}
	}
</script>

<style>
	.body{
		background-color: #000000;
		width: 100% ;
		height: 100%;
		color: #FFFFFF;
		display: flex; justify-content: center;align-items: center;
	}
</style>
