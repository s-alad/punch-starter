import { Button, Heading, Textarea } from "@chakra-ui/react";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources/index.mjs";

import { EditableProjectUI } from "@/components/EditableProject";
import { Input } from "@chakra-ui/input";
import OpenAI from "openai";
import React from "react";
import ReactMarkdown from "react-markdown";
import {emptyProject} from "@/utils/constant";
import { useRouter } from "next/router";
import { useState } from "react";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function ImportUI() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const [project, setProject] = useState(emptyProject);

  const [descriptionInput, setDescriptionInput] = useState(
    "A crowdfunding platform for blockchain projects."
  );
  const [githubLinkInput, setGithubLinkInput] = useState(
    "https://github.com/WilliamUW/consensus"
  );
  const [generatedDescription, setGeneratedDescription] = useState(``);

  let projectEdit = EditableProjectUI(project);

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
                projectname: { type: "string" },
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
                      milestonename: { type: "string" },
                      milestonedescription: { type: "string" },
                    },
                    required: ["milestonename", "milestonedescription"],
                  },
                },
              },
              required: [
                "projectname",
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

          setProject(functionArgs);
          console.log(functionArgs);
          setGeneratedDescription(
            responseMessage.content || "Form populated successfully!  "
          );
        }
      }
    } catch (error) {
      console.error("Error generating project description:", error);
    }
    setFormLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
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
        <Textarea
          className="w-full px-4 py-2 border rounded-md text-black resize-y shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter text"
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
        />
        <br />
        <br />
        <h3 className="mb-2 text-lg font-semibold">
          Import from Github (URL):
        </h3>
        <Input
          type="text"
          className="w-full px-4 py-2 border rounded-md text-black shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter GitHub link"
          value={githubLinkInput}
          onChange={(e) => setGithubLinkInput(e.target.value)}
        />
        <br />
        <br />
        <Button onClick={handleFormPopulationSubmit}>
          Generate Project Description
        </Button>
        {formLoading && (
          <img
            style={{ borderRadius: 50, marginTop: 30 }}
            src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnF3eWJxd2ZtaXhmd3hsOGZlM3N1c3hmOTdzY3F6aWJnbDF3emN2YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/unQ3IJU2RG7DO/giphy.gif"
          ></img>
        )}
      </div>

      <div
        className="flex flex-col items-center justify-center mt-4"
        style={{ width: "50%" }}
      >
        {project && projectEdit}
        {false && generatedDescription && (
          <div
            className="mt-16 p-4 border rounded-md text-left"
            style={{ maxWidth: "100% " }}
          >
            <br />
            <h3 className="text-xl font-bold">Generated Project Description</h3>
            <br />
            <ReactMarkdown>{generatedDescription}</ReactMarkdown>
            {project && JSON.stringify(project, null, 2)}
          </div>
        )}
      </div>
    </div>
  );
}
