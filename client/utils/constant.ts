/* export const CVAR = "http://localhost:5001"; */

export const CVAR =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : "https://raized-production.up.railway.app";

export const placeholderImageUrl =
  "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*";

export const exampleCreator = {
  onboarded: true,
  email: "bwilliamwang@gmail.com",
  name: "William Wang",
  stacksaddress: "SP1BMPA4S2NQ8PSC52PGWB0EMEDRBNK5S2GNM6QD6",
  user: {
    appConfig: {
      appDomain: "http://localhost:3001",
      scopes: ["store_write", "publish_data"],
      redirectPath: "",
      manifestPath: "/manifest.json",
      authenticatorURL: "https://browser.blockstack.org/auth",
    },
    store: {
      key: "blockstack-session",
    },
  },
  publickey:
    "02a7c406e096347ab22a7c1757375ff36a517f23362729d56db7e30210fc2ccb71",
  signature:
    "90d542d1c62f1f41d30c1617c7e4e203ae5e95adef772c1736f0f4f11ee82bf96f0a4ea13ff521b9ebdaa81ab0825a4299f7185cd929a99691c308554720c7ed00",
  bio: "i like karaoke and hackathons",
  username: "williamwang",
  profileImageUrl:
    "https://lh7-us.googleusercontent.com/-2Oo9cjK2YGXMmqNT9efpdNALmpmsrBPPjz3OGXbjHPrf5bAH6-x08FlrqaASvSldfV4jzoObdJlnpfG9DPczzeNKYGTo4kwt7RE_4FDASH5geywWxWu9zria-0n0-T4ntp4pyywQlQt4PBlSSO_E0scCw=s2048",
  projectsfunded: 7,
  amountraised: 10000,
  education: "CS @ UW",
  linkedin: "https://www.linkedin.com/in/williamuw",
  twitter: "https://twitter.com/HeyWilliamWang",
  location: "Toronto, Ontario, Canada",
  github: "https://github.com/WilliamUW",
  portfolio: "https://williamwangme.netlify.app/",
  pastexperiences:
    "XR @ Meta | Prev. @ Super.com, BDC, Portage | 47x Hackathon Winner | Microsoft GenAI Hackathon Winner | Ripple, MetaMask, Solana Ambassador | RippleX / RBCx, MLH x Near Fellow | StartMIT '24 | UW CS",
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

export const emptyProject = {
    projectpunchline: "",
    projectdescription: "",
    expiry: "2023-12-31",
    fundinggoal: 0,
    milestones: [
      {
        milestonename: "",
        milestonedescription: ""
      },
      {
        milestonename: "",
        milestonedescription: ""
      },
      {
        milestonename: "",
        milestonedescription: ""
      }
    ]
  };