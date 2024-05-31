import supabase from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import s from "./explore.module.scss";
import { useRouter } from "next/router";
import Project from "@/models/project";
import Card from "@/components/card/card";

export default function Explore() {

    const router = useRouter();
    let [projects, setProjects] = useState<Project[]>([]);
    const { chain } = router.query;

    async function getProjects() {

        // also get the owner of the project
        // limit to 10
        const { data, error } = await supabase
            .from('projects')
            .select(`*, owner!inner(username)`)
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

        console.log(projects);

        setProjects(projects);

    }

    useEffect(() => {
        getProjects();
    }, [chain])

    async function searchProjects(query: string) {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .or(
                `name.ilike.%${query}%` +
                `,description.ilike.%${query}%` +
                `,punchline.ilike.%${query}%`
            )
            .limit(10);
    
        if (error) {
            console.error('Error searching projects:', error);
            return [];
        }
    
        return data;
    }

    return (
        <div className={s.explore}>
            <h1>Explore</h1>
            <div className={s.cards}>
                {
                    projects.map(project => (
                        <Card key={project.pid} project={project} />
                    ))
                }
            </div>
        </div>
    );
}