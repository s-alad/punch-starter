export abstract class ConnectionAdapter {

    /**
     * Used by founders to create a new project. The newly created projected
     * should be associated with the founder's wallet address. 
     */
    public abstract createProject(): Promise<void>;

    /**
     * Used by founders to add milestones to their project. 
     */
    public abstract addMilestone(): Promise<void>;

    /**
     * Used by anyone to fund a project they like. 
     */
    public abstract fundProject(): Promise<void>;

    /**
     * Used by anyone who has funded a project to vote on a milestone. If enough
     * votes are received, the milestone is considered complete.
     */
    public abstract voteCompleteMilestone(): Promise<void>;

    /**
     * Used by founders to redeem a milestone. If the milestone is complete, the 
     * funds are transferred to the founder's wallet. 
     */
    public abstract redeemMilestone(): Promise<void>;

    /**
     * Used by funders to freeze voting on a milestone. 
     */
    public abstract voteFreeze(): Promise<void>;

    /**
     * Used by funders to get their refund after a milestone has been frozen.
     */
    public abstract getRefund(): Promise<void>;
}