import supabase from "@/utils/supabase";
import React from "react";
import s from "./explore.module.scss";

export default function Explore() {

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
        </div>
    );
}