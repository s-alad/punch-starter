// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {fundingDao} from "../src/fundingDao.sol";

contract fundingDaoTest is Test {
    fundingDao public dao;
    string[] milestones = ["Smart Contract", "Front End", "Back End"];
    uint256 fundingGoal = 100;
    uint256 duration = 100;
    uint256 index = 0;

    function setUp() public {
        dao = new fundingDao(address(this), fundingGoal, duration, milestones);
    }

    //Constructor tests

    function testConstructor_valuesSet() public {
        assertEq(dao.CREATOR(), address(this));
        assertEq(dao.FUNDING_GOAL(), fundingGoal);
        assertEq(dao.ENDBLOCK(), block.number + duration);
        (string memory milestone0, , , , ) = dao.milestones(0);
        (string memory milestone1, , , , ) = dao.milestones(1);
        (string memory milestone2, , , , ) = dao.milestones(2);
        assertEq(milestone0, milestones[0]);
        assertEq(milestone1, milestones[1]);
        assertEq(milestone2, milestones[2]);
    }

    //modifier tests

    function testOnlyWhenFunded() public {
        vm.expectRevert(fundingDao.notFunded.selector);
        dao.submit_milestone("test", index);
    }

    function testNotFrozen_afterVote() public {
        testVoteToFreeze_freeze();

        vm.expectRevert(fundingDao.contractFrozen.selector);
        dao.donate{value: 1}();
    }

    function testNotFrozen_notFundedInTime() public {
        //Increase block
        //try to donate
    }

    function testOnlyCreator() public {
        vm.prank(address(1));

        vm.expectRevert(fundingDao.notCreator.selector);
        dao.submit_milestone("test", index);
    }

    function testOnlyFunder() public {
        vm.prank(address(1));

        vm.expectRevert(fundingDao.notFunder.selector);
        dao.vote_to_freeze();
    }

    //Test Reentrancy once you figure out why it's triggering when it's not supposed to

    //Donate tests

    function testDonate_addsTokens() public {
        uint donation = 10;

        dao.donate{value: donation}();

        assertEq(dao.totalTokens(), donation);
        assertEq(dao.numberOfTokens(address(this)), donation);
    }

    function testDonate_funded() public {
        dao.donate{value: fundingGoal}();

        assertEq(dao.funded(), true);
    }

    function testDonate_recieve() public {
        uint donation = 10;

        address(dao).call{value: donation}("");

        assertEq(dao.totalTokens(), donation);
        assertEq(dao.numberOfTokens(address(this)), donation);
    }

    // Submit Milestone tests

    function testSubmitMilestone_insertsDetails() public {
        testDonate_funded();
        string memory milestone_submission = "test";

        dao.submit_milestone(milestone_submission, index);

        (, , , , string memory details) = dao.milestones(index);
        assertEq(details, milestone_submission);
    }

    function testSubmitMilestone_AlreadySubmitted() public {
        testSubmitMilestone_insertsDetails();
        string memory milestone_submission = "test";

        vm.expectRevert(fundingDao.AlreadySubmitted.selector);
        dao.submit_milestone(milestone_submission, index);
    }

    // Claim Milestone tests
    function testClaimMilestone_incrementClaimedMilestones() public {
        testVoteOnMilestone_approveMilestone();

        dao.claim_milestone(index);
        assertEq(dao.claimedMilestones(), 1);
    }

    function testClaimMilestone_AlreadyClaimed() public {
        testClaimMilestone_incrementClaimedMilestones();

        vm.expectRevert(fundingDao.AlreadyClaimed.selector);
        dao.claim_milestone(index);
    }

    function testClaimMielstone_NotApprovedByFunders() public {
        testDonate_funded();

        vm.expectRevert(fundingDao.NotApprovedByFunders.selector);
        dao.claim_milestone(index);
    }

    // Vote on milestone tests

    function testVoteOnMilestone_approveMilestone() public {
        testDonate_funded();

        dao.vote_on_milestone(index);
        (, , bool approved, , ) = dao.milestones(index);
        assertEq(approved, true);
    }

    function testVoteOnMilestone_notApprovedYet() public {
        testDonate_funded();
        address secondDonor = address(1);
        vm.deal(secondDonor, 10);

        vm.prank(secondDonor);
        dao.donate{value: 5}();
        vm.prank(secondDonor);
        dao.vote_on_milestone(index);

        (, , bool approved, , ) = dao.milestones(index);
        assertEq(approved, false);
    }

    //vote to freeze tests

    function testVoteToFreeze_freeze() public {
        testDonate_funded();

        dao.vote_to_freeze();
        assertEq(dao.frozen(), true);
    }

    fallback() external payable {}

    receive() external payable {}
}
