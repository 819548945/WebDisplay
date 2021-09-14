<template>
	<view>
		<view class="uni-padding-wrap uni-common-mt">
				<form @submit="save">
					<view class="uni-form-item uni-column">
						<view class="title">服务地址</view>
						<input class="uni-input" v-model="setting.url"  placeholder="http://ip:port" />
					</view>
					<button class="mini-btn" @click="check" :loading="checkLoading" type="default" size="mini">测试</button>
					<view class="uni-form-item uni-column">
						<view class="title" >开机自启动</view>
						<view>
							<switch name="autoStart" @change="autoStartChange" :checked="ind.autoStart"  />
						</view>
					</view>
					<view class="uni-title uni-common-pl">USB断电关机超时(需要ROOT)</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left">
								当前选择
							</view>
							<view class="uni-list-cell-db">
								<picker @change="usbPowerOffTimeoutChange" :value="ind.uptc" :range="usbPowerOffTimeouts" range-key="key">
									<view class="uni-input">{{usbPowerOffTimeouts[ind.uptc].key}}</view>
								</picker>
							</view>
						</view>
					</view>
					<view class="uni-title uni-common-pl">服务地址心跳检测周期</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left">
								当前选择
							</view>
							<view class="uni-list-cell-db">
								<picker @change="heartbeatDetectionChange"  :value="ind.hd" :range="heartbeatDetections" range-key="key">
									<view class="uni-input">{{heartbeatDetections[ind.hd].key}}</view>
								</picker>
							</view>
						</view>
					</view>
					<view class="uni-title uni-common-pl">心跳检测失败动作</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left">
								当前选择
							</view>
							<view class="uni-list-cell-db">
								<picker @change="heartbeatErrorChange"  :value="ind.he" :range="heartbeatErrors" range-key="key">
									<view class="uni-input">{{heartbeatErrors[ind.he].key}}</view>
								</picker>
							</view>
						</view>
					</view>
					<view class="uni-title uni-common-pl">展示模式</view>
					<view class="uni-list">
						<view class="uni-list-cell">
							<view class="uni-list-cell-left">
								当前选择
							</view>
							<view class="uni-list-cell-db">
								<picker @change="orientationChange"  :value="ind.o" :range="orientations" range-key="key">
									<view class="uni-input">{{orientations[ind.o].key}}</view>
								</picker>
							</view>
						</view>
					</view>
					<view class="uni-form-item uni-column">
						<view class="title">展示亮度</view>
						<slider  name="brightness" :value="setting.brightness" show-value></slider>
					</view>
					<view class="uni-padding-wrap uni-common-mt b">
						<button form-type="submit">保存配置</button>
					</view>	
					
				</form>
			
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				checkLoading:false,
				setting:{url:"",brightness:59,usbPowerOffTimeout:"-1",heartbeatDetection:"10",heartbeatError:"restScreen",orientation:"portrait-primary"},
				ind:{uptc:0,hd:0,he:0,o:0,b:0,autoStart:true},
				usbPowerOffTimeouts:[{key:"不关机",value:"-1"},{key:"1秒",value:"1"},{key:"5秒",value:"5"},{key:"10秒",value:"10"},{key:"20秒",value:"20"},{key:"40秒",value:"40"},{key:"60秒",value:"60"}],
				heartbeatDetections:[{key:"10秒",value:"10"},{key:"20秒",value:"20"},{key:"40秒",value:"40"},{key:"60秒",value:"60"}],
				heartbeatErrors:[{key:"息屏",value:"restScreen"},{key:"关机(需要ROOT)",value:"shutdown"},{key:"保持常亮",value:"none"}],
				orientations:[{key:"正常",value:"portrait-primary"},{key:"顺时针旋转90°",value:"landscape-primary"},{key:"顺时针旋转180°",value:"portrait-secondary"},{key:"顺时针旋转270°",value:"landscape-secondary"}]
			}
		},
		onShow(){
			let pwi = uni.requireNativePlugin('lich-PowerOnAutoStart');
			pwi.isPowerOnAutoStart((d)=>{
					this.ind.autoStart=d;
			})
			let setting=uni.getStorageSync("setting");
			if(!setting){
				uni.setStorageSync("setting",this.setting);
			}
			else this.setting=setting;
			this.ind.uptc=this.valueToIndex(this.usbPowerOffTimeouts,this.setting.usbPowerOffTimeout);
			this.ind.hd=this.valueToIndex(this.heartbeatDetections,this.setting.heartbeatDetection);
			this.ind.he=this.valueToIndex(this.heartbeatErrors,this.setting.heartbeatError);
			this.ind.o=this.valueToIndex(this.orientations,this.setting.orientation);
			this.ind.b=this.setting.brightness;
		},
		methods: {
			brightnessChange:function(e){
				this.setting.brightness=e.detail.value;
			},
			usbPowerOffTimeoutChange: function(e) {
				this.ind.uptc = e.detail.value;	
				this.setting.usbPowerOffTimeout=this.usbPowerOffTimeouts[this.ind.uptc].value;
			},
			heartbeatDetectionChange:function(e){
				this.ind.hd = e.detail.value;
				this.setting.heartbeatDetection=this.heartbeatDetections[this.ind.hd].value;
			},
			heartbeatErrorChange:function(e){
				this.ind.he = e.detail.value;
				this.setting.heartbeatError=this.heartbeatErrors[this.ind.he].value;
			},
			orientationChange:function(e){
				this.ind.o = e.detail.value;
				this.setting.orientation=this.orientations[this.ind.o].value;
			},
			autoStartChange:function(e){
				this.ind.autoStart = e.detail.value;
				console.log(this.ind.autoStart);
			},
			valueToIndex:function(d,v){
				let index;
				for(var i=0;i<d.length;i++){
					if(v==d[i].value){
						index=i;
						break;
					}
				}
				return i;
			},
			check:async function(){
				this.checkLoading=true;
				let message="333"
				if(await this.checkUrl(this.setting.url))message="地址可以访问"
				else message="地址无法访问";
				console.log(message)
				let pwi = uni.requireNativePlugin('lich-PowerOnAutoStart');
				pwi.toastMakeText(message);
				/*uni.showToast({
					icon:'none',
					title: message,
					duration: 5000,
					
				});	*/
				this.checkLoading=false;
			},
			save:async function(e){
				let pwi = uni.requireNativePlugin('lich-PowerOnAutoStart');
				pwi.setPowerOnAutoStart(this.ind.autoStart);
				this.setting.brightness=e.detail.value.brightness;
				uni.setStorageSync("setting",this.setting);
				uni.navigateTo({url:"/pages/show/show",animationType: 'none'});
			}
		}
	}
</script>

<style>
	.uni-form-item .title {
		padding: 20rpx 0;
	}
	.b{
		margin-bottom: 100px;
	}
</style>
