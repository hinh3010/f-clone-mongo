export const data = [
  { email: ['john.adu@example.com', 'john.adu@example.com', 'john.adu@example.com'], name: 'John Adu', age: 22 },
  { email: ['john.adu@example.com'], name: 'John Adu', age: 22 }
]

export const headerSummary = [
  { header: 'Store ID', key: 'storeId', width: 10 },
  { header: 'URL', key: 'URL', width: 20 },
  { header: 'Time', key: 'time', width: 20 },
  { header: 'Cashback', key: 'cashback', width: 20 },
  { header: 'Paid', key: 'paid', width: 20 },
  { header: 'Link detail', key: 'link', width: 50 },
  { header: 'Product + Condition + Tier', key: 'condition', width: 50 },
  { header: 'Product Type', key: 'productType', width: 40 },
  { header: 'Cashback', key: 'cashback', width: 40 }
]

const details = [
  {
    productType: 'CUSTOM_ORNAMENT_1D',
    cashback: 'Tier 3-reduce $0.2/unit'
  },
  {
    productType: 'CUSTOM_ORNAMENT_2D',
    cashback: 'Tier 3-reduce $0.2/unit'
  },
  {
    productType: 'CUSTOM_ORNAMENT_3D',
    cashback: 'Tier 3-reduce $0.2/unit'
  },
  {
    productType: 'CUSTOM_ORNAMENT_4D',
    cashback: 'Tier 3-reduce $0.2/unit'
  },
  {
    productType: 'CUSTOM_ORNAMENT_5D',
    cashback: 'Tier 3-reduce $0.2/unit'
  },
  {
    productType: 'CUSTOM_ORNAMENT_6D',
    cashback: 'Tier 3-reduce $0.2/unit'
  },
  {
    productType: 'CUSTOM_ORNAMENT_7D',
    cashback: 'Tier 3-reduce $0.2/unit'
  },
  {
    productType: 'CUSTOM_ORNAMENT_8D',
    cashback: 'Tier 3-reduce $0.2/unit'
  },
  {
    productType: 'CUSTOM_ORNAMENT_9D',
    cashback: 'Tier 3-reduce $0.2/unit'
  }
]

export const summaryStatistic = [
  {
    storeId: 'storeId',
    URL: 'storeUrl',
    time: '20/10/2022',
    cashback: '$80.9',
    paid: '$80.9',
    link: 'link.csv.detail.store',
    condition: 'Offer of CPH, tier max does not require volume, apply for an additional 9 months from September 2022 to May 2023',
    details
  },
  {
    storeId: 'storeId',
    URL: 'storeUrl',
    time: '20/10/2022',
    cashback: '$80.9',
    paid: '$80.9',
    link: 'link.csv.detail.store',
    condition: 'Offer of CPH, tier max does not require volume, apply for an additional 9 months from September 2022 to May 2023',
    details
  },
  {
    storeId: 'storeId',
    URL: 'storeUrl',
    time: '20/10/2022',
    cashback: '$80.9',
    paid: '$80.9',
    link: 'link.csv.detail.store',
    condition: 'Offer of CPH, tier max does not require volume, apply for an additional 9 months from September 2022 to May 2023',
    details: [details[0], details[1]]
  },
  {
    storeId: 'storeId',
    URL: 'storeUrl',
    time: '20/10/2022',
    cashback: '$80.9',
    paid: '$80.9',
    link: 'link.csv.detail.store',
    condition: 'Offer of CPH, tier max does not require volume, apply for an additional 9 months from September 2022 to May 2023',
    details: [details[0]]
  }
]

export const headerStore = [
  { header: 'Store', key: 'store', width: 20 },
  { header: 'Order number', key: 'orderCode', width: 20 },
  { header: 'Package number', key: 'totalFulfillment', width: 20 },
  { header: 'Product type', key: 'productType', width: 20 },
  { header: 'Quantity', key: 'quantity', width: 20 },
  { header: 'Buyer Paid At', key: 'buyerPaidAt', width: 20 },
  { header: 'Seller Paid At', key: 'sellerPaidAt', width: 20 },
  { header: 'Discount Amount', key: 'discountAmount', width: 20 },
  { header: 'Country Code', key: 'countryCode', width: 20 },
  { header: 'Cashback', key: 'cashback', width: 20 }
]
export const storesStatistic = [
  {
    id: 'adu',
    statistic: [
      {
        store: 'namespace + url',
        orderCode: 'RP-73522-59997',
        totalFulfillment: 2,
        productType: 'T-SHIRT_PU',
        quantity: 2,
        buyerPaidAt: '3/31/2023 2:00:41',
        sellerPaidAt: '3/31/2023 2:00:41',
        discountAmount: 1,
        countryCode: 'US',
        cashback: 0.5
      },
      {
        store: 'namespace + url',
        orderCode: 'RP-73522-59997',
        totalFulfillment: 2,
        productType: 'T-SHIRT_PU',
        quantity: 2,
        buyerPaidAt: '3/31/2023 2:00:41',
        sellerPaidAt: '3/31/2023 2:00:41',
        discountAmount: 1,
        countryCode: 'US',
        cashback: 0.5
      }
    ]
  },
  {
    id: 'adu1',
    statistic: [
      {
        store: 'namespace + url',
        orderCode: 'RP-73522-59997',
        totalFulfillment: 2,
        productType: 'T-SHIRT_PU',
        quantity: 2,
        buyerPaidAt: '3/31/2023 2:00:41',
        sellerPaidAt: '3/31/2023 2:00:41',
        discountAmount: 1,
        countryCode: 'US',
        cashback: 0.5
      },
      {
        store: 'namespace + url',
        orderCode: 'RP-73522-59997',
        totalFulfillment: 2,
        productType: 'T-SHIRT_PU',
        quantity: 2,
        buyerPaidAt: '3/31/2023 2:00:41',
        sellerPaidAt: '3/31/2023 2:00:41',
        discountAmount: 1,
        countryCode: 'US',
        cashback: 0.5
      }
    ]
  },
  {
    id: 'adu2',
    statistic: [
      {
        store: 'namespace + url',
        orderCode: 'RP-73522-59997',
        totalFulfillment: 2,
        productType: 'T-SHIRT_PU',
        quantity: 2,
        buyerPaidAt: '3/31/2023 2:00:41',
        sellerPaidAt: '3/31/2023 2:00:41',
        discountAmount: 1,
        countryCode: 'US',
        cashback: 0.5
      },
      {
        store: 'namespace + url',
        orderCode: 'RP-73522-59997',
        totalFulfillment: 2,
        productType: 'T-SHIRT_PU',
        quantity: 2,
        buyerPaidAt: '3/31/2023 2:00:41',
        sellerPaidAt: '3/31/2023 2:00:41',
        discountAmount: 1,
        countryCode: 'US',
        cashback: 0.5
      }
    ]
  }
]
