import { useRouter } from "next/router";
import { createContext, useContext } from "react";
import { CVAR } from "@/utils/constant";

import {
    openContractDeploy, SignatureData, SignatureRequestOptions,
    AppConfig, openSignatureRequestPopup, showConnect, UserSession
} from "@stacks/connect";
import { useConnect, Connect, StacksProvider } from "@stacks/connect-react";
import { StacksTestnet, StacksMainnet } from "@stacks/network";

import React, { useEffect, useState } from "react";
import supabase from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig, });
const mainnet = new StacksMainnet();
const testnet = new StacksTestnet();

type Providers = "stacks" | "github"

interface Puncher {
    uid: string;
    email?: string;
    username?: string;
    avatar?: string;
    onboarded: boolean;
    wallet: {
        stacks?: {
            publickey: string;
        },
        stellar?: {
            publickey: string;
        }
    }
}

interface IAuthContext {
    session?: Session | null;
    puncher: Puncher | null | undefined;
    loading: boolean;
    connect: (provider: Providers) => void;
    disconnect: () => void;
    askToRefresh: () => void;
}

const AuthContext = createContext<IAuthContext>({
    session: null,
    puncher: null,
    loading: false,
    connect: () => { },
    disconnect: () => { },
    askToRefresh: () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [session, setSession] = useState<Session | null>(null);
    const [puncher, setPuncher] = useState<Puncher | null>(null);
    const [user, setUser] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true)
        supabase.auth.getSession().then(({ data: { session } }) => {
            console.log("SESSION", session)
            setSession(session)
            fetchUser(session?.user?.id!);
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("CHANGE SESSION", session)
            setSession(session)
            fetchUser(session?.user?.id!);
            setLoading(false)
        })

        
        return () => subscription.unsubscribe()
    }, [])

    async function githubConnect() {
        const { error, data } = await supabase.auth.signInWithOAuth({
            provider: 'github'
        });
        if (error) console.error('Login failed: ', error);
        else { console.log("GITHUB CONNECTED, USER: ", await supabase.auth.getUser()) }
    }

    async function fetchUser(uid: string) {
        console.log("FETCHING USER", uid)
        if (uid) {
            const { data, error } = await supabase
                .from('accounts')
                .select('uid, onboarded, email, username, avatar')
                .eq('uid', uid)
                .single();  

            if (error) {
                console.error('Failed to fetch user details:', error);
            } else if (data) {
                setPuncher({
                    ...data,
                    wallet: {}
                });
            }
        }
    }

    async function askToRefresh() {
        const { data: session, error } = await supabase.auth.refreshSession();
        if (error) {
            console.error("Failed to refresh session", error)
        } else {
            setSession(session.session);
            fetchUser(session?.user?.id!);
        }
    }

    async function stacksConnect() {
        showConnect({

            appDetails: {
                name: "Rheo",
                icon: window.location.origin + "/logo512.png",
            },
            redirectTo: "/",
            onFinish: async (data) => {

                const mainnetstacks = userSession.loadUserData().profile.stxAddress.mainnet;
                const testnetstacks = userSession.loadUserData().profile.stxAddress.testnet;

                const res = await fetch(`${CVAR}/users/add-user-if-not-exists`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        stacksaddress: mainnetstacks,
                        message: "prove you own your wallet",
                    }),
                })

                const resuser = await res.json()

                setUser(userSession);
                const raiser = {
                    uid: resuser.user.id,
                    onboarded: resuser.user.onboarded,
                    email: resuser.user.email,
                    username: resuser.user.name,
                    user: userSession,
                    wallet: {
                        stacks: {
                            publickey: mainnetstacks,
                        }
                    }
                }
                console.log("RAISER", raiser)
                setPuncher(raiser);
                localStorage.setItem("raiser", JSON.stringify(raiser));

                /* window.location.reload(); */
            },
            userSession,
        });
    }

    async function connect(provider: Providers) {
        switch (provider) {
            case "stacks":
                stacksConnect();
                break;
            case "github":
                await githubConnect();
                break;
            default:
                break;
        }
    }

    async function disconnect() {
        await supabase.auth.signOut();
        setSession(null)
        setPuncher(null)
        setUser(null)
        localStorage.removeItem("raiser");
        router.push("/");
    }

    return (
        <AuthContext.Provider value={{ session, puncher, loading, connect, disconnect, askToRefresh }}>
            {(loading)  ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};


function DeployContract() {
    const handleDeployContract = async () => {
        const response = await fetch(
            "../../contracts/stacks/contracts/Campaign.clar"
        );
        const codeBody = await response.text();
        await openContractDeploy({
            contractName: "Campaign", //Add uuid for unique wallet
            codeBody,
            appDetails: {
                name: "Uplift",
                icon: "",
            },
            network: testnet,
            onFinish: (data) => {
                console.log("Stacks Transaction:", data.stacksTransaction);
                console.log("Transaction ID:", data.txId);
                console.log("Raw transaction:", data.txRaw);
            },
        });
    };

    return (
        <Connect
            authOptions={{
                appDetails: {
                    name: "punch-starter",
                    icon: window.location.origin + "/logo512.png",
                },
                userSession,
            }}
        >
            <button className="Deploy" onClick={handleDeployContract}>
                Activate Funding
            </button>
        </Connect>
    );
}
