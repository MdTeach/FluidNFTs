//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import {INativeSuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/tokens/INativeSuperToken.sol";
import {ISuperfluid} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {ISuperTokenFactory} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperTokenFactory.sol";
import {NativeSuperTokenProxy} from "@superfluid-finance/ethereum-contracts/contracts/tokens/NativeSuperToken.sol";

contract TokenContract {
    ISuperfluid private _host; // host
    // IConstantFlowAgreementV1 private _cfa; // the stored constant flow agreement class address
    INativeSuperToken public _sodaToken;
    ISuperTokenFactory private _superTokenFactory;
    address public _sodaMachine;

    constructor(ISuperfluid host, ISuperTokenFactory superTokenFactory) {
        _host = host;
        _superTokenFactory = superTokenFactory;

        _sodaToken = INativeSuperToken(address(new NativeSuperTokenProxy()));
        _superTokenFactory.initializeCustomSuperToken(address(_sodaToken));
        _sodaToken.initialize("Soda", "SODA", 10**6 * 1 ether);

        _sodaToken.transfer(
            0x8db7C7ed6403e26445843855D86834014500D4D7,
            1 ether
        );
    }
}
