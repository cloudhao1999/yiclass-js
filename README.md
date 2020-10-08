### 易班自动打卡
模仿 https://github.com/WadeStack/yiban 做一个js版本的，目前先不做界面，安装依赖：`npm i`
启动方式：`npm run start`，如果不能运行请安装`npm install babel-cli -g`,
#### 如何登录自己的账户？ 
1.在`yiban.js`上修改account和passwd冒号右边的数据，用户名一般为手机号  
2.在`utils.js`修改initiateId，initiateId为你过往打卡的数据分享后的链接里面的ID信息，通常在打开后`我的反馈->拉到最下面转发审批表单->之后会出现一个二维码和链接，链接中就包含了initiateId`
