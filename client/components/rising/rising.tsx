import React from "react";
import { useEffect, useState } from "react";
import { FaSearch, FaUser, FaHome, FaRegUserCircle } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa6";
import s from "./rising.module.scss"
import supabase from "@/utils/supabase";
import Project from "@/models/project";
import { useRouter } from "next/router";

export default function Rising() {

    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>();

    async function rising() {
        // query the project with the longest length of the upvotes column
        // also get the owner of the project
        const { data, error } = await supabase
            .from('projects')
            .select(`*, owner!inner(username)`)
            .order('upvotes', { ascending: false })
            .limit(5)

        if (error) {
            console.error('Error fetching projects:', error);
            return;
        }

        // Exclude the first project and handle potential undefined data
        const filteredProjects = data ? data.slice(1) : [];

        if (filteredProjects.length === 0) {
            setProjects(undefined);
            return;
        }

        const projects = filteredProjects.map(p => ({
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
        }));

        // Assuming setProjects is a function that handles an array of projects
        setProjects(projects);
    }

    useEffect(() => {
        rising()
    }, [])

    return (
        <div className={s.top}>
            <h2>Getting Punched Heavy!</h2>
            {
                !projects && "..."
            }
            <div className={s.punches}>
                {
                    projects && projects.map((project, index) => (
                        <div className={s.card}
                            key={index}
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
                        </div>
                    ))
                }
            </div>
        </div>
    )
}