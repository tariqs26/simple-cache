import { DLL, type DLLNode } from "./dll"
import type { CacheDLLData, CacheOptions } from "./types"

export class LRUCache {
  private _capacity = 0
  private cache = new Map<PropertyKey, DLLNode<CacheDLLData>>()
  private list: DLL<CacheDLLData> = new DLL()

  constructor(private options: CacheOptions = { maxCapacity: 1000 }) {
    this.options = {
      ...options,
      maxCapacity: Math.min(
        Number.MAX_SAFE_INTEGER,
        Math.max(1, options.maxCapacity)
      ),
    }
  }

  get capacity() {
    return this._capacity
  }

  set(key: PropertyKey, value: unknown) {
    const currentNode = this.cache.get(key)
    if (currentNode !== undefined) this.list.remove(currentNode)
    else this._capacity++
    this.cache.set(key, this.list.insert({ key, value }))
    this.evict()
  }

  private evict() {
    if (this.capacity <= this.options.maxCapacity) return
    if (this.list.tail === null) return
    const removalData = this.list.remove(this.list.tail)
    if (removalData === undefined) return
    this.cache.delete(removalData.key)
    this._capacity--
  }

  get(key: PropertyKey) {
    const currentNode = this.cache.get(key)
    if (currentNode === undefined) return
    this.list.remove(currentNode)
    const newNode = this.list.insert(currentNode.data)
    this.cache.set(key, newNode)
    return newNode.data.value
  }

  remove(key: PropertyKey) {
    const currentNode = this.cache.get(key)
    if (currentNode === undefined) return
    this.list.remove(currentNode)
    this.cache.delete(key)
    this._capacity--
  }

  clear() {
    this.cache.clear()
    this.list.clear()
    this._capacity = 0
  }
}
