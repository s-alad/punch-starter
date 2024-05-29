import { z, ZodEnum, ZodType } from "zod"; // Add new import
import { DetailsFormData, OnboardingFormData, PhotosFormData, PreferencesFormData } from "./form";
import { Residences, Genders,  Gender, PGender, PGenders, Ages, Age, Colleges } from "./models";

export const onboardingSchema: ZodType<OnboardingFormData> = z
    .object({
        firstname: z.string().nonempty("Please enter a valid first name").min(2, "First name must be at least 2 characters"),
        age: z.number().int().positive("Please enter a valid age").min(18, "You must be at least 18 years old").max(24, "too old, go get a job!"),
        gender: z.enum(Genders, {
            errorMap: (issue, ctx) => {
                return {message: 'Please select your gender'};
            }
        }),

    })

export const detailsSchema: ZodType<DetailsFormData> = z
    .object({
        year: z.enum(["Freshman", "Sophomore", "Junior", "Senior"], {
            errorMap: (issue, ctx) => {
                return {message: 'Please select your year'};
            }
        }),
        college: z.enum(Colleges, {
            errorMap: (issue, ctx) => {
                return {message: 'Please select your college'};
            }
        }),
        residence: z.enum(Residences, {
            errorMap: (issue, ctx) => {
                return {message: 'Please select your residence'};
            }
        }),
    })

export const preferencesSchema: ZodType<PreferencesFormData> = z
    .object({
        p_gender: z.enum(PGenders, {
            errorMap: (issue, ctx) => {
                return {message: 'Please select'};
            }}),
        p_age: z.array(z.number().int().min(18).max(24), {
            errorMap: (issue, ctx) => {
                return {message: 'Please select at least one age'};
            }
        }),
    })

// there should be a minimum of one photo and a maximum of 6 photos and each string should be unique
export const photosSchema: ZodType<PhotosFormData> = z.object({
    p1: z.custom<File>((v) => v instanceof File, {message: 'Image is required',}),
    p2: z.custom<File>((v) => v instanceof File, {message: 'Image is required',}),
    p3: z.custom<File>((v) => v instanceof File, {message: 'Image is required',}).optional(),
    p4: z.custom<File>((v) => v instanceof File, {message: 'Image is required',}).optional(),
    p5: z.custom<File>((v) => v instanceof File, {message: 'Image is required',}).optional(),
    p6: z.custom<File>((v) => v instanceof File, {message: 'Image is required',}).optional(),
});