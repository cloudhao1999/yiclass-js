### 易班自动打卡
模仿 https://github.com/WadeStack/yiban 做一个js版本的，目前先不做界面，安装依赖：`npm i`
启动方式：`npm run start`，如果不能运行请安装`npm install babel-cli -g`,
#### 如何登录自己的账户？ 
1.在`yiban.js`上修改`account`和`passwd`冒号右边的数据，用户名一般为手机号 

![image-20201009130157493](https://gitee.com/cyh199910/personal_picture_bed/raw/master/img/image-20201009130157493.png) 
2.在`utils.js`修改`initiateId`，`initiateId`为你过往打卡的数据分享后的链接里面的ID信息，通常在打开后`我的反馈->拉到最下面转发审批表单->之后会出现一个二维码和链接，链接中就包含了initiateId`

![image-20201009125821374](https://gitee.com/cyh199910/personal_picture_bed/raw/master/img/image-20201009125821374.png)

![image-20201009125924526](https://gitee.com/cyh199910/personal_picture_bed/raw/master/img/image-20201009125924526.png)

![image-20201009125942470](https://gitee.com/cyh199910/personal_picture_bed/raw/master/img/image-20201009125942470.png)

![image-20201009130018882](https://gitee.com/cyh199910/personal_picture_bed/raw/master/img/image-20201009130018882.png)



![image-20201009130105469](https://gitee.com/cyh199910/personal_picture_bed/raw/master/img/image-20201009130105469.png)