import { UPI_BANKS } from '../constants'

export const validateUpiId = (upiId: string): boolean => {
  return /^[\w.\-]+@[\w]+$/.test(upiId.trim())
}

export const resolveRecipientName = (upiId: string): string => {
  const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh']
  const index = upiId.length % names.length
  return names[index]
}

export const getBankFromUpiId = (upiId: string): string => {
  const suffix = '@' + upiId.split('@')[1]
  const match = UPI_BANKS.find(b => b.suffix === suffix)
  return match ? match.bank : 'Bank Account'
}

export const processPayment = (amount: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const delay = 1500 + Math.random() * 1000
    setTimeout(() => {
      const shouldFail = Math.random() < 0.2
      if (shouldFail) {
        const reasons = [
          'Payment declined by bank',
          'UPI limit exceeded',
          'Insufficient funds',
          'Transaction timed out',
        ]
        reject(reasons[Math.floor(Math.random() * reasons.length)])
      } else {
        resolve()
      }
    }, delay)
  })
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const generateTransactionId = (): string => {
  return 'TXN' + Date.now() + Math.random().toString(36).substring(2, 7).toUpperCase()
}
