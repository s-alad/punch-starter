import React from "react";
import { useEffect, useState } from "react";

import s from "./projectid.module.scss";
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
import { getDaysUntilExpiry } from "@/utils/conversion";
import { openSTXTransfer } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { AnchorMode, PostConditionMode } from '@stacks/transactions';
import supabase from "@/utils/supabase";
import Milestone from "@/models/milestone";


export default function Projects() {
    const router = useRouter();
    const { projectuid: pid } = router.query;

    const { session, puncher } = useAuth();
    const [project, setProject] = useState<Project>();
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    
    let [loading, setLoading] = useState(true);
    let [amount, setAmount] = useState(0);
    let [funding, setFunding] = useState(false);
    async function fund() {

        if (!project) { return; }

       /*  openSTXTransfer({
            network: new StacksMainnet(), // which network to use; use `new StacksMainnet()` for mainnet
            anchorMode: AnchorMode.Any, // which type of block the tx should be mined in

            recipient: project.ownerstacksaddress, // which address we are sending to
            amount: (amount * 1000000).toString(), // amount to send in microstacks
            memo: 'funding', // optional; a memo to help identify the tx

            onFinish: async (response) => {
                // WHEN user confirms pop-up
                console.log(response.txId); // the response includes the txid of the transaction

            },
            onCancel: () => {
                // WHEN user cancels/closes pop-up
                console.log('User canceled');
            },
        }); */
    }

    async function getProject() {
        setLoading(true);

        supabase.
            from('projects')
            .select(`*, owner!inner(username, uid)`)
            .eq('pid', pid)
            .then(({ data: projects, error }) => {
                if (error) {
                    console.log(error)
                    return
                }
                console.log(projects)

                let proj: Project = {
                    pid: projects[0].pid,
                    name: projects[0].name,
                    chain: projects[0].chain,
                    display: projects[0].display,
                    owner: projects[0].owner,
                    punchline: projects[0].punchline,
                    description: projects[0].description,
                    deployed: projects[0].deployed,
                    goal: projects[0].goal,
                    raised: projects[0].raised,
                    expiry: projects[0].expiry,
                }
                setProject(proj);
            })

        setLoading(false);
    }

    async function getMilestones() {
        setLoading(true);

        supabase.
            from('milestones')
            .select(`*`)
            .eq('pid', pid)
            .then(({ data: milestones, error }) => {
                if (error) {
                    console.log(error)
                    return
                }
                console.log(milestones)

                let mstones: Milestone[] = milestones.map((milestone: any) => {
                    return {
                        mid: milestone.mid,
                        pid: milestone.pid,
                        name: milestone.name,
                        description: milestone.description,
                        amount: milestone.amount,
                        expiry: milestone.expiry,
                    }
                })

                setMilestones(mstones);
                setLoading(false)
            })

        setLoading(false);
    }

    useEffect(() => {
        if (pid) {
            getProject();
            getMilestones();
        }
    }, [puncher, pid])

    if (loading) { return <Loader /> }

    if ((project && !project.deployed) || !pid) {
        return (<main className={s.notdeployed}>project issue.</main>)
    }

    return (
        <main className={s.projectid}>
            {
                project &&
                <div className={s.project}>
                    <div className={s.info}>
                        <div className={s.left}>
                            <div className={s.projectname}>{project.name}</div>
                            <div className={s.punchline}>{project.punchline}</div>
                          {/*   <div className={s.creator}>stx.{project.ownerstacksaddress}</div> */}
                        </div>
                        {
                            puncher && <div className={s.right}>
                            {
                                !funding ? <>
                                    <button className={s.dao} onClick={() => router.push(`/projects/${project.pid}/dao`)}>
                                        dao!
                                    </button>
                                    <button className={s.fund} onClick={()=> setFunding(true)}>fund!</button>
                                </> : 
                                <div className={s.funding}>
                                    <input type="number" placeholder="amount" 
                                        value={amount} 
                                        onChange={(e) => setAmount(parseInt(e.target.value))}
                                    />
                                    <button
                                        onClick={fund} 
                                    >fund</button>
                                </div>
                            }
                        </div>
                        }
                    </div>
                    <div className={s.content}>
                        <img src={project.display} alt={project.name} />
                        <div className={s.details}>
                            <div className={s.detail}>
                                <label>description:</label>
                                <p>{project.description}</p>
                            </div>
                            <div className={s.detail}>
                                <label>duration:</label>
                                <p>{project.expiry}</p>
                                {/* <p>ending in {getDaysUntilExpiry(project.expiry)} days from now</p> */}
                            </div>
                            <div className={s.detail}>
                                <label>raised:</label>
                                <div className={s.raised}>
                                    <div className={s.bar}>
                                        <div className={s.fill} style={{
                                            width: project.raised === 0 ? "3%" : `${(project.raised / project.goal) * 100}%`
                                        }}>
                                        </div>
                                    </div>
                                    <p>{project.raised} / {project.goal} STX</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={s.milestones}>
                        {
                            milestones.map((milestone, index) => {
                                return (
                                    <div className={s.milestone} key={index}>
                                        <div className={s.mile}>
                                            <div>milestone</div>
                                            <label>{index + 1}</label></div>
                                        <div className={s.stone}>
                                            <div className={s.name}>{milestone.name}</div>
                                            <div className={s.desc}>{milestone.description}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>


                </div>
            }
        </main>
    )
} 