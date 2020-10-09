import {CSRF,HEADERS} from './constant'
import axios from 'axios'

export async function parse_data(){
    // 将分享链接的数据解析出来生成表单数据字典ID，initiateId是你以往表单转发表单里面出现的
    const initiateId = '051f97b8431ddda09378144cf47ea100' //晚检
    // const initiateId = 'c0ec0f05c4ce0e52925d66bcafb8bacc' //晨午检
    const share_url = `https://api.uyiban.com/workFlow/c/share/index?InitiateId=${initiateId}&CSRF=${CSRF}`
    const share_res =await axios.get(share_url,{
        headers: HEADERS
    })
    const save_data_url = share_res.data.data["uri"]
    const save_data_res =await axios.get(save_data_url)
    const FormDataJson = save_data_res.data.Initiate['FormDataJson']
    const dict_form = {}
    FormDataJson.forEach((item)=>{
        dict_form[item.id]=item.value
    })
    console.log(JSON.stringify(dict_form))
    return dict_form
}
// parse_data()