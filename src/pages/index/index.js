import { Block, View, Image, Navigator, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./index.scss";
import common from "./../../utils/util.js";

export default class Index extends Taro.Component {
	state = {
		info: {
			bgImg: "",
			eventName: "",
			eventDay: 0
		},
		isAnswer: false,
		bgImg: common.defaultBg.index
	};

	componentWillMount() {}

	componentDidShow() {
		let that = this;
		common.checkLogin(
			function() {
				Taro.getStorage({
					key: "launchIndex",
					success: function(res) {
						let num = res.data;
						if (num && num % 3 === 0) {
							Taro.setStorageSync("launchIndex", ++num);
							Taro.switchTab({
								url: "/pages/box/box"
							});
						} else {
							Taro.setStorageSync("launchIndex", ++num);
							that.requestData();
						}
					},
					fail: function() {
						Taro.setStorageSync("launchIndex", 1);
						that.requestData();
					}
				});
			},
			function() {
				Taro.navigateTo({
					url: "/pages/error/error"
				});
			}
		);
	} 

	requestData = () => {
		let that = this;
		common.getRandomOne({}, function(res, code) {
			if (code === 1111 || code == 10001) {
				common.userLogin();
			}
			if (res) {
				that.setState({
					info: {
						bgImg: res.img ? res.cdn + res.img : that.imgBg,
						eventName: res.eventName,
						eventDay: common.formatTimeToNow(res.eventTime)
					},
					isAnswer: true
				});
			}
		});
	};
	imgLoadError = e => {
		const info = this.state
		info.bgImg = common.defaultBg.index;
		this.setState({
			info
		});
	};
	config = {
        disableScroll: true,
        enablePullDownRefresh: false,
	};

	render() {
		const { isAnswer: isAnswer, info: info, bgImg: bgImg } = this.state;
		return (
			<Block>
				{/* pages/index/index.wxml */}
				<View className="container">
					{isAnswer && (
						<Image
							className="containerBg"
							mode="aspectFill"
							src={info.bgImg}
							onError={this.imgLoadError}
						/>
					)}
					{!isAnswer && (
						<Image
							className="containerBg"
							mode="aspectFill"
							src={bgImg}
							onError={this.imgLoadError}
						/>
					)}
					<Navigator openType="switchTab" url="../box/box">
						<View className="content">
							<View className="title">
								<Text className="desc">记录你生命中的最重要时刻</Text>
								<Text className="author">--旧时光</Text>
							</View>
						</View>
						{isAnswer && (
							<View className="eventContent">
								<Text className="dayName">DAY</Text>
								<Text className="dayNum">{info.eventDay}</Text>
								<Text className="eventName">{info.eventName}</Text>
								<Image
									className="seeMore"
									src={require("../../resources/index/right.png")}
									mode="scaleToFill"
								/>
							</View>
						)}
					</Navigator>
				</View>
			</Block>
		);
	}
}

