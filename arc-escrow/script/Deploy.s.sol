// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/ArcEscrow.sol";

/**
 * @title DeployArcEscrow
 * @notice Deployment script for ArcEscrow contract on Arc Testnet
 * @dev Run with: forge script script/Deploy.s.sol:DeployArcEscrow --rpc-url $ARC_TESTNET_RPC_URL --broadcast --private-key $PRIVATE_KEY
 */
contract DeployArcEscrow is Script {
    // Arc Testnet USDC address
    address constant ARC_USDC = 0x3600000000000000000000000000000000000000;
    
    function run() external {
        // Read environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address treasury = vm.envAddress("TREASURY_ADDRESS");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy ArcEscrow
        ArcEscrow escrow = new ArcEscrow(treasury, ARC_USDC);
        
        vm.stopBroadcast();
        
        // Log deployment info
        console.log("========================================");
        console.log("Arc Escrow Deployment Complete");
        console.log("========================================");
        console.log("Network: Arc Testnet");
        console.log("Chain ID: 5042002");
        console.log("========================================");
        console.log("Deployed Contracts:");
        console.log("ArcEscrow:", address(escrow));
        console.log("========================================");
        console.log("Configuration:");
        console.log("Treasury:", treasury);
        console.log("USDC Address:", escrow.USDC());
        console.log("Platform Fee:", escrow.PLATFORM_FEE_BPS(), "bps (1%)");
        console.log("Arbiter Fee:", escrow.ARBITER_FEE_BPS(), "bps (2%)");
        console.log("========================================");
        console.log("Verification Command:");
        console.log("forge verify-contract", address(escrow), "src/ArcEscrow.sol:ArcEscrow");
        console.log("  --chain-id 5042002");
        console.log("  --constructor-args $(cast abi-encode 'constructor(address,address)' ", treasury, ARC_USDC, ")");
        console.log("========================================");
    }
}
