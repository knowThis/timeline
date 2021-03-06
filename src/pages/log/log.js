import {Block, ScrollView, View} from '@tarojs/components'
import Taro from '@tarojs/taro'
import './log.scss'
import common from './../../utils/util.js'
// pages/log/log.js


export default class Log extends Taro.Component {
    state = {
        list: []
    }

    componentDidShow() {
        this.getList()
    }

    getList = () => {
        let that = this
        common.getUpdateList({}, function (res) {
            that.setState({list: res})
            Taro.stopPullDownRefresh()
        })
    }
    onPullDownRefresh = () => {
        this.getList()
    }
    config = {}

    render() {
        const {list: list} = this.state
        return (
            <ScrollView className="log" scrollY="true">
                {list.map((item, indexId) => {
                    return (
                        <Block key="id">
                            <View className="log-item">
                                <View className="log-title">{item.time + '更新日志'}</View>
                                <View className="log-content">{item.content}</View>
                            </View>
                        </Block>
                    )
                })}
            </ScrollView>
        )
    }
}

