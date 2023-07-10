# auto-bi
数据采集 + 输出分析报告，默认使用命令行输出

# 天气预报信息采集测试
node ./dist/cli.js --httpUrl 'http://freecityid.market.alicloudapi.com/whapi/json/alicityweather/briefforecast3days' --httpMethod 'POST' --httpHeader '{"Authorization":"APPCODE 98f0e9f03551478cbddc2c7239adaf4e"}' --httpDataPath 'data.forecast' --httpBody 'cityId={{city}}&token=677282c2f1b3d718152c4e25ed434bc4' --httpLoop '[{"city":2},{"city":30}]' --httpLoopKey 'city'  --dataColumns '[{"title": "predictDate", "dataIndex": "predictDate"}, {"title":"predictDate","dataIndex":"predictDate"},{"title":"tempDay","dataIndex":"tempDay"}]' --dataGroupByKey 'predictDate'
