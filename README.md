# 设计

## 功能
- 在线人数,在线列表,历史人数
  - 用户等级
  - 进场消息
- 管理功能
  - 敏感词
  - 黑名单/白名单,禁言
  - 踢人
  - 查询
- 历史回放,云端存储,推送丢失
  - 提供api,允许拉模式
- 丰富的消息类型
  - 文字,语音,图片,表情
  - 礼物
  - 优先级
- 游客与登录
- 重连(心跳时间)

## 事件系统
- event,action,from,time,data
  - user.message
    - 
  - user.login
  - user.gift
  - system.notify
  - manager.forbidden
  - owner.setManager
  - monitor.
- 错误信息: name,code,message
- 