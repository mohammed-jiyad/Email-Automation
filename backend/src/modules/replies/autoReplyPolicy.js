export const AUTO_REPLY_POLICY = {
  "Order Status Request": { enabled: true, threshold: 0.8 },
  "Shipping Update": { enabled: true, threshold: 0.8 },
  "Product Availability": { enabled: true, threshold: 0.8 },
  "Password Reset": { enabled: true, threshold: 0.8 },
  "Abandoned Cart": { enabled: true, threshold: 0.8 },

  "Return Instructions": { enabled: true, threshold: 0.9 },
  "Address Change Request": { enabled: true, threshold: 0.9 },

  "Refund Status": { enabled: false },
  "Declined Payment": { enabled: false },
  "Canceled Order Explanation": { enabled: false },
  "Issue": { enabled: false }
};
