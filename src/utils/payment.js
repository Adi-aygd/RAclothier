import CryptoJS from 'crypto-js';

// eSewa Test Environment Configuration
const ESEWA_CONFIG = {
  PAYMENT_URL: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  SECRET_KEY: '8gBm/:&EnhH.1/q',
  PRODUCT_CODE: 'EPAYTEST'
};

/**
 * Handle eSewa payment
 * @param {number} total_amount
 * @returns {void}
 */
export const handleEsewaPayment = (cartTotal, taxAmount = 0, shippingAmount = 0) => {
    // Calculate amounts according to eSewa requirements
    const amount = cartTotal;
    const tax_amount = taxAmount;
    const product_service_charge = 0;
    const product_delivery_charge = shippingAmount;
    const total_amount = amount + tax_amount + product_service_charge + product_delivery_charge;
    
    console.log('Payment amounts:', { amount, tax_amount, product_delivery_charge, total_amount });
    
    if (!total_amount || total_amount <= 0) {
      throw new Error('Invalid total amount');
    }
    
    const generateSignature = (params) => {
      const message = `total_amount=${params.total_amount},transaction_uuid=${params.transaction_uuid},product_code=${params.product_code}`;
      console.log('Signature message:', message);
      
      // Generate HMAC SHA256 signature
      const hash = CryptoJS.HmacSHA256(message, ESEWA_CONFIG.SECRET_KEY);
      const signature = CryptoJS.enc.Base64.stringify(hash);
      
      console.log('Generated signature:', signature);
      
      return signature;
    };

    // Generate unique transaction UUID (should be unique for each transaction)
    const transaction_uuid = `${Date.now()}`;
    const product_code = ESEWA_CONFIG.PRODUCT_CODE;
        
    const paymentParams = {
      amount: amount,
      tax_amount: tax_amount,
      total_amount: total_amount,
      transaction_uuid: transaction_uuid,
      product_code: product_code,
      product_service_charge: product_service_charge,
      product_delivery_charge: product_delivery_charge,
      success_url: `${window.location.origin}/order-confirmation`,
      failure_url: `${window.location.origin}/checkout`,
      signed_field_names: 'total_amount,transaction_uuid,product_code'
    };
    
    // Generate signature and add to params
    const esewaConfig = {
      ...paymentParams,
      signature: generateSignature(paymentParams)
    };
    
    console.log('Final eSewa Config:', esewaConfig);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = ESEWA_CONFIG.PAYMENT_URL;
    
    Object.keys(esewaConfig).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = esewaConfig[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

/**
 * Test signature generation with known values from eSewa documentation
 * This function helps debug signature generation issues
 */
export const testEsewaSignature = () => {
  const testParams = {
    total_amount: 100,
    transaction_uuid: '11-201-13',
    product_code: 'EPAYTEST'
  };
  
  const message = `total_amount=${testParams.total_amount},transaction_uuid=${testParams.transaction_uuid},product_code=${testParams.product_code}`;
  console.log('Test message:', message);
  
  const hash = CryptoJS.HmacSHA256(message, ESEWA_CONFIG.SECRET_KEY);
  const signature = CryptoJS.enc.Base64.stringify(hash);
  
  console.log('Test signature:', signature);
  console.log('Expected signature (from eSewa docs): Should be similar format');
  
  return signature;
};