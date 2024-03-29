import { CacheOptions, CacheValue } from "./types"

const MIN_MAX_CAPACITY = 1
const MAX_MAX_CAPACITY = 1000000

export abstract class AbsCache {
  protected _capacity: number = 0
  constructor(
    protected options: CacheOptions = {
      maxCapacity: 1000,
    }
  ) {
    this.options = {
      ...options,
      maxCapacity: Math.min(
        MAX_MAX_CAPACITY,
        Math.max(MIN_MAX_CAPACITY, options.maxCapacity)
      ),
    }
  }

  get capacity() {
    return this._capacity
  }

  /**
   * Create or update entry in cache
   * @param {PropertyKey} key - Key for the entry
   * @param {CacheValue} value - Value to be stored
   */
  abstract set(key: PropertyKey, value: CacheValue): void

  /**
   * Internal strategy for determining which entry to remove when the capacity limit is reached
   */
  protected abstract evict(): void

  /**
   * Retrieve entry from cache
   * @param {PropertyKey} key - Key associated with the entry
   * @returns {CacheValue} - Value stored in the entry
   */
  abstract get(key: PropertyKey): CacheValue | undefined

  /**
   * Remove entry from cache
   * @param {PropertyKey} key - Key for the entry
   */
  abstract remove(key: PropertyKey): void
  
  /**
   * Remove all entries from cache
   */
  abstract clear(): void
}
