import {
  AnchorMode,
  broadcastTransaction,
  makeContractDeploy,
} from "@stacks/transactions";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/index.mjs";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Heading, Textarea } from "@chakra-ui/react";
import { StacksMainnet, StacksTestnet } from "@stacks/network";
import { base64ToBlob, blobToFile } from "@/utils/conversion";
import { useEffect, useState } from "react";

import {Input as AntdInput} from "antd";
import Button from "@/components/button/button";
import { CVAR } from "@/utils/constant";
import { Button as ChakraButton } from "@chakra-ui/button";
import { Input as ChakraInput } from "@chakra-ui/input";
import { CreateProjectFormData } from "@/validation/form";
import ImageInput from "@/components/image/image";
import Input from "@/components/input/input";
import Loader from "@/components/loader/loader";
import OpenAI from "openai";
import Project from "@/models/project";
import React from "react";
import { createProjectSchema } from "@/validation/schema";
import s from "./edit.module.scss";
import supabase from "@/utils/supabase";
import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";

/* import { readFileSync } from "fs"; */
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});
export default function Projects() {
  const router = useRouter();
  const { pid } = router.query;
  const { session, puncher } = useAuth();

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [project, setProject] = useState<Project>();

  const [previewImage, setPreviewImage] = useState<string>("");

  const [generatedDescription, setGeneratedDescription] = useState(``);

  const [descriptionInput, setDescriptionInput] = useState(
    "A crowdfunding platform for blockchain projects."
  );
  const [githubLinkInput, setGithubLinkInput] = useState(
    "https://github.com/WilliamUW/consensus"
  );
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const handleFormPopulationSubmit = async () => {
    setFormLoading(true);
    setGeneratedDescription(
      "We are generating your project details... Please wait up to 30 seconds!"
    );
    console.log(descriptionInput, githubLinkInput);
    try {
      const tools = [
        {
          type: "function",
          function: {
            name: "set_project_details",
            description:
              "Generate project details based on given project information.",
            parameters: {
              type: "object",
              properties: {
                projectpunchline: { type: "string" },
                projectdescription: { type: "string" },
                projectdisplayimage: { type: "string" }, // URL for simplicity
                expiry: {
                  type: "string",
                  description:
                    "Date in the format: '2022-12-31' without the quotes",
                },
                fundinggoal: { type: "number" },
                milestones: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      amount: { type: "number" },
                      expiry: {
                        type: "string",
                        description:
                          "Date in the format: '2022-12-31' without the quotes",
                      },
                    },
                    required: ["name", "description", "amount", "expiry"],
                  },
                },
              },
              required: [
                "projectpunchline",
                "projectdescription",
                "expiry",
                "fundinggoal",
                "milestones",
              ],
            },
          },
        },
      ];

      const messages = [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: `Generate an application-style project description based on the following details. 
            
                      Project Description: ${descriptionInput} 
                      
                      GitHub Link: ${githubLinkInput}`,
        },
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        max_tokens: 500,
        messages: messages as ChatCompletionMessageParam[],
        tools: tools as ChatCompletionTool[],
        tool_choice: "auto",
      });
      console.log(response.choices[0]);

      const gptDescription = response.choices[0].message.content;
      setGeneratedDescription(gptDescription || "No description generated.");

      const responseMessage = response.choices[0].message;
      const toolCalls = responseMessage.tool_calls;

      if (toolCalls) {
        for (const toolCall of toolCalls) {
          const functionArgs = JSON.parse(toolCall.function.arguments);

          // remove old milestones
          for (let i = 0; i < fields.length; i++) {
            remove(0);
          }

          // Fetch and set the project display image
          const imageUrl =
            functionArgs.projectdisplayimage ||
            "https://consensus2024.coindesk.com/site/consensus2024/images/userfiles/site-defaults/C23_DRD_Metadata_1200x600_default.png";
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const file = new File([blob], "projectdisplayimage.jpg", {
            type: blob.type,
          });
          setValue("display", file);
          setPreviewImage(imageUrl);

          // Set the other form values
          setValue("punchline", functionArgs.projectpunchline);
          setValue("description", functionArgs.projectdescription);
          setValue("goal", functionArgs.fundinggoal);
          setValue("expiry", functionArgs.expiry);
          setValue("milestones", functionArgs.milestones);

          setGeneratedDescription(
            responseMessage.content || "Form populated successfully!  "
          );
        }
      }
      setFormLoading(false);
    } catch (error) {
      console.error("Error generating project description:", error);
    }
  };

  async function onSubmit(data: CreateProjectFormData) {
    setLoading(true);
    console.log("submit", data);

    // always delete the previous display image
    const { data: displayexists, error: delerror } = await supabase.storage
      .from("projects")
      .remove([`${project?.pid}/display`]);

    if (delerror) {
      console.error("Error deleting file:", delerror);
      setError("Error deleting file");
      return;
    }

    // upload display image to supabase bucket and get url
    const { data: displaydata, error: displayerror } = await supabase.storage
      .from("projects")
      .upload(`${project?.pid}/display`, data.display);
    if (displayerror) {
      console.error("Error uploading file:", displayerror);
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
      console.error("display url not found");
      setError("Display url error");
      return;
    }

    // upload milestones to the milestones table
    data.milestones.forEach(async (milestone) => {
      const { data: milestonedata, error: milestoneerror } = await supabase
        .from("milestones")
        .insert({
          pid: project?.pid,
          name: milestone.name,
          description: milestone.description,
          amount: milestone.amount,
          expiry: milestone.expiry,
        });

      if (milestoneerror) {
        console.error("Error inserting milestone:", milestoneerror);
        setError("Error inserting milestone");
        return;
      }
    });

    // upload project to the projects table
    const { data: projectdata, error: projecterror } = await supabase
      .from("projects")
      .update({
        punchline: data.punchline,
        description: data.description,
        display: displayurl,
        goal: data.goal,
        deployed: true,
      })
      .eq("pid", project?.pid);

    if (projecterror) {
      console.error("Error inserting project:", projecterror);
      setError("Error inserting project");
      return;
    }

    // push to the project page
    router.push(`/projects/${project?.pid}`);
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      milestones: [
        {
          name: "",
          description: "",
          amount: 0,
          expiry: "",
        },
      ],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "milestones",
  });

  async function getProject() {
    supabase
      .from("projects")
      .select(`*, owner!inner(username, uid)`)
      .eq("pid", pid)
      .then(({ data: projects, error }: any) => {
        if (error) {
          console.log(error);
          return;
        }
        const rproject = projects[0];
        console.log(projects);
        console.log(projects[0].owner);
        console.log(puncher?.uid);
        let project: Project = {
          pid: rproject.pid,
          name: rproject.name,
          chain: rproject.chain,
          display: rproject.display,
          owner: {
            username: rproject.owner.username,
            uid: rproject.owner.uid,
          },
          punchline: rproject.punchline,
          description: rproject.description,
          deployed: rproject.deployed,
          goal: rproject.goal,
          raised: rproject.raised,
          expiry: rproject.expiry,
          upvotes: rproject.upvotes,
        };

        setProject(project);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (session && pid) {
      getProject();
    }
  }, [session, pid]);

  if (!session || !pid) {
    return <Loader />;
  }
  if (project && project.owner.uid !== puncher?.uid) {
    return <>you do not own this project</>;
  }
  if (project && project.deployed) {
    return <>this project has already been deployed</>;
  }

  return (
    <main className={s.edit}>
      {project && (
        <div className={s.project}>
          <div className={s.projectname}>{project.name}</div>
          <div className={s.creator}>{project.owner.username}</div>
          <div
            className="flex flex-col items-center justify-center mt-4"
            style={{ width: "50%" }}
          >
            <Heading as="h1" size="lg" mb="4">
              Project Creation
            </Heading>
            <h3 className="mb-2 text-lg font-semibold">
              Brief Project Description:
            </h3>
            <AntdInput.TextArea
              placeholder="Enter text"
              value={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
            />
            <br />
            <br />
            <h3 className="mb-2 text-lg font-semibold">
              Import from Github (URL):
            </h3>
            <AntdInput
              type="text"
              placeholder="Enter GitHub link"
              value={githubLinkInput}
              onChange={(e) => setGithubLinkInput(e.target.value)}
            />
            <br />
            <br />
            <Button onClick={handleFormPopulationSubmit} text="Generate Project Description">
              
            </Button>
            {formLoading && (
              <img
                style={{ borderRadius: 50, marginTop: 30 }}
                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnF3eWJxd2ZtaXhmd3hsOGZlM3N1c3hmOTdzY3F6aWJnbDF3emN2YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/unQ3IJU2RG7DO/giphy.gif"
              ></img>
            )}
          </div>
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
              {fields.map((field, index) => {
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
                );
              })}
              <div className={s.functionality}>
                <div
                  className={s.add}
                  onClick={() => {
                    if (fields.length < 5) {
                      append({
                        name: "",
                        description: "",
                        amount: 0,
                        expiry: "",
                      });
                    }
                  }}
                >
                  + Add Milestone
                </div>
                <div
                  className={s.remove}
                  onClick={() => {
                    if (fields.length > 1) {
                      remove(fields.length - 1);
                    }
                  }}
                >
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
            <Button
              text="DEPLOY"
              type="submit"
              onClick={() => {
                console.log("deploying project");
                console.log(errors);
              }}
              loading={loading}
            />
          </form>
        </div>
      )}
    </main>
  );
}
