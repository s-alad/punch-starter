import React, { useState } from "react";

import s from "./chain.module.scss";
import { useRouter } from "next/router";
import supabase from "@/utils/supabase";
import Project from "@/models/project";
import Card from "@/components/card/card";

export default function Chain() {
    const router = useRouter();
    let [projects, setProjects] = useState<Project[]>([]);
    const { chain } = router.query;

    async function getProjects() {

        // query the projects of the chain
        // also get the owner of the project
        // limit to 10
        const { data, error } = await supabase
            .from('projects')
            .select(`*, owner!inner(username)`)
            .eq('chain', chain)
            .limit(10)

        if (error) {
            console.error('Error fetching projects:', error);
            return [];
        }

        if (!data) {
            setProjects([]);
            return;
        }

        const projects = data.map(p => ({
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
        }));

        setProjects(projects);

    }
        

    return (
        <div className={s.chain}>
            <h1>{chain}</h1>
            <div className={s.projects}>
                {
                    projects.map(project => (
                        <Card key={project.pid} project={project} />
                    ))
                }
            </div>
        </div>
    )
}