import s from './input.module.scss';
import React, { useEffect } from 'react';
import { GenericFormField } from "@/validation/form";
import { FieldValues } from 'react-hook-form';

export default function Input<T extends FieldValues>({ type, inputstyle, label, placeholder, name, register, error, disabled, defaultvalue }: GenericFormField<T>) {
    const valueAsNumber = type === "number" ? true : false;
    return (
        <div className={s.input}>
            {label && <label htmlFor={name}>{label}</label>}
            {
                inputstyle === "textarea" ?
                    <textarea
                        placeholder={placeholder}
                        {...register(name, { valueAsNumber })}
                    />
                    :
                    <input
                        type={type}
                        placeholder={placeholder}
                        {...register(name, { valueAsNumber })}
                    />
            }
            {error && <span className={s.error}>*{error.message}</span>}
        </div>
    )
}