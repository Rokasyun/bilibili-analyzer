// 代理池管理
export interface ProxyConfig {
  host: string
  port: number
  protocol: 'http' | 'https'
  failed?: boolean
}

// 免费代理列表（定期更新）
const proxyList: ProxyConfig[] = [
  // 国内免费代理
  { host: '121.37.201.60', port: 8080, protocol: 'http' },
  { host: '47.113.230.224', port: 8118, protocol: 'http' },
  { host: '39.107.33.254', port: 8090, protocol: 'http' },
  { host: '120.234.223.159', port: 9002, protocol: 'http' },
  { host: '60.167.103.158', port: 8060, protocol: 'http' },
  { host: '114.231.8.204', port: 8089, protocol: 'http' },
  { host: '117.69.200.178', port: 8089, protocol: 'http' },
  { host: '123.182.58.212', port: 8089, protocol: 'http' },
  { host: '58.20.248.139', port: 9002, protocol: 'http' },
  { host: '47.113.179.6', port: 8081, protocol: 'http' },
  
  // 备用代理
  { host: '183.220.145.3', port: 80, protocol: 'http' },
  { host: '115.223.11.212', port: 8060, protocol: 'http' },
  { host: '121.43.185.43', port: 8089, protocol: 'http' },
  { host: '39.107.121.157', port: 8080, protocol: 'http' },
  { host: '47.92.254.217', port: 8118, protocol: 'http' },
]

class ProxyPool {
  private proxies: ProxyConfig[]
  private currentIndex: number = -1
  private allFailed: boolean = false

  constructor(proxies: ProxyConfig[]) {
    this.proxies = proxies.map(p => ({ ...p, failed: false }))
    this.shuffle() // 初始化时打乱顺序
  }

  // 打乱代理顺序（随机）
  private shuffle() {
    for (let i = this.proxies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.proxies[i], this.proxies[j]] = [this.proxies[j], this.proxies[i]]
    }
  }

  // 获取下一个可用代理
  getNext(): ProxyConfig | null {
    if (this.allFailed) {
      console.log('⚠️  所有代理都已失效')
      return null
    }

    // 尝试找到下一个未失败的代理
    for (let i = 0; i < this.proxies.length; i++) {
      this.currentIndex = (this.currentIndex + 1) % this.proxies.length
      const proxy = this.proxies[this.currentIndex]
      
      if (!proxy.failed) {
        console.log(`🔄 使用代理: ${proxy.host}:${proxy.port}`)
        return proxy
      }
    }

    // 所有代理都失败了
    this.allFailed = true
    console.log('❌ 所有代理都已失效')
    return null
  }

  // 标记当前代理失败
  markCurrentFailed() {
    if (this.currentIndex >= 0 && this.currentIndex < this.proxies.length) {
      const proxy = this.proxies[this.currentIndex]
      proxy.failed = true
      console.log(`❌ 代理失效: ${proxy.host}:${proxy.port}`)
    }
  }

  // 获取当前代理
  getCurrent(): ProxyConfig | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.proxies.length) {
      return this.proxies[this.currentIndex]
    }
    return null
  }

  // 重置所有代理状态
  reset() {
    this.proxies.forEach(p => p.failed = false)
    this.allFailed = false
    this.currentIndex = -1
    this.shuffle()
    console.log('🔄 代理池已重置')
  }

  // 获取可用代理数量
  getAvailableCount(): number {
    return this.proxies.filter(p => !p.failed).length
  }

  // 检查是否所有代理都失效
  isAllFailed(): boolean {
    return this.allFailed
  }
}

// 创建全局代理池实例
export const proxyPool = new ProxyPool(proxyList)

// 导出配置转换函数
export function proxyConfigToAxios(proxy: ProxyConfig | null) {
  if (!proxy) return undefined
  
  return {
    protocol: proxy.protocol,
    host: proxy.host,
    port: proxy.port
  }
}
