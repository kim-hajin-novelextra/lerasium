'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useReadContract, useAccount } from 'wagmi'
import { CONTRACTS, ARC_ESCROW_ABI, InvoiceStatusLabel, type Invoice } from '@/lib/contracts'
import { formatUnits } from 'viem'

type ActionCardProps = {
  title: string
  description: string
  href: string
  badge: string
}

type FeatureCardProps = {
  title: string
  description: string
}

function ActionCard({ title, description, href, badge }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="flex h-full flex-col justify-between rounded-2xl border border-gray-800 bg-gray-900/60 p-6 transition hover:border-blue-500 hover:bg-gray-900"
    >
      <div>
        <span className="inline-flex items-center rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-300">
          {badge}
        </span>
        <h4 className="mt-4 text-xl font-semibold">{title}</h4>
        <p className="mt-2 text-sm text-gray-400">{description}</p>
      </div>
      <span className="mt-6 text-sm font-semibold text-blue-300">Open -&gt;</span>
    </Link>
  )
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
      <h4 className="text-lg font-semibold text-white">{title}</h4>
      <p className="mt-3 text-sm text-gray-400">{description}</p>
    </div>
  )
}

function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const { address } = useAccount()
  const isUserInvolved = address && (
    invoice.payer.toLowerCase() === address.toLowerCase() ||
    invoice.payee.toLowerCase() === address.toLowerCase() ||
    invoice.arbiter.toLowerCase() === address.toLowerCase()
  )

  return (
    <Link
      href={`/invoice/${invoice.id}`}
      className="block rounded-xl border border-gray-800 bg-gray-900/60 p-5 hover:border-blue-500 hover:bg-gray-900 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {invoice.title || `Invoice #${invoice.id.toString()}`}
          </span>
          <p className="mt-1 text-2xl font-bold text-white">
            {formatUnits(invoice.amount, 6)} USDC
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          invoice.status === 3 ? 'bg-green-500/20 text-green-400' :
          invoice.status === 5 ? 'bg-red-500/20 text-red-400' :
          invoice.status === 1 ? 'bg-blue-500/20 text-blue-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {InvoiceStatusLabel[invoice.status as keyof typeof InvoiceStatusLabel]}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Payer:</span>
          <span className="font-mono text-gray-300">{invoice.payer.slice(0, 6)}...{invoice.payer.slice(-4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Payee:</span>
          <span className="font-mono text-gray-300">{invoice.payee.slice(0, 6)}...{invoice.payee.slice(-4)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Created:</span>
          <span className="text-gray-300">
            {new Date(Number(invoice.createdAt) * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {isUserInvolved && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs text-blue-400 flex items-center gap-2">
            <span>👤</span> You are involved in this invoice
            <span className="ml-auto">Click to manage →</span>
          </p>
        </div>
      )}
    </Link>
  )
}

export default function Home() {
  const { address } = useAccount()
  
  // Read invoice count
  const { data: invoiceCount } = useReadContract({
    address: CONTRACTS.ArcEscrow,
    abi: ARC_ESCROW_ABI,
    functionName: 'invoiceCount',
  })

  const count = Number(invoiceCount || 0)

  // Read last 10 invoices using fixed hooks (to comply with Rules of Hooks)
  const invoice1 = useReadContract({
    address: CONTRACTS.ArcEscrow,
    abi: ARC_ESCROW_ABI,
    functionName: 'getInvoice',
    args: count >= 1 ? [BigInt(count)] : undefined,
    query: { enabled: count >= 1 },
  })
  const invoice2 = useReadContract({
    address: CONTRACTS.ArcEscrow,
    abi: ARC_ESCROW_ABI,
    functionName: 'getInvoice',
    args: count >= 2 ? [BigInt(count - 1)] : undefined,
    query: { enabled: count >= 2 },
  })
  const invoice3 = useReadContract({
    address: CONTRACTS.ArcEscrow,
    abi: ARC_ESCROW_ABI,
    functionName: 'getInvoice',
    args: count >= 3 ? [BigInt(count - 2)] : undefined,
    query: { enabled: count >= 3 },
  })
  const invoice4 = useReadContract({
    address: CONTRACTS.ArcEscrow,
    abi: ARC_ESCROW_ABI,
    functionName: 'getInvoice',
    args: count >= 4 ? [BigInt(count - 3)] : undefined,
    query: { enabled: count >= 4 },
  })
  const invoice5 = useReadContract({
    address: CONTRACTS.ArcEscrow,
    abi: ARC_ESCROW_ABI,
    functionName: 'getInvoice',
    args: count >= 5 ? [BigInt(count - 4)] : undefined,
    query: { enabled: count >= 5 },
  })
  const invoice6 = useReadContract({
    address: CONTRACTS.ArcEscrow,
    abi: ARC_ESCROW_ABI,
    functionName: 'getInvoice',
    args: count >= 6 ? [BigInt(count - 5)] : undefined,
    query: { enabled: count >= 6 },
  })

  const invoices = [
    invoice1.data,
    invoice2.data,
    invoice3.data,
    invoice4.data,
    invoice5.data,
    invoice6.data,
  ].filter((inv): inv is Invoice => inv !== undefined)

  // Filter to only show invoices where user is involved
  const userInvoices = address ? invoices.filter(invoice => 
    invoice.payer.toLowerCase() === address.toLowerCase() ||
    invoice.payee.toLowerCase() === address.toLowerCase() ||
    invoice.arbiter.toLowerCase() === address.toLowerCase()
  ) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <header className="border-b border-gray-800 bg-gray-900/70 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-lg font-semibold">A</span>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-400">Arcscrow</p>
              <h1 className="text-xl font-semibold">Payment Escrow on Arc Network</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://faucet.circle.com/?_gl=1*2rcr6z*_gcl_au*MTU5NDk5NzY1MC4xNzYyNjk2ODI2"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-all text-sm font-medium"
            >
              <span>💧</span>
              <span>Get USDC</span>
            </a>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center md:text-left">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-blue-400">
            Sub-second settlement - Deterministic finality - USDC native
          </p>
          <div className="mt-6 max-w-4xl space-y-6">
            <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
              Secure escrow workflows for high trust transactions.
            </h2>
            <p className="text-lg text-gray-300 md:text-xl">
              Hold funds in programmable escrow, route approvals on chain, and resolve disputes with a designated arbiter.
            </p>
            <div>
              <Link
                href="/create"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 font-semibold transition hover:from-blue-600 hover:to-purple-700"
              >
                Create Invoice
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-16">
          <ActionCard
            title="Create a USDC Escrow"
            description="Create a new escrow invoice with a payee address. Funds are held securely until you approve the payee's work or a dispute is resolved."
            href="/create"
            badge="Role based"
          />
        </section>

        <section className="mt-16 rounded-2xl border border-gray-800 bg-gray-900/60 p-8">
          <h3 className="text-2xl font-semibold">How Arcscrow Works</h3>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Sequential Approval"
              description="Payer creates and funds the invoice. Payee requests payment after completing work. Payer then approves release or raises a dispute."
            />
            <FeatureCard
              title="Dispute Resolution"
              description="The payer can dispute before funds are released. A designated arbiter reviews the case and decides to release funds or refund the payer."
            />
            <FeatureCard
              title="Arc Network Native"
              description="Runs on Arc Testnet with deterministic finality and USDC as the native gas token for stable transactions."
            />
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-gray-800 bg-gray-900/40 p-8">
          <h3 className="text-2xl font-semibold mb-6">Your Invoices</h3>
          {!address ? (
            <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-6 text-center text-gray-400">
              <p className="text-lg font-medium">Connect your wallet</p>
              <p className="mt-2 text-sm">Connect your wallet to view invoices you're involved in.</p>
            </div>
          ) : userInvoices.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-6 text-center text-gray-400">
              <p className="text-lg font-medium">No invoices found</p>
              <p className="mt-2 text-sm">You have no invoices as a payer or payee yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {userInvoices.map(invoice => (
                <InvoiceCard key={invoice.id.toString()} invoice={invoice} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-gray-800 bg-gray-900/70 py-6 text-center text-sm text-gray-500">
        <p>Deployed to Arc Testnet by <a href="https://x.com/EtherPhantasm" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">EtherPhantasm</a></p>
      </footer>
    </div>
  )
}
