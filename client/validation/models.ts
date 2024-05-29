export const Residences = [
    "East Campus",
    "BU Central",
    "West Campus",
    "South Campus",
    "Baystate",
    "Warren",
    "Allston",
    "Stuvi",
    "Myles",
    "Fenway Campus",
    "Off Campus",
] as const;
export type Residence = typeof Residences[number];

export const Colleges = [
    "CAS",
    "COM",
    "CGS",
    "ENG",
    "QST",
    "Sargent",
    "SMG",
    "Wheelock",
    "MET",
    "CFA",
    "GRS",
    "LAW",
    "SHA",
    "Other"

] as const;
export type College = typeof Colleges[number];

export const Years = [
    "Freshman", "Sophomore", "Junior", "Senior", "Other",
]
export type Year = typeof Years[number];

export const Genders = ["Man", "Woman", "Nonbinary", "Other"] as const;
export type Gender = typeof Genders[number];

export const PGenders = ["Men", "Women", "Nonbinary", "Everyone"] as const;
export type PGender = typeof PGenders[number];

export const Ages: number[] = [18, 19, 20, 21, 22, 23, 24] as const;
export type Age = typeof Ages[number];