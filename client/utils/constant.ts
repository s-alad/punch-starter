/* export const CVAR = "http://localhost:5001"; */

export const CVAR =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "https://raized-production.up.railway.app";

export const placeholderImageUrl =
  "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*";

export const exampleCreator = {
  name: "William",
  email: "bwilliamwang@gmail.com",
};
export const exampleProject = {
  projectname: "PunchStarter",
  projectdescription:
    "PunchStarter is a crowdfunding platform designed specifically for blockchain projects. It incorporates decentralized autonomous organizations (DAOs) to verify project milestones and ensure transparency in project development. With PunchStarter, project creators can raise funds for their blockchain initiatives while providing clear evidence of progress through verified milestones.",
  projectpunchline:
    "PunchStarter - Crowdfunding Platform for Blockchain Projects",
  expiry: "2022-12-31",
  fundinggoal: 10000,
  milestones: [
    {
      milestonename: "DAO Integration",
      milestonedescription:
        "Implement DAO functionality for milestone verification.",
    },
    {
      milestonename: "Smart Contract Development",
      milestonedescription:
        "Create smart contracts for secure funding transactions.",
    },
    {
      milestonename: "UI/UX Design",
      milestonedescription:
        "Enhance user experience with intuitive design elements.",
    },
  ],
};
