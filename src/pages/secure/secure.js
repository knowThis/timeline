import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './secure.scss'

export default class Secure extends Taro.Component {

  render() {
    return (
      <View className="secure">
        <View className="header">
          <View className="header-content">记录你生命中最重要的时刻</View>
        </View>
        <View className="container">
          <View className="group-area group-secure">
            <View className="form-group">
              <View className="form-group-label">
                <Text className="form-group-title">输入密码</Text>
              </View>
              <View className="form-group-input-container">
                <Input className="form-group-input" type="password" />
              </View>
            </View>
            <View className="form-group">
              <View className="form-group-label">
                <Text className="form-group-title">确认密码</Text>
              </View>
              <View className="form-group-input-container">
                <Input className="form-group-input" type="password" />
              </View>
            </View>
          </View>
        </View>
        <View className="btn-group secure-btn-save">
          <Button
            className="btn-save"
            onClick={this.formSaveData}
            hoverClass="button-hover"
            size="default"
          >
            保存
          </Button>
        </View>
      </View>
    )
  }
} // pages/secure/secure.js

