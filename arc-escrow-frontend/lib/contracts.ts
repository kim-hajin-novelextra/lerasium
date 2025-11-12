// Contract addresses
export const CONTRACTS = {
  ArcEscrow: '0x914aF65A37CfbD7BBd3cE07f7BA316B185E9529F' as `0x${string}`,
  USDC: '0x3600000000000000000000000000000000000000' as `0x${string}`,
} as const

// Hardcoded arbiter address
export const ARBITER_ADDRESS = '0x23BB8aAc3680b9834712365DAA23555D98C69310' as `0x${string}`

// ArcEscrow ABI
export const ARC_ESCROW_ABI = [
  {
    type: 'constructor',
    inputs: [
      { name: '_treasury', type: 'address' },
      { name: '_usdc', type: 'address' },
    ],
  },
  {
    type: 'function',
    name: 'createAndFundInvoice',
    inputs: [
      { name: '_payer', type: 'address' },
      { name: '_payee', type: 'address' },
      { name: '_arbiter', type: 'address' },
      { name: '_amount', type: 'uint256' },
      { name: '_title', type: 'string' },
    ],
    outputs: [{ name: 'invoiceId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'approveRelease',
    inputs: [{ name: '_invoiceId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'dispute',
    inputs: [
      { name: '_invoiceId', type: 'uint256' },
      { name: '_reason', type: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'arbitrateRelease',
    inputs: [{ name: '_invoiceId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'arbitrateRefund',
    inputs: [{ name: '_invoiceId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getInvoice',
    inputs: [{ name: '_invoiceId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'payer', type: 'address' },
          { name: 'payee', type: 'address' },
          { name: 'arbiter', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'status', type: 'uint8' },
          { name: 'payerApproved', type: 'bool' },
          { name: 'payeeApproved', type: 'bool' },
          { name: 'title', type: 'string' },
          { name: 'disputeReason', type: 'string' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'fundedAt', type: 'uint256' },
          { name: 'resolvedAt', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'invoiceCount',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'calculateFees',
    inputs: [
      { name: '_amount', type: 'uint256' },
      { name: '_isDisputed', type: 'bool' },
    ],
    outputs: [
      { name: 'platformFee', type: 'uint256' },
      { name: 'arbiterFee', type: 'uint256' },
      { name: 'netAmount', type: 'uint256' },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'event',
    name: 'InvoiceCreated',
    inputs: [
      { name: 'invoiceId', type: 'uint256', indexed: true },
      { name: 'payer', type: 'address', indexed: true },
      { name: 'payee', type: 'address', indexed: true },
      { name: 'arbiter', type: 'address', indexed: false },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'FundsDeposited',
    inputs: [
      { name: 'invoiceId', type: 'uint256', indexed: true },
      { name: 'payer', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'ApprovalGranted',
    inputs: [
      { name: 'invoiceId', type: 'uint256', indexed: true },
      { name: 'approver', type: 'address', indexed: true },
      { name: 'isPayer', type: 'bool', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'DisputeRaised',
    inputs: [
      { name: 'invoiceId', type: 'uint256', indexed: true },
      { name: 'disputer', type: 'address', indexed: true },
      { name: 'reason', type: 'string', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'FundsReleased',
    inputs: [
      { name: 'invoiceId', type: 'uint256', indexed: true },
      { name: 'payee', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'platformFee', type: 'uint256', indexed: false },
      { name: 'arbiterFee', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'FundsRefunded',
    inputs: [
      { name: 'invoiceId', type: 'uint256', indexed: true },
      { name: 'payer', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
      { name: 'platformFee', type: 'uint256', indexed: false },
      { name: 'arbiterFee', type: 'uint256', indexed: false },
    ],
  },
] as const

// USDC ERC20 ABI (minimal)
export const USDC_ABI = [
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

// Invoice status enum
export const InvoiceStatus = {
  CREATED: 0,
  FUNDED: 1,
  PENDING_APPROVAL: 2,
  RELEASED: 3,
  REFUNDED: 4,
  DISPUTED: 5,
  CANCELLED: 6,
} as const

export const InvoiceStatusLabel = {
  0: 'Created',
  1: 'Funded',
  2: 'Pending Approval',
  3: 'Released',
  4: 'Refunded',
  5: 'Disputed',
  6: 'Cancelled',
} as const

// Type definitions
export type Invoice = {
  id: bigint
  payer: `0x${string}`
  payee: `0x${string}`
  arbiter: `0x${string}`
  amount: bigint
  status: number
  payerApproved: boolean
  payeeApproved: boolean
  title: string
  disputeReason: string
  createdAt: bigint
  fundedAt: bigint
  resolvedAt: bigint
}
