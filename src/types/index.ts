export interface Transaction {
  id: string
  upiId: string
  recipientName: string
  amount: number
  status: 'success' | 'failed'
  timestamp: number
  note?: string
  failureReason?: string
}

export interface PaymentFlowState {
  upiId: string
  recipientName: string
  amount: number
  note: string
}

export type RootStackParamList = {
  Home: undefined
  Amount: { upiId: string; recipientName: string }
  Confirm: { upiId: string; recipientName: string; amount: number; note: string }
  Processing: { upiId: string; recipientName: string; amount: number; note: string }
  Result: { status: 'success' | 'failed'; amount: number; upiId: string; failureReason?: string }
  History: undefined
}
