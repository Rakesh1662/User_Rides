
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Shield, 
  CheckCircle,
  X,
  Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  bookingDetails: {
    vehicleTitle: string;
    totalAmount: number;
    startDate: string;
    endDate: string;
    totalDays: number;
  };
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  bookingDetails
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    onPaymentSuccess();
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Visa, Mastercard, RuPay'
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'PhonePe, GPay, Paytm'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: <Banknote className="h-5 w-5" />,
      description: 'All major banks supported'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-accent" />
              Secure Payment
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-steel">Vehicle:</span>
                  <span className="font-medium">{bookingDetails.vehicleTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-steel">Duration:</span>
                  <span className="font-medium">{bookingDetails.totalDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-steel">Dates:</span>
                  <span className="font-medium">
                    {bookingDetails.startDate} to {bookingDetails.endDate}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-accent">₹{bookingDetails.totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-secondary transition-colors">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="flex items-center space-x-3 cursor-pointer flex-1">
                      <div className="text-accent">{method.icon}</div>
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-steel">{method.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment Details */}
          {paymentMethod === 'card' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Card Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        number: formatCardNumber(e.target.value)
                      })}
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({
                          ...cardDetails,
                          expiry: formatExpiry(e.target.value)
                        })}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({
                          ...cardDetails,
                          cvv: e.target.value.replace(/[^0-9]/g, '').substring(0, 3)
                        })}
                        maxLength={3}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({
                        ...cardDetails,
                        name: e.target.value
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentMethod === 'upi' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">UPI Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Smartphone className="h-12 w-12 mx-auto text-accent mb-2" />
                      <p className="text-sm text-steel">QR Code will appear here</p>
                      <p className="text-xs text-steel">Scan with any UPI app</p>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <Badge variant="outline">PhonePe</Badge>
                    <Badge variant="outline">Google Pay</Badge>
                    <Badge variant="outline">Paytm</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {paymentMethod === 'netbanking' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Net Banking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <Banknote className="h-16 w-16 mx-auto text-accent" />
                  <p className="text-steel">You will be redirected to your bank's secure login page</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                      <Badge key={bank} variant="outline" className="justify-center py-2">
                        {bank}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-sm text-steel bg-green-50 p-3 rounded-lg">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Your payment is secured with 256-bit SSL encryption</span>
          </div>

          {/* Pay Button */}
          <Button
            className="w-full bg-accent hover:bg-accent/90 h-12 text-lg"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Pay ₹{bookingDetails.totalAmount}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentGateway;
