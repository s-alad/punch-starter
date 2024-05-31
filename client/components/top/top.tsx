import React from "react";
import { useEffect, useState } from "react";
import { FaSearch, FaUser, FaHome, FaRegUserCircle } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa6";
import s from "./top.module.scss"
import supabase from "@/utils/supabase";
import Project from "@/models/project";
import { useRouter } from "next/router";

export default function Top() {

    const router = useRouter();

    const [project, setProject] = useState<Project>();

    async function top() {
        // query the project with the longest length of the upvotes column
        // also get the owner of the project
        const { data, error } = await supabase
            .from('projects')
            .select(`*, owner!inner(username)`)
            .order('upvotes', { ascending: false })
            .limit(1)

        const p = data![0];

        if (!p) {
            setProject(undefined)
            return
        }

        const project: Project = {
            pid: p.pid,
            name: p.name,
            chain: p.chain,
            display: p.display,
            owner: {
                username: p.owner.username,
                uid: p.owner.uid,
            },
            punchline: p.punchline,
            description: p.description,
            deployed: p.deployed,
            goal: p.goal,
            raised: p.raised,
            expiry: p.expiry,
            upvotes: p.upvotes,
            comments: p.comments,
        }

        setProject(project)
    }

    useEffect(() => {
        top()
    }, [])

    return (
        <div className={s.top}>
            <h2>Most Punched Today!</h2>
            {
                project ?
                    <div className={s.card}
                        onClick={() => {
                            router.push(`/projects/${project?.pid}`)
                        }}
                    >
                        <img src={project?.display} />
                        <div className={s.progress}>
                            <span></span>
                        </div>
                        <div className={s.info}>
                            <div className={s.left}>
                                <FaRegUserCircle />
                                <div className={s.updoots}>
                                    <FaArrowUp />
                                    <div className={s.doots}>{project?.upvotes}</div>
                                </div>
                            </div>
                            <div className={s.right}>
                                <h3>{project?.name}</h3>
                                <h4>{project?.owner.username}</h4>
                                <p className={s.punchline}>
                                    {project?.punchline}
                                </p>
                                <p className={s.description}>
                                    {project?.description}
                                </p>
                                <i>
                                    {project?.comments?.length || 0} comments
                                </i>
                            </div>
                        </div>
                    </div> : "..."
            }

        </div>
    )
}