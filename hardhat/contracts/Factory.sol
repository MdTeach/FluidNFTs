//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import {INativeSuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/tokens/INativeSuperToken.sol";
import {ISuperfluid} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {ISuperTokenFactory} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperTokenFactory.sol";
import {NativeSuperTokenProxy} from "@superfluid-finance/ethereum-contracts/contracts/tokens/NativeSuperToken.sol";
import {ISuperfluidToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluidToken.sol";

contract TokenContract {
    ISuperfluid private _host; // host
    INativeSuperToken public _redValToken;
    INativeSuperToken public _greenValToken;
    INativeSuperToken public _blueValToken;

    ISuperTokenFactory private _superTokenFactory;
    address public _sodaMachine;

    constructor(
        ISuperfluid host,
        ISuperTokenFactory superTokenFactory,
        string memory name,
        string memory id
    ) {
        _host = host;
        _superTokenFactory = superTokenFactory;

        // red token
        _redValToken = INativeSuperToken(address(new NativeSuperTokenProxy()));
        _superTokenFactory.initializeCustomSuperToken(address(_redValToken));
        _redValToken.initialize(name, id, 10**9 * 1 ether);

        // green token
        _greenValToken = INativeSuperToken(
            address(new NativeSuperTokenProxy())
        );
        _superTokenFactory.initializeCustomSuperToken(address(_greenValToken));
        _greenValToken.initialize(name, id, 10**9 * 1 ether);

        // blue token
        _blueValToken = INativeSuperToken(address(new NativeSuperTokenProxy()));
        _superTokenFactory.initializeCustomSuperToken(address(_blueValToken));
        _blueValToken.initialize(name, id, 10**9 * 1 ether);
    }

    function handleMint(
        address _holder,
        uint256 r,
        uint256 g,
        uint256 b
    ) public {
        _redValToken.transfer(_holder, r);
        _greenValToken.transfer(_holder, g);
        _blueValToken.transfer(_holder, b);
    }

    function getBalances(address _holder)
        public
        view
        returns (
            int256,
            int256,
            int256
        )
    {
        (int256 br, , , ) = ISuperfluidToken(address(_redValToken))
            .realtimeBalanceOfNow(_holder);
        (int256 bg, , , ) = ISuperfluidToken(address(_greenValToken))
            .realtimeBalanceOfNow(_holder);
        (int256 bb, , , ) = ISuperfluidToken(address(_blueValToken))
            .realtimeBalanceOfNow(_holder);

        return (br, bg, bb);
    }
}
