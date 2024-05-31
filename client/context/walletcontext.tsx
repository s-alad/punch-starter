import { AppConfig, openSignatureRequestPopup, showConnect, UserSession } from "@stacks/connect";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { StacksTestnet } from '@stacks/network';
import { CVAR } from "@/utils/constant";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig, });

interface Stacks {
    stacksaddress?: string;
    user: UserSession | null | undefined;
}

interface Wallets {
    stacks?: Stacks;
}

interface IWalletContext {
    wallets: Wallets | null | undefined;
    user: UserSession | null | undefined;
    loading: boolean;
    stacksconnect: () => void;
    stacksdisconnect: () => void;
    suiconnect: () => void;
    suidisconnect: () => void;
}

const WalletContext = createContext<IWalletContext>({
    wallets: null,
    user: null,
    loading: false,
    stacksconnect: () => {},
    stacksdisconnect: () => {},
    suiconnect: () => {},
    suidisconnect: () => {},
});

export function useWallets() {
    return useContext(WalletContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [wallets, setWallets] = useState<Wallets | null>(null);
    const [user, setUser] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    function stacksconnect() {
        showConnect({
            appDetails: {
                name: "punched",
                icon: window.location.origin + "/logo512.png",
            },
            redirectTo: "/",
            onFinish: async (data) => {

                const mainnetstacks = userSession.loadUserData().profile.stxAddress.mainnet;
                const testnetstacks = userSession.loadUserData().profile.stxAddress.testnet;

                setUser(userSession);
                const stacks = {
                    stacksaddress: mainnetstacks,
                    user: userSession,
                }
                console.log("STACKS", stacks)
                setWallets({ stacks: stacks });
                localStorage.setItem("stacks-wallet", JSON.stringify(stacks));
            },
            userSession,
        });
    }

    function stacksdisconnect() {
        userSession.signUserOut("/");
        setUser(null);
        setWallets(null);
        localStorage.removeItem("stacks-wallets");
    }

    function suiconnect() {

    }

    function suidisconnect() {

    }

    useEffect(() => {
        setLoading(true);
        if (userSession.isUserSignedIn()) {
            setUser(userSession);
            const stacks = JSON.parse(localStorage.getItem("stacks-wallet")!);
            setWallets({ stacks: stacks });
        } else {
            setUser(null);
            setWallets(null);
        }
        setLoading(false);
    }, []);

    return (
        <WalletContext.Provider value={{ user, wallets, loading, stacksconnect, stacksdisconnect, suiconnect, suidisconnect }}>
            {loading ? <div>Loading...</div> : children}
        </WalletContext.Provider>
    );
};
