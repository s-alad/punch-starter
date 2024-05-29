import { Control, FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";
import { Age, Gender, Residence, PGender, College, Year } from "./models";


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
    firstname: string;
    age: number;
    gender: Gender;
};

export type DetailsFormData = {
    residence: Residence;
    college: College;
    year: Year;
};

export type PreferencesFormData = {
    p_gender: PGender;
    p_age: Age[];
};

export type PhotosFormData = {
    p1: File;
    p2: File;
    p3?: File;
    p4?: File;
    p5?: File;
    p6?: File;
};

export interface GenericFormField<T extends FieldValues> extends DefaultFormField{
    register: UseFormRegister<T>;
    control?: Control<T>;
    name: Path<T>;
    customregistername?: Path<string>;
    options?: string[] | number[];
}

interface PhotosFormGenericField extends GenericFormField<PhotosFormData> {}

