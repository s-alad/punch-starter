import { Button, Card, Collapse } from "antd";
import {
  exampleCreator,
  exampleProject,
  placeholderImageUrl,
} from "@/utils/constant";

import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import OpenAI from "openai";
import React from "react";
import { Textarea } from "@chakra-ui/react";
import { useState } from "react";

const { Panel } = Collapse;
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});
export default function ChatPage() {
  const chat = ChatUI(exampleProject, exampleCreator);
  return chat;
}

export function ChatUI(project: any, creator: any) {
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [generatedResponse, setGeneratedResponse] = useState<string>("");
  let [loading, setLoading] = useState(true);
  let [amount, setAmount] = useState(0);
  let [funding, setFunding] = useState(false);
  const [chatHeader, setChatHeader] = useState<string>("Chat with Project!");
  let [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

  async function getProject() {
    setLoading(true);
    console.log("getting project");
    if (!project || !creator) {
      console.log("no project or creator");
      return;
    }

    const creatorString = JSON.stringify(creator).slice(0, 2000);
    const projectString = JSON.stringify(project).slice(0, 2000);
    setMessages([
      ...messages,
      {
        role: "system",
        content: `You are a helpful assistant that will answer questions about the project and creator at hand.
      
      Project: ${projectString}
      
      Creator: ${creatorString}`,
      },
    ]);
    setGeneratedResponse(
      `Ask me anything about the project \'${project.projectname}\' or the creator \'${creator.name}\'.`
    );
    setLoading(false);
  }

  React.useEffect(() => {
    getProject();
  }, [project]);

  const handleQuestion = async (question: string) => {
    console.log(question, messages);
    setChatHeader(question);
    setGeneratedResponse("Asking... " + question);
    try {
      const newMessages: ChatCompletionMessageParam[] = [
        ...messages,
        {
          role: "user",
          content: `${question}`,
        },
      ];
      setMessages((messages) => [
        ...messages,
        {
          role: "user",
          content: `${question}`,
        },
      ]);
      const tools = [
        {
          type: "function",
          function: {
            name: "contact_user",
            description:
              "Contact the creator of the project to ask for more information.",
            parameters: {
              type: "object",
              properties: {},
              required: [],
            },
          },
        },
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        max_tokens: 500,
        messages: newMessages,
        // tools: tools as ChatCompletionTool[],
        // tool_choice: "none",
      });
      console.log(response.choices[0]);

      const gptDescription = response.choices[0].message.content;
      console.log(gptDescription);
      setGeneratedResponse(gptDescription || "No response");
      setMessages([
        ...messages,
        {
          role: "assistant",
          content: `${gptDescription}`,
        },
      ]);
      const responseMessage = response.choices[0].message;
      const toolCalls = responseMessage.tool_calls;

      if (toolCalls) {
        for (const toolCall of toolCalls) {
          const functionArgs = JSON.parse(toolCall.function.arguments);
        }
      }
    } catch (error) {
      console.error("Error generating project description:", error);
    }
  };

  return (
    <main>
      <div style={{ display: "flex", flexDirection: "row", gap: 40 }}>
        {creator && (
          <Card style={{ textAlign: "center", marginTop: 50 }}>
            <div>
              <img
                src={creator.profileImageUrl || placeholderImageUrl}
                alt="Profile"
                style={{ borderRadius: "50%", height: 150, width: 150 }}
              />
              <div>
                <h3>{creator.name}</h3>
                <p>{creator.email}</p>
                <p>{creator.education}</p>
                <p>{creator.bio?.slice(0, 100)}</p>
              </div>
            </div>
            <br />
            <Collapse>
              <Panel header="See Full Profile" key="1">
                <p>
                  <strong>Username:</strong> {creator.username}
                </p>
                <p>
                  <strong>Email:</strong> {creator.email}
                </p>
                <p>
                  <strong>Bio:</strong> {creator.bio}
                </p>
                <p>
                  <strong>Location:</strong> {creator.location}
                </p>
                <p>
                  <strong>Projects Funded:</strong> {creator.projectsfunded}
                </p>
                <p>
                  <strong>Amount Raised:</strong> {creator.amountraised}
                </p>
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={creator.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {creator.linkedin}
                  </a>
                </p>
                <p>
                  <strong>Twitter:</strong>{" "}
                  <a
                    href={creator.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {creator.twitter}
                  </a>
                </p>
                <p>
                  <strong>GitHub:</strong>{" "}
                  <a
                    href={creator.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {creator.github}
                  </a>
                </p>
                <p>
                  <strong>Portfolio:</strong>{" "}
                  <a
                    href={creator.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {creator.portfolio}
                  </a>
                </p>
                <p>
                  <strong>Past Experiences:</strong> {creator.pastexperiences}
                </p>
              </Panel>
            </Collapse>
          </Card>
        )}
        <Card style={{ textAlign: "center", marginTop: 50 }}>
          <div>
            <h3 style={{ fontSize: 20 }}>{chatHeader}</h3>
            <p>{generatedResponse}</p>
            <Textarea
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
            />
            <br />
            <Button
              style={{ marginTop: 20 }}
              onClick={() => handleQuestion(userQuestion)}
            >
              Ask
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
