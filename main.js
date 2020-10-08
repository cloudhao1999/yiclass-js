import {parse_data} from './utils'
import {login} from './yiban'

// 获取之前填过的表单的信息，从而进行复用数据
parse_data()

// 登录易班接口
login().then((res)=>{
    let isLogin = res
    if(isLogin===null){
        console.log('帐号或密码错误,请确认账号密码密码无误后重试')
    }else{
        console.log('登录成功，进行二次校验')
    }
})


