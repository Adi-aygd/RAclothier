import CryptoJS from 'crypto-js';

/**
 * Handle eSewa payment
 * @param {number} total_amount
 * @returns {void}
 */
export const handleEsewaPayment = (total_amount) => {
    const generateSignature = (total_amount, transaction_uuid, product_code) => {
      const secret_key = '8gBm/:&EnhH.1/q';
      const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
      
      // Generate HMAC SHA256  as per eSewa documentation
      const hash = CryptoJS.HmacSHA256(message, secret_key);
      const signature = CryptoJS.enc.Base64.stringify(hash);
      
      return signature;
    };

    const transaction_uuid = `${Date.now()}`;
    const product_code = 'EPAYTEST';
    
    const esewaConfig = {
      amount: total_amount,
      transaction_uuid: transaction_uuid,
      product_code: product_code,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${window.location.origin}/payment-confirmation`,
      failure_url: `${window.location.origin}/checkout`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature: generateSignature(total_amount, transaction_uuid, product_code)
    };

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
    
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