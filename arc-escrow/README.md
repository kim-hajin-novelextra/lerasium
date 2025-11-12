# Arc Escrow: Multi-Currency Invoice & Escrow Service## Foundry



> **The fastest, most cost-predictable B2B escrow service for cross-border stablecoin payments on Arc Network****Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**



## 🌟 OverviewFoundry consists of:



Arc Escrow is a smart contract-based escrow system designed for institutional B2B payments on the Arc Network blockchain. It leverages Arc's unique features—**USDC as native gas**, **sub-second finality**, and **deterministic settlement**—to provide enterprise-grade payment infrastructure.- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).

- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.

### Why Arc Network?- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.

- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

1. **Predictable Costs**: All transaction fees paid in USDC (~$0.01 per transaction)

2. **Instant Finality**: Irreversible settlement in <1 second## Documentation

3. **Enterprise Infrastructure**: Built on Malachite (Tendermint BFT) with PoA validators

https://book.getfoundry.sh/

## 🏗️ Architecture

## Usage

### Smart Contract Design

### Build

The system implements a **Mutual Consent with Dispute Arbiter** model:

```shell

```$ forge build

┌─────────────┐```

│   Payee     │  Creates Invoice

│  (Seller)   │──────────┐### Test

└─────────────┘          │

                         ▼```shell

                  ┌─────────────┐$ forge test

┌─────────────┐   │   INVOICE   │```

│   Payer     │──▶│   FUNDED    │

│  (Buyer)    │   └──────┬──────┘### Format

└─────────────┘          │

                         │```shell

        ┌────────────────┼────────────────┐$ forge fmt

        │                │                │```

        ▼                ▼                ▼

   Both Approve     Dispute Raised   Time Passes### Gas Snapshots

        │                │                │

        ▼                ▼                │```shell

   RELEASED         DISPUTED              │$ forge snapshot

   (99 USDC)            │                 │```

                        ▼                 │

                   Arbiter Decides        │### Anvil

                   /           \          │

                  ▼             ▼         │```shell

           Release (97)    Refund (97)    │$ anvil

           to Payee        to Payer       │```

```

### Deploy

### Fee Structure

```shell

| Scenario | Platform Fee | Arbiter Fee | Recipient Receives |$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>

|----------|-------------|-------------|-------------------|```

| **Normal Release** (both approve) | 1% → Treasury | 0% | 99 USDC (from 100) |

| **Disputed Release** (arbiter releases to payee) | 1% → Treasury | 2% → Arbiter | 97 USDC (from 100) |### Cast

| **Disputed Refund** (arbiter refunds to payer) | 1% → Treasury | 2% → Arbiter | 97 USDC (from 100) |

```shell

### State Machine$ cast <subcommand>

```

```solidity

enum InvoiceStatus {### Help

    CREATED,           // Invoice exists but unfunded

    FUNDED,            // Payer deposited funds```shell

    PENDING_APPROVAL,  // One party approved, waiting for other$ forge --help

    RELEASED,          // Funds sent to Payee$ anvil --help

    REFUNDED,          // Funds returned to Payer$ cast --help

    DISPUTED,          // In arbitration```

    CANCELLED          // Cancelled before funding
}
```

## 📦 Project Structure

```
arc-escrow/
├── src/
│   ├── ArcEscrow.sol              # Main escrow contract
│   └── interfaces/
│       └── IERC20.sol             # ERC20 interface for USDC
├── test/
│   └── ArcEscrow.t.sol            # Comprehensive test suite (23 tests)
├── script/
│   └── Deploy.s.sol               # Deployment script
├── foundry.toml                   # Foundry configuration
└── .env.example                   # Environment variable template
```

## 🚀 Quick Start

### Prerequisites

- [Foundry](https://getfoundry.sh/) (forge, cast, anvil)
- Arc Testnet wallet with USDC (from [Circle Faucet](https://faucet.circle.com/))

### Installation

```bash
# Clone the repository
cd arc-escrow

# Install dependencies
forge install

# Copy environment template
cp .env.example .env

# Edit .env with your private key and treasury address
nano .env
```

### Configuration

Edit `.env`:

```ini
ARC_TESTNET_RPC_URL=https://rpc.testnet.arc.network
PRIVATE_KEY=your_private_key_here
TREASURY_ADDRESS=your_treasury_address_here
```

### Compile

```bash
forge build
```

### Test

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific test
forge test --match-test test_BothPartiesApprove_ReleaseFunds -vvv

# Generate gas report
forge test --gas-report
```

### Deploy to Arc Testnet

```bash
# Load environment variables
source .env

# Deploy
forge script script/Deploy.s.sol:DeployArcEscrow \
  --rpc-url $ARC_TESTNET_RPC_URL \
  --broadcast \
  --private-key $PRIVATE_KEY
```

### Verify Contract

```bash
forge verify-contract <CONTRACT_ADDRESS> \
  src/ArcEscrow.sol:ArcEscrow \
  --chain-id 5042002 \
  --constructor-args $(cast abi-encode "constructor(address,address)" $TREASURY_ADDRESS 0x3600000000000000000000000000000000000000)
```

## 📝 Usage Examples

### Creating and Funding an Invoice

```solidity
// Approve USDC spending first
IERC20(usdc).approve(escrowAddress, amount);

// Create and fund invoice
uint256 invoiceId = escrow.createAndFundInvoice(
    payerAddress,      // Who pays
    payeeAddress,      // Who receives
    arbiterAddress,    // Who resolves disputes
    100 * 10**6        // 100 USDC (6 decimals)
);
```

### Normal Approval Flow (No Dispute)

```solidity
// Payer approves
escrow.approveRelease(invoiceId);

// Payee approves - triggers automatic release
escrow.approveRelease(invoiceId);
// ✅ Payee receives 99 USDC, Treasury receives 1 USDC
```

### Dispute Flow

```solidity
// Either party raises dispute
escrow.dispute(invoiceId, "QmIPFShash..."); // IPFS hash of evidence

// Arbiter reviews evidence off-chain and decides

// Option 1: Release to payee
escrow.arbitrateRelease(invoiceId);
// ✅ Payee: 97 USDC, Treasury: 1 USDC, Arbiter: 2 USDC

// Option 2: Refund to payer
escrow.arbitrateRefund(invoiceId);
// ✅ Payer: 97 USDC, Treasury: 1 USDC, Arbiter: 2 USDC
```

## 🧪 Testing

### Test Coverage

- ✅ Constructor validation
- ✅ Invoice creation and funding
- ✅ Approval mechanisms (payer/payee)
- ✅ Mutual consent release
- ✅ Dispute raising
- ✅ Arbitration (release & refund)
- ✅ Fee calculations
- ✅ Access control
- ✅ Admin functions

### Run Tests

```bash
# All tests
forge test

# Specific test pattern
forge test --match-contract ArcEscrowTest --match-test test_Arbitrate

# With stack traces
forge test -vvvv
```

## 🔐 Security Considerations

### Implemented Protections

1. **ReentrancyGuard**: Prevents reentrancy attacks on all state-changing functions
2. **Access Control**: Ownable pattern for admin functions
3. **Input Validation**: Comprehensive checks for zero addresses, amounts, etc.
4. **Custom Errors**: Gas-efficient error handling
5. **Event Logging**: Complete audit trail for all state changes

### USDC-Specific Considerations

- **Blocklist Handling**: Arc enforces USDC blocklists pre-mempool
- **Decimals**: Contract uses 6 decimals (ERC20 USDC standard)
- **Native Integration**: USDC is the native gas token on Arc (18 decimals native balance, 6 decimals ERC20)

## 🛠️ Contract API

### Core Functions

| Function | Access | Description |
|----------|--------|-------------|
| `createAndFundInvoice()` | Anyone | Create invoice and fund in one transaction |
| `approveRelease()` | Payer/Payee | Approve fund release (auto-releases if both approve) |
| `dispute()` | Payer/Payee | Raise dispute with reason/evidence hash |
| `arbitrateRelease()` | Arbiter | Release funds to payee after dispute |
| `arbitrateRefund()` | Arbiter | Refund funds to payer after dispute |
| `updateTreasury()` | Owner | Change treasury address |

### View Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getInvoice(uint256)` | Invoice | Get full invoice details |
| `calculateFees(uint256, bool)` | (platformFee, arbiterFee, netAmount) | Preview fee breakdown |
| `invoiceCount()` | uint256 | Total number of invoices |

## 🌐 Arc Network Details

### Testnet Configuration

| Parameter | Value |
|-----------|-------|
| **Network** | Arc Testnet |
| **Chain ID** | 5042002 |
| **RPC URL** | https://rpc.testnet.arc.network |
| **Explorer** | https://testnet.arcscan.app |
| **Gas Token** | USDC (18 decimals native, 6 decimals ERC20) |
| **USDC Address** | `0x3600000000000000000000000000000000000000` |

### Get Test USDC

Visit [Circle Faucet](https://faucet.circle.com/):
1. Select "Arc Testnet"
2. Paste your wallet address
3. Request testnet USDC

## 📊 Gas Estimates

| Operation | Gas Used | Cost (@ $0.01/tx) |
|-----------|----------|-------------------|
| Create & Fund Invoice | ~275k | ~$0.01 |
| Approve Release | ~50k | <$0.01 |
| Dispute | ~60k | <$0.01 |
| Arbitrate Release | ~100k | <$0.01 |

*Note: Arc's fee smoothing ensures stable costs despite network congestion*

## 🔮 Future Enhancements (Phase 2)

- [ ] Multi-currency support (EURC, USYC)
- [ ] Atomic FX swaps (when Arc FX Engine is available)
- [ ] Batch payment processing
- [ ] Privacy module integration
- [ ] Time-locked auto-release
- [ ] Multi-sig arbiter support
- [ ] Frontend dApp (Next.js + Wagmi)

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass: `forge test`
5. Submit a pull request

## 📞 Support

- **Arc Network Docs**: https://developers.circle.com/arc
- **Issues**: GitHub Issues
- **Security**: Report vulnerabilities to security@example.com

## ⚠️ Disclaimer

This software is provided "as is" without warranty. Testnet deployment only. Not audited. Use at your own risk.

---

**Built with ❤️ for the Arc Network ecosystem**
