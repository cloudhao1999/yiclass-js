import axios from 'axios'

let access_token = ''
let name = ''

export async function login(){
    const params = {
        "account": '易班账户',
        "ct": 2,
        "identify": 0,
        "v": "4.7.4",
        "passwd": '易班的密码'
    }

    const r = await axios.get('https://mobile.yiban.cn/api/v2/passport/login',{params})
    if(r&&r['data']['response']=="100"){
        access_token = r["data"]["data"]["access_token"]
        name = r["data"]["data"]["user"]["name"]
        console.log(access_token,name)
        return r
    }else{
        console.log("null")
        return null
    }
}