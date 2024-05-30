// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {fundingDao} from "./fundingDao.sol";

contract daoFactory {
    mapping(address => dao) public userToAddress;

    struct dao {
        address dao;
        address creator;
        string uuid;
    }

    /**
     * 
     * @param _creator Beneficiary of crowdfund
     * @param _fundingGoal Amount to be raised in Rootoshi
     * @param _duration Duration of the project in blocks
     * @param _milestoneDescriptions Descriptions of the milstones to be completed
     * @param _uuid The unique ID of the project in the database
     * @dev Launches a campaign and stores the detials
     */
    function createCampaign(
        address _creator,
        uint256 _fundingGoal,
        uint256 _duration,
        string[] memory _milestoneDescriptions,
        string memory _uuid
    ) external returns (address) {
        fundingDao temp = new fundingDao(
            _creator,
            _fundingGoal,
            _duration,
            _milestoneDescriptions
        );

        userToAddress[msg.sender] = dao(address(temp), msg.sender, _uuid);

        return address(temp);
    }
}
