import {CSRF,HEADERS} from './constant'
import axios from 'axios'

async function parse_data(){
    const initiateId = '051f97b8431ddda09378144cf47ea100'
    // const initiateId = 'c0ec0f05c4ce0e52925d66bcafb8bacc'
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
}

parse_data()