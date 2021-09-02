<script>
	import { mapMutations } from 'vuex'
	
	
	let PowerManager=plus.android.importClass('android.os.PowerManager');
	let Uri=plus.android.importClass('android.net.Uri');
	let Context=plus.android.importClass('android.content.Context');
	let Settings=plus.android.importClass('android.provider.Settings');
	let Intent = plus.android.importClass('android.content.Intent');  
	let Build= plus.android.importClass('android.os.Build');
	let main = plus.android.runtimeMainActivity();  
	let pm=main.getSystemService(Context.POWER_SERVICE);

			
	uni.hideTabBar();
	var powerOn=2;
	let recevier = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {  
		onReceive: function(context, intent) {  
		let action = intent.getAction();
		if (action == Intent.ACTION_BATTERY_CHANGED) {  
			let plugged = intent.getIntExtra("plugged",0);
			if(plugged!=powerOn){
				powerOn=plugged;
				if(powerOn==0){
					let setting=uni.getStorageSync("setting");
					let msg="";
					if(setting){
						if(setting.usbPowerOffTimeout!=-1){
							msg=","+setting.usbPowerOffTimeout+"秒后将关机";
							setTimeout(()=>{
								if(powerOn==0)Vue.prototype.shutdown()
							},setting.usbPowerOffTimeout*1000)
						}
					}
					uni.showToast({
						icon:'none',
						title: "USB电源已断开"+msg,
						duration: 2000
					});	
				}
			}
		}
	   }  
	});  
	let IntentFilter = plus.android.importClass('android.content.IntentFilter');  
	let filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);  
	let filter1 = new IntentFilter(Intent.BOOT_COMPLETED);  
	main.registerReceiver(recevier, filter)
	main.registerReceiver(recevier, filter1);
	
	
    export default {
        onLaunch: function() {
			let pwi = uni.requireNativePlugin('lich-PowerOnAutoStart');
			pwi.wakeAndUnlock({"wake":true,"unlock":true});
			let setting=uni.getStorageSync("setting");
			if(setting&&setting.url){
				uni.navigateTo({url:"/pages/show/show",animationType: 'none'});
			}
        },
        onShow: function() {
			let pwi = uni.requireNativePlugin('lich-PowerOnAutoStart');
			pwi.isIgnoringBatteryOptimizations((d)=>{
				if(d){
					pwi.canDrawOverlays((d1)=>{
						
						if(!d1){
							pwi.toastMakeText("请允许弹窗");
							/*uni.showToast({
								icon:'none',
								title: "请允许弹窗",
								duration: 2000
							});	*/
						}
						pwi.setCanDrawOverlays();
					})
				}else{
					pwi.toastMakeText("请忽略电源管理选项");
					
					/*uni.showToast({
						icon:'none',
						title: "请忽略电源管理选项",
						duration: 2000
					});*/	
					pwi.setIgnoringBatteryOptimizations();
				}
			})	
			
        },
        onHide: function() {
        },
		globalData: {
		},
		methods:{
		}
    }
</script>

<style>
    /* #ifndef APP-PLUS-NVUE */
    /* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
    @import './common/uni.css';

	/* H5 兼容 pc 所需 */
	/* #ifdef H5 */
	@media screen and (min-width: 768px) {
		body{
			overflow-y: scroll;
		}
	}

	 /* 顶栏通栏样式 */
	/* .uni-top-window {
	    left: 0;
	    right: 0;
	} */

	uni-page-body {
		background-color: #F5F5F5 !important;
		min-height: 100% !important;
		height: auto !important;
	}

	.uni-top-window uni-tabbar .uni-tabbar {
		background-color: #fff !important;
	}

	.uni-app--showleftwindow .hideOnPc {
		display: none !important;
	}
	/* #endif */

    /* 以下样式用于 hello uni-app 演示所需 */
    page {
        background-color: #efeff4;
        height: 100%;
        font-size: 28rpx;
        line-height: 1.8;
    }
	.fix-pc-padding {
		padding: 0 50px;
	}
    .uni-header-logo {
        padding: 30rpx;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 10rpx;
    }

    .uni-header-image {
        width: 100px;
        height: 100px;
    }

    .uni-hello-text {
        color: #7A7E83;
    }

    .uni-hello-addfile {
        text-align: center;
        line-height: 300rpx;
        background: #FFF;
        padding: 50rpx;
        margin-top: 10px;
        font-size: 38rpx;
        color: #808080;
    }
    /* #endif*/
</style>
