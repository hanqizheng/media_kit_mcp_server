export interface Quote {
  /** 报价单类型 */
  quoteType?: string;
  /** 报价单价格 */
  quotePrice?: number;
}

export interface MediaKit {
  /** 广告位说明 */
  adSpaceDescription?: string;
  /** 广告位尺寸 */
  adSpaceSize?: string;
  /** 报价单 */
  quote?: Quote;
}
