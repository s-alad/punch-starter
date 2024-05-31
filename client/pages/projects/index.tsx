import React from "react";
import { useEffect, useState } from "react";

import s from "./projects.module.scss";
import { CVAR } from "@/utils/constant";
import Project from "@/models/project";
import { useRouter } from "next/router";
import Loader from "@/components/loader/loader";
import { useAuth } from "@/context/authcontext";
import supabase from "@/utils/supabase";

export default function Projects() {
    const {session, puncher, disconnect, connect} = useAuth()
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);

    async function getmyprojects() {
        setLoading(true);

        supabase
            .from('projects')
            .select(`*, owner!inner(username)`)  
            .eq('owner', puncher?.uid)
            .then(({ data: projects, error }) => {
                if (error) {
                    console.log(error)
                    return
                }
                console.log(projects)

                let nprojects: Project[] = projects.map((project: any) => {
                    return {
                        pid: project.pid,
                        name: project.name,
                        chain: project.chain,
                        display: project.display,
                        owner: project.owner,
                        punchline: project.punchline,
                        description: project.description,
                        deployed: project.deployed,
                        goal: project.goal,
                        raised: project.raised,
                        expiry: project.expiry,
                    }
                })

                setProjects(nprojects)
                setLoading(false)
            })
        setLoading(false);
    }

    // get my projects
    useEffect(() => {
        if (session?.user && puncher) {
            getmyprojects();
        }
    }, [session])
        
    if (!session || !puncher) {
        return (
            <main className={s.projects}>
                <div className={s.projects}>
                    <div className={s.project}>
                        <div className={s.projectname}>You are not signed in</div>
                    </div>
                </div>
            </main>
        )
    }

    if (loading) {
        return (
            <Loader />
        )
    }
    
    return (
        <main className={s.projects}>
            {
                projects.length === 0 &&
                <div className={s.projects}>
                    <div className={s.project}>
                        <div className={s.projectname}>You have no projects</div>
                    </div>
                </div>
            }
            {
                projects.map((project, index) => {
                    return (
                        <div key={index} className={s.project}>
                            <div className={s.left}>
                                <img src={project.display ?? "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"} alt="project" />
                            </div>
                            <div className={s.content}>
                                <div className={s.projectname}>{project.name}</div>
                                <div className={s.creator}>{project.owner.username}</div>
                                <div className={s.description}>{project.punchline}</div>
                                {project.goal && <div className={s.funding}>raised: {project.raised} / {project.goal} STX</div>}
                                <div className={`${s.deployed} ${project.deployed ? s.live : s.draft}`}>{project.deployed ? "deployed" : "draft"}</div>
                            </div>
                            <div className={s.right}>
                                {
                                    project.deployed ? 
                                    <button onClick={() => router.push(`/projects/${project.pid}`)}>View</button> :
                                    <button className={s.edit} onClick={() => { router.push(`/projects/edit/${project.pid}`)}}>
                                        edit
                                    </button>
                                }
                            </div>
                        </div>
                    )
                })
            }
        </main>
    )
}