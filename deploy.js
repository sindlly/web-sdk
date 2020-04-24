// 31环境部署方案
let client = require('scp2');
client.scp('dist/', {
    host: '172.19.3.66',
    username: 'dengxiaoyu',
    password: 'UIOlkj135.',
    readyTimeout:100000,
    path: '/data/www/websdk/dist',   //文件存放在测试机上的路径，与ng配置的路径一直
}, function (err) {
    console.log(err === null || err === undefined ? '部署成功' : err);
});
