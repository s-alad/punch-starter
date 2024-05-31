import { GenericFormField } from "@/validation/form";
import s from "./select.module.scss";
import { FieldValues } from "react-hook-form";

export default function Select<T extends FieldValues>({ type, inputstyle, label, placeholder, name, register, error, disabled, defaultvalue, options }: GenericFormField<T>) {
    
    const valueAsNumber = type === "number" ? true : false;

    return (
        <div className={s.matchselect}>
            <label htmlFor={name}>{label ? label : name}:</label>
            <select
                {...register(name, { valueAsNumber })}
                disabled={disabled}
                className={s.matchselect}
                defaultValue={"select"}
            >
                <option value="select" disabled>Select your {placeholder ? placeholder : name}</option>
                {
                    options?.map((option, index) => {
                        return (
                            <option key={index} value={option}>{option}</option>
                        )
                    })
                }
            </select>
            {error && <span className={s.error}>*{error.message}</span>}
        </div>
    )
}