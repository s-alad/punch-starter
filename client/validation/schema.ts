import { z, ZodEnum, ZodType } from "zod"; // Add new import
import { CreateProjectFormData, OnboardingFormData, StartProjectFormData, } from "./form";
import Milestone from "@/models/milestone";

// name that is optional, however if given must be min 1 character max 50 characters

export const onboardingSchema: ZodType<OnboardingFormData> = z
    .object({
        username: z.string().min(1, "minimum one char").max(50, "maximum 50 chars"),
        avatar: z.custom<File>((v) => v instanceof File, {message: 'Image is required',}).optional(),
    })

export const startProjectSchema: ZodType<StartProjectFormData> = z
    .object({
        projectname: z.string().min(1).max(50),
        chain: ZodEnum.create(["stacks", "sui", "stellar", "rootstock"]),
    })

export const milestoneSchema: ZodType<Milestone> = z
    .object({
        name: z.string().min(1).max(100),
        description: z.string().min(1).max(1000),
        amount: z.number().min(1),
        expiry: z.string(),
    })

export const createProjectSchema: ZodType<CreateProjectFormData> = z
    .object({
        punchline: z.string().min(1),
        description: z.string().min(1),
        /* projectmarkdown: z.string().min(1).max(50), */
        display: z.custom<File>((v) => v instanceof File, {message: 'Image is required',}),
        /* projectimages: z.array(z.string().min(1).max(50)), */
        /* tags: z.array(z.string().min(1).max(50)), */
        expiry: z.string(),
        goal: z.number().min(1),
        milestones: z.array(milestoneSchema).min(1).max(5),
    })