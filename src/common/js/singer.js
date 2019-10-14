// 针对Singer列表项的id,name,avatar进行封装

export default class Singer {
  constructor ({
    id,
    name
  }) {
    this.id = id
    this.name = name
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
