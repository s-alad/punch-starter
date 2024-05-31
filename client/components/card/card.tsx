import React, { useState } from "react";

import s from "./card.module.scss";
import { useRouter } from "next/router";
import Project from "@/models/project";
import { FaArrowUp, FaRegUserCircle } from "react-icons/fa";
import supabase from "@/utils/supabase";
import Comment from "@/models/comment";

export default function Card({project}: {project: Project}) {

    let [comments, setComments] = useState<Comment[]>([]);
    const router = useRouter();

    async function getComments() {
        // query the comments of the project
        // also get the owner of the comment
        const { data, error } = await supabase
            .from('comments')
            .select(`*, owner!inner(username)`)
            .eq('pid', project.pid)
        
        if (error) {
            console.error('Error fetching comments:', error);
            return;
        }

        if (!data) {
            setComments([]);
            return;
        }

        const comments = data.map(c => ({
            cid: c.cid,
            pid: c.pid,
            owner: {
                username: c.owner.username,
                uid: c.owner.uid,
            },
            comment: c.comment,
        }));

        setComments(comments);

    }

    return (
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
                        {comments?.length || 0} comments
                    </i>
                </div>
            </div>
        </div>
    )
}