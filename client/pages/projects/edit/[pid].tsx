import React from "react";
import { useEffect, useState } from "react";

import s from "./edit.module.scss";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authcontext";
import { CVAR } from "@/utils/constant";
import Project from "@/models/project";
import Loader from "@/components/loader/loader";
import { CreateProjectFormData } from "@/validation/form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema } from "@/validation/schema";
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import ImageInput from "@/components/image/image";
import { base64ToBlob, blobToFile } from "@/utils/conversion";

import { makeContractDeploy, broadcastTransaction, AnchorMode } from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import supabase from "@/utils/supabase";
/* import { readFileSync } from "fs"; */

export default function Projects() {
    const router = useRouter();
    const { pid } = router.query;
    const { session, puncher } = useAuth();

    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [project, setProject] = useState<Project>();

    const [previewImage, setPreviewImage] = useState<string>("");

    async function onSubmit(data: CreateProjectFormData) {
        setLoading(true);
        console.log("submit", data);

        // always delete the previous display image
        const { data: displayexists, error: delerror } = await supabase.storage
            .from("projects")
            .remove([`${project?.pid}/display`]);

        if (delerror) {
            console.error('Error deleting file:', delerror);
            setError("Error deleting file");
            return;
        }


        // upload display image to supabase bucket and get url
        const { data: displaydata, error: displayerror } = await supabase.storage
            .from("projects")
            .upload(`${project?.pid}/display`, data.display);
            if (displayerror) {
                console.error('Error uploading file:', displayerror);
                setError("Error uploading file");
                return;
            }
        

        let displayurl = "";
        // Get the URL of the uploaded file
        const { data: displayuri } = supabase.storage
            .from("projects")
            .getPublicUrl(`${project?.pid}/display`);

        if (displayuri) {
            displayurl = displayuri.publicUrl;
        } else {
            console.error("display url not found")
            setError("Display url error");
            return;
        }

        // upload milestones to the milestones table
        data.milestones.forEach(async (milestone) => {
            const { data: milestonedata, error: milestoneerror } = await supabase
                .from('milestones')
                .insert({
                    pid: project?.pid,
                    name: milestone.name,
                    description: milestone.description,
                    amount: milestone.amount,
                    expiry: milestone.expiry
                })

            if (milestoneerror) {
                console.error('Error inserting milestone:', milestoneerror);
                setError("Error inserting milestone");
                return;
            }
        })

        // upload project to the projects table
        const { data: projectdata, error: projecterror } = await supabase
            .from('projects')
            .update({
                punchline: data.punchline,
                description: data.description,
                display: displayurl,
                goal: data.goal,
                deployed: true
            })
            .eq('pid', project?.pid)

        if (projecterror) {
            console.error('Error inserting project:', projecterror);
            setError("Error inserting project");
            return;
        }

        // push to the project page
        router.push(`/projects/${project?.pid}`);
    }

    const { register, handleSubmit, reset, control, formState: { errors } } =
        useForm<CreateProjectFormData>({
            resolver: zodResolver(createProjectSchema),
            defaultValues: {
                milestones: [
                    {
                        name: "",
                        description: "",
                        amount: 0,
                        expiry: ""
                    }
                ]
            }
        });

    const { fields, append, remove, update, } = useFieldArray({ control, name: "milestones" });


    async function getProject() {
        supabase.
            from('projects')
            .select(`*, owner!inner(username, uid)`)
            .eq('pid', pid)
            .then(({ data: projects, error }: any) => {
                if (error) {
                    console.log(error)
                    return
                }
                const rproject = projects[0];
                console.log(projects)
                console.log(projects[0].owner)
                console.log(puncher?.uid)
                let project: Project = {
                    pid: rproject.pid,
                    name: rproject.name,
                    chain: rproject.chain,
                    display: rproject.display,
                    owner: {
                        username: rproject.owner.username,
                        uid: rproject.owner.uid
                    },
                    punchline: rproject.punchline,
                    description: rproject.description,
                    deployed: rproject.deployed,
                    goal: rproject.goal,
                    raised: rproject.raised,
                    expiry: rproject.expiry,
                    upvotes: rproject.upvotes,
                }

                setProject(project)
                setLoading(false)
            })
    }

    useEffect(() => {
        if (session && pid) { getProject(); }
    }, [session, pid])

    if (!session || !pid) { return <Loader /> }
    if (project && project.owner.uid !== puncher?.uid) { return (<>you do not own this project</>) }
    if (project && project.deployed) { return (<>this project has already been deployed</>) }

    return (
        <main className={s.edit}>
            {
                project &&
                <div className={s.project}>
                    <div className={s.projectname}>{project.name}</div>
                    <div className={s.creator}>{project.owner.username}</div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input<CreateProjectFormData>
                            name="punchline"
                            label="Project Punchline"
                            register={register}
                            control={control}
                            error={errors.punchline}
                            type="text"
                            placeholder="Enter the punchline of your project"
                        />
                        <Input<CreateProjectFormData>
                            name="description"
                            label="Project Description"
                            register={register}
                            control={control}
                            error={errors.description}
                            type="text"
                            inputstyle="textarea"
                            placeholder="Enter the description of your project"
                        />
                        <ImageInput
                            name="display"
                            control={control}
                            error={errors.display}
                            label="Project Display Image"
                            previewimg={previewImage}
                            callback={setPreviewImage}
                        />
                        <div className={s.milestones}>
                            <label>Milestones</label>
                            {
                                fields.map((field, index) => {
                                    console.log(field);
                                    return (
                                        <div className={s.milestone} key={index}>
                                            <label className={s.mile}>{index + 1}</label>
                                            <div className={s.stone}>
                                                <Input<CreateProjectFormData>
                                                    type={"text"}
                                                    placeholder={"Enter the name of the milestone"}
                                                    register={register}
                                                    name={`milestones.${index}.name` as const}
                                                    control={control}
                                                    error={errors.milestones?.[index]?.name}
                                                />
                                                <Input<CreateProjectFormData>
                                                    type={"text"}
                                                    placeholder={"Enter the description of the milestone"}
                                                    register={register}
                                                    name={`milestones.${index}.description` as const}
                                                    control={control}
                                                    error={errors.milestones?.[index]?.description}
                                                />
                                                <Input<CreateProjectFormData>
                                                    type={"number"}
                                                    placeholder={"Enter the amount of the milestone"}
                                                    register={register}
                                                    name={`milestones.${index}.amount` as const}
                                                    control={control}
                                                    error={errors.milestones?.[index]?.amount}
                                                />
                                                <Input<CreateProjectFormData>
                                                    type={"date"}
                                                    placeholder={"Enter the expiry of the milestone"}
                                                    register={register}
                                                    name={`milestones.${index}.expiry` as const}
                                                    control={control}
                                                    error={errors.milestones?.[index]?.expiry}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className={s.functionality}>
                                <div className={s.add} onClick={() => {
                                    if (fields.length < 5) {
                                        append({ name: "", description: "", amount: 0, expiry: "" });
                                    }
                                }}>
                                    + Add Milestone
                                </div>
                                <div className={s.remove} onClick={() => {
                                    if (fields.length > 1) {
                                        remove(fields.length - 1);
                                    }
                                }}>
                                    - Remove Milestone
                                </div>
                            </div>
                        </div>
                        <div className={s.goal}>
                            <Input<CreateProjectFormData>
                                name="goal"
                                label="Funding Goal"
                                register={register}
                                control={control}
                                error={errors.goal}
                                type="number"
                                placeholder="Enter the funding goal of your project"
                            />
                        </div>
                        <Input<CreateProjectFormData>
                            name="expiry"
                            label="Duration"
                            register={register}
                            control={control}
                            error={errors.expiry}
                            type="date"
                            placeholder="Enter the duration of your fundraising"
                        />
                        <Button text="DEPLOY" type="submit"
                            onClick={() => {
                                console.log("deploying project")
                                console.log(errors)
                            }}
                            loading={loading}
                        />
                    </form>
                </div>
            }
        </main>
    )
} 