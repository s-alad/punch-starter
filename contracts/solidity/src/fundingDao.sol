// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract fundingDao {
    error contractFrozen();
    error notCreator();
    error notFunded();
    error AlreadyClaimed();
    error AlreadySubmitted();
    error notFunder();
    error TransactionFailed();
    error NotApprovedByFunders();
    error NotFrozen();
    error NoReentrant();

    struct milestone {
        string milestoneDescription;
        uint256 votes;
        bool approved;
        bool claimed;
        string finishedMilestoneDetails;
    }

    address public immutable CREATOR;
    uint256 public immutable FUNDING_GOAL;
    uint256 public immutable ENDBLOCK;

    mapping(address => uint256) public numberOfTokens;
    address[] public donators;
    uint256 public totalTokens;
    milestone[] public milestones;
    uint256 public claimedMilestones;
    uint256 public votesToFreeze;
    bool public funded = false;
    bool public frozen = false;
    bool internal reentrant = false;

    modifier onlyWhenFunded() {
        if (!funded) {
            revert notFunded();
        }
        _;
    }

    /// @dev Contract is frozen if time runs out and it's not funded or if funders choose to freeze
    modifier notFrozen() {
        if (frozen) {
            revert contractFrozen();
        }

        if ((ENDBLOCK <= block.number) && !funded) {
            frozen = true;
        }
        _;
    }

    modifier onlyCreator() {
        if (msg.sender != CREATOR) {
            revert notCreator();
        }
        _;
    }

    modifier onlyFunder() {
        if (numberOfTokens[msg.sender] == 0) {
            revert notFunder();
        }
        _;
    }

    modifier reentrancyGuard() {
        if (reentrant = true) {
            //revert NoReentrant();
        }
        reentrant = true;
        _;
        reentrant = false;
    }

    /**
     *
     * @param _creator Beneficiary of crowdfund
     * @param _fundingGoal Amount to be raised
     * @param _duration Time to raise
     * @param _milestoneDescriptions Descriptions of the milstones to be completed
     */
    constructor(
        address _creator,
        uint256 _fundingGoal,
        uint256 _duration,
        string[] memory _milestoneDescriptions
    ) {
        CREATOR = _creator;
        FUNDING_GOAL = _fundingGoal;
        ENDBLOCK = block.number + _duration;
        for (uint256 i; i < _milestoneDescriptions.length; ++i) {
            milestones.push(
                milestone(_milestoneDescriptions[i], 0, false, false, "")
            );
        }
    }

    /**
     * @dev Basic function that runs whenever someone donates
     */
    function donate() public payable notFrozen {
        if ((address(this).balance + msg.value) >= FUNDING_GOAL) {
            funded = true;
        }

        if (numberOfTokens[msg.sender] == 0) {
            donators.push(msg.sender);
        }

        totalTokens += msg.value;
        numberOfTokens[msg.sender] += msg.value;
    }

    receive() external payable {
        donate();
    }

    fallback() external payable {
        donate();
    }

    /**
     *
     * @param _milestone_submission A link to the submission details on the website
     * @param _index Index of milestone in array
     * @dev This is what the creator calls to submit the details of a milestone
     */
    function submit_milestone(
        string calldata _milestone_submission,
        uint256 _index
    ) external onlyCreator onlyWhenFunded notFrozen {
        if (bytes(milestones[_index].finishedMilestoneDetails).length != 0) {
            revert AlreadySubmitted();
        }

        milestones[_index].finishedMilestoneDetails = _milestone_submission;
    }

    /**
     * @dev Called by the creator after the milestone has been voted on to claim funds
     * @dev claimed milestone is used to track if they have claimed the milestone or not
     * claimedMilestone == currentMilestone when they haven't, same goes for approvedMilestone
     */
    function claim_milestone(
        uint256 _index
    ) external onlyCreator onlyWhenFunded notFrozen reentrancyGuard {
        if (milestones[_index].claimed) {
            revert AlreadyClaimed();
        }

        if (!milestones[_index].approved) {
            revert NotApprovedByFunders();
        }

        (bool success, ) = CREATOR.call{
            value: (address(this).balance /
                (milestones.length - claimedMilestones))
        }("");

        if (!success) {
            revert TransactionFailed();
        }

        claimedMilestones++;
        milestones[_index].claimed = true;
    }

    /**
     * @dev For funders to vote on the current milestone. I'm hard coding in above 50%. We could change to something the creator sets
     * I'm also assuming a yes vote but it could be changed to yes/no vote and if above 50% vote no
     * the contract could be frozen
     */
    function vote_on_milestone(
        uint256 _index
    ) external onlyFunder onlyWhenFunded notFrozen {
        milestones[_index].votes += numberOfTokens[msg.sender];

        if (milestones[_index].votes > (totalTokens / 2)) {
            milestones[_index].approved = true;
        }
    }

    /**
     * @dev Funders vote to freeze contract if something nefarious is happening. Right now there's no way to take back your vote
     * could be soemthing to add
     */
    function vote_to_freeze() external onlyFunder onlyWhenFunded notFrozen {
        votesToFreeze += numberOfTokens[msg.sender];

        if (votesToFreeze > ((totalTokens * 3) / 4)) {
            frozen = true;
        }
    }

    /**
     * @dev Once contract is frozen funders can claim their refund
     * @dev I wanted to use Chainlink automation to automate this but it's not available on Rootstock
     * Could be something we just build ourselves but it might not be worth the effort
     */
    function claim_refund() external onlyFunder reentrancyGuard {
        if (!frozen) {
            revert NotFrozen();
        }

        (bool success, ) = msg.sender.call{value: numberOfTokens[msg.sender]}(
            ""
        );
        if (success) {
            numberOfTokens[msg.sender] = 0;
        } else {
            revert TransactionFailed();
        }
    }
}
