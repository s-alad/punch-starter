// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {fundingDao} from "./fundingDao.sol";

contract daoFactory {
    address immutable OWNER;
    mapping(address => address) userToAddress;

    constructor() {
        OWNER = msg.sender;
    }

    function createCampaign(
        address _creator,
        uint256 _fundingGoal,
        uint256 _duration,
        string[] memory _milestoneDescriptions
    ) external returns (address) {
        fundingDao temp = new fundingDao(
            _creator,
            _fundingGoal,
            _duration,
            _milestoneDescriptions
        );

        userToAddress[msg.sender] = address(temp);

        return address(temp);
    }
}
