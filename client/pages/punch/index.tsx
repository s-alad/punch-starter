import React, { useState } from "react";

import s from './punch.module.scss'
import { StartProjectFormData } from "@/validation/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startProjectSchema } from "@/validation/schema";
import Button from "@/components/button/button";
import { CVAR } from "@/utils/constant";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authcontext";
import Input from "@/components/input/input";
import Select from "@/components/select/select";
import supabase from "@/utils/supabase";

export default function Raise() {

    const {session, connect, puncher} = useAuth()
    const router = useRouter();

    let [loading, setLoading] = useState(false);

    const faq = [
        {
            question: "What can I raise with Raize?",
            answer: "You can raise funds for your project, idea, or business. We support projects in all categories."
        },
        {
            question: "How does Raze work?",
            answer: "You can create a project, set a funding goal, and share it with the world. People can contribute to your project and help you reach your goal."
        },
        {
            question: "How do I get started?",
            answer: "You can connect your wallet and start creating your project. You can also browse projects and contribute to them."
        }
    ]

    async function onSubmit(pdata: StartProjectFormData) {
        setLoading(true);
        console.log(pdata);

        // add a new project to the database
        const { data, error } = await supabase
            .from('projects')
            .insert([
                {
                    name: pdata.projectname,
                    chain: pdata.chain,
                    owner: puncher?.uid
                }
            ])
            .select('pid')

        console.log(data, error)
        
        setLoading(false);

        // redirect to the project page
        router.push(`/projects/edit/${data![0].pid}`)
    }

    const { register, handleSubmit, control, formState: { errors } } =
    useForm<StartProjectFormData>({
        resolver: zodResolver(startProjectSchema),
        defaultValues: {}
    });


    if (!session || !puncher) {
        router.push("/connect");
    }

    const chains = {
        stacks: "stacks",
        sui: "sui"
    }

    return (
        <main className={s.raise}>
            <h1>Let's get your project on the moon </h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                <Input<StartProjectFormData>
                    type="text"
                    inputstyle="input"
                    label="What Will Be Your Project's Name?"
                    placeholder="EasyA"
                    name="projectname"
                    register={register}
                    error={errors.projectname}
                />
                <Select<StartProjectFormData>
                    type="text"
                    inputstyle="input"
                    label="What Chain Will You Be Using?"
                    placeholder="chain"
                    name="chain"
                    register={register}
                    error={errors.chain as any}
                    options={Object.values(chains)}
                />

                <Button text="Start Project" type="submit" loading={loading}/>
            </form>

        </main>
    )
}