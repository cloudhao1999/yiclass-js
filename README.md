### 易班带缓存打卡
模仿 https://github.com/WadeStack/yiban 做一个js版本的，带一个简单的写死的界面，安装依赖：`npm i`
启动方式：`npm run start`，如果不能运行请安装`npm install babel-cli -g`,采用express作为服务端，接口`submit（已废弃）`需要提供一个form数据，需要的可以通过`util.js`返回值获取，注意`initiateId`为自己过往打卡的表单分享ID。接口`form_detail`可以根据WFID获取表单详情，接口`formPost（主要）`根据前端上传的表单进行登录签到功能

