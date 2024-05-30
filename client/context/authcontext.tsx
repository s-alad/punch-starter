import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { CVAR } from "@/utils/constant";

interface Raiser {
    email?: string;
    name?: string;
    onboarded: boolean;
    signature?: string;
    user:  null | undefined;
}

interface IAuthContext {
    raiser: Raiser | null | undefined;
    user: null | undefined;
    loading: boolean;
    connect: () => void;
    disconnect: () => void;
}

const AuthContext = createContext<IAuthContext>({
    raiser: null,
    user: null,
    loading: false,
    connect: () => {},
    disconnect: () => {}
});

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const [raiser, setRaiser] = useState<Raiser | null>(null);
    const [user, setUser] = useState<null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    function connect() {
      
    }

    function disconnect() {

    }

    useEffect(() => {
        setLoading(true);
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, raiser, loading, connect, disconnect }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};
