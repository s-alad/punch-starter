import Milestone from "@/models/milestone";
import { Control, FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

export type DefaultFormField = {
    type: string;
    error: FieldError | undefined;
    
    index?: number;
    placeholder?: string;
    disabled?: boolean;
    defaultvalue?: string | undefined;
    label?: string;
    inputstyle?: string;
};

export type OnboardingFormData = {
    username?: string;
    avatar?: File;
};

export type StartProjectFormData = {
    projectname?: string;
    chain?: "stacks" | "sui" | "stellar" | "rootstock";
}

export type CreateProjectFormData = {
    punchline?: string;
    description?: string;
    /* markdown: string; */
    display?: File;
    /* images: File[]; */
    /* tags: string[]; */
    expiry?: string;
    goal?: number;
    milestones?: Milestone[];
};

export interface GenericFormField<T extends FieldValues> extends DefaultFormField{
    register: UseFormRegister<T>;
    control?: Control<T>;
    name: Path<T>;
    customregistername?: Path<string>;
    options?: string[] | number[];
}