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
  projectimageurl: "./logo.png",
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

export let projectList = [
  { project: exampleProject, creator: exampleCreator },
  {
    project: {
      projectimageurl: "./befit.jpeg",
      projectname: "BeFit",
      projectdescription:
        "BeFit revolutionizes fitness motivation by blending the spontaneity of BeReal with the accountability and rewards of exercising. At random times, BeFit prompts users to complete a specified exercise, using machine learning to verify completion via camera. Successfully performed exercises are rewarded with unique NFTs, creating a tangible record of achievements. Users can view friends' exercise accomplishments, fostering a community of support and motivation.",
      projectpunchline: "Fitness Motivation with BeFit",
      expiry: "2023-12-31",
      fundinggoal: 20000,
      milestones: [
        {
          milestonename: "App Development",
          milestonedescription:
            "Develop the BeFit mobile application with core features.",
        },
        {
          milestonename: "ML Integration",
          milestonedescription:
            "Integrate machine learning for exercise verification.",
        },
        {
          milestonename: "Community Building",
          milestonedescription:
            "Foster a community of users and support networks.",
        },
      ],
    },
    creator: {
      name: "Xavier D'Mello & William Wang",
    },
  },
  {
    project: {

      projectname: "TooFake",
      projectdescription:
        "TooFake is a BeReal viewer and web client that allows you to view and download BeReals, and post custom BeReals and RealMojis without having to click on notifications.",
      projectpunchline: "A BeReal viewer & web client",
      expiry: "2023-06-30",
      fundinggoal: 15000,
      milestones: [
        {
          milestonename: "Web Development",
          milestonedescription:
            "Develop the TooFake web application with core features.",
        },
        {
          milestonename: "User Authentication",
          milestonedescription:
            "Implement user authentication and privacy features.",
        },
        {
          milestonename: "Feature Expansion",
          milestonedescription:
            "Add custom BeReals and RealMojis functionality.",
        },
      ],
    },
    creator: {
      name: "Unknown",
    },
  },
  {
    project: {
      projectname: "Movelo",
      projectdescription:
        "Movelo is an app that incentivizes sustainable travel through cash rewards while collecting valuable commuting data for businesses to use on their ESG reports.",
      projectpunchline: "Incentivizing Sustainable Travel",
      expiry: "2024-03-31",
      fundinggoal: 30000,
      milestones: [
        {
          milestonename: "App Development",
          milestonedescription:
            "Develop the Movelo mobile application with core features.",
        },
        {
          milestonename: "Data Collection",
          milestonedescription:
            "Implement data collection for commuting insights.",
        },
        {
          milestonename: "ESG Reporting",
          milestonedescription:
            "Develop features for businesses to generate ESG reports.",
        },
      ],
    },
    creator: {
      name: "Unknown",
    },
  },
  {
    project: {
      projectname: "Civic Tech Voting",
      projectdescription:
        "Developed for the Civic Tech hackathon hosted by Boston University and Howard University on February 17-18, 2024. This project is a web application that allows users to vote in elections using zero-knowledge proofs. This allows for secure and anonymous voting, while also ensuring complete transparency and verifiability of the election results.",
      projectpunchline: "Secure and Anonymous Voting",
      expiry: "2024-02-18",
      fundinggoal: 25000,
      milestones: [
        {
          milestonename: "Web Development",
          milestonedescription:
            "Develop the web application with voting features.",
        },
        {
          milestonename: "Zero-Knowledge Proofs",
          milestonedescription:
            "Implement zero-knowledge proofs for secure voting.",
        },
        {
          milestonename: "Transparency Features",
          milestonedescription:
            "Ensure transparency and verifiability of election results.",
        },
      ],
    },
    creator: {
      name: "Unknown",
    },
  },
];

export const emptyProject = {
  projectpunchline: "",
  projectdescription: "",
  expiry: "2023-12-31",
  fundinggoal: 0,
  milestones: [
    {
      milestonename: "",
      milestonedescription: "",
    },
    {
      milestonename: "",
      milestonedescription: "",
    },
    {
      milestonename: "",
      milestonedescription: "",
    },
  ],
};
