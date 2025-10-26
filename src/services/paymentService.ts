import axiosinstance from '@/axiosinstance/axiosinstance';

// Razorpay types
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color: string;
  };
}

interface PaymentOrderResponse {
  payment: {
    id: string;
    razorpayOrderId: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  };
  razorpayOrder: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
  };
}

interface PaymentVerificationResponse {
  payment: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    razorpayPaymentId: string;
  };
  order: {
    id: string;
    status: string;
    paymentStatus: string;
  };
}

class PaymentService {
  private razorpayKey: string;

  constructor() {
    // In production, this should come from environment variables
    this.razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  }

  // Load Razorpay script dynamically
  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Create payment order
  async createPaymentOrder(orderId: string, guestInfo?: {
    email: string;
    name: string;
    phone: string;
  }): Promise<PaymentOrderResponse> {
    try {
      const requestData: any = { orderId };
      
      if (guestInfo) {
        requestData.guestInfo = guestInfo;
      }

      const response = await axiosinstance.post('/api/payments/create-order', requestData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create payment order');
    }
  }

  // Verify payment
  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    guestInfo?: {
      email: string;
      phone: string;
    }
  ): Promise<PaymentVerificationResponse> {
    try {
      const requestData: any = {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      };

      if (guestInfo) {
        requestData.guestInfo = guestInfo;
      }

      const response = await axiosinstance.post('/api/payments/verify', requestData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to verify payment');
    }
  }

  // Open Razorpay checkout
  async openRazorpayCheckout(
    orderId: string,
    userInfo?: {
      name: string;
      email: string;
      phone: string;
    },
    guestInfo?: {
      email: string;
      name: string;
      phone: string;
    }
  ): Promise<PaymentVerificationResponse> {
    try {
      // Load Razorpay script
      const scriptLoaded = await this.loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Create payment order
      const paymentOrder = await this.createPaymentOrder(orderId, guestInfo);

      // Prepare Razorpay options
      const options: RazorpayOptions = {
        key: this.razorpayKey,
        amount: paymentOrder.razorpayOrder.amount,
        currency: paymentOrder.razorpayOrder.currency,
        name: 'Yuca Lifestyle',
        description: `Order #${orderId}`,
        order_id: paymentOrder.razorpayOrder.id,
        prefill: {
          name: userInfo?.name || guestInfo?.name,
          email: userInfo?.email || guestInfo?.email,
          contact: userInfo?.phone || guestInfo?.phone,
        },
        notes: {
          orderId: orderId,
        },
        theme: {
          color: '#8B7355', // Autumn fern color
        },
        handler: async (response: any) => {
          try {
            console.log('Payment successful, verifying...', response);
            // Verify payment
            const verificationResult = await this.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              guestInfo
            );
            
            console.log('Payment verified successfully:', verificationResult);
            return verificationResult;
          } catch (error) {
            console.error('Payment verification failed:', error);
            throw error;
          }
        },
      };

      // Open Razorpay checkout
      return new Promise((resolve, reject) => {
        // Override the handler to resolve the promise
        options.handler = async (response: any) => {
          try {
            console.log('Payment successful, verifying...', response);
            // Verify payment
            const verificationResult = await this.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              guestInfo
            );
            
            console.log('Payment verified successfully:', verificationResult);
            resolve(verificationResult);
          } catch (error) {
            console.error('Payment verification failed:', error);
            reject(error);
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        
        razorpay.on('payment.failed', (response: any) => {
          console.error('Payment failed:', response.error);
          reject(new Error(`Payment failed: ${response.error.description}`));
        });

        razorpay.open();
      });
    } catch (error) {
      throw error;
    }
  }

  // Get payment status
  async getPaymentStatus(razorpayOrderId: string) {
    try {
      const response = await axiosinstance.get(`/api/payments/status/${razorpayOrderId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get payment status');
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
