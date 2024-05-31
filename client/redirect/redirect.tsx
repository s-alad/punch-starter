import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authcontext";


// these are the protected routes that you need token verification
// add routes that you want to have it protected
// also only these routes can get the decoded jwt token data
// Many of these routes do not exits yet. That's okay (:
const protectedRoutes = [
    "/profile",
    "/onboarding",
    "/connect",
];

export default function RedirectBasedOnAuth({ children }: { children: React.ReactNode }) {
    /**
     * This is a higher level component who's job it is to redirect the user to the home page if they are not authenticated but attempt to navigate to a protected route.
     */

    const { loading, puncher, session } = useAuth();

    const [calledPush, setCalledPush] = useState(false);
    const router = useRouter();
    const currentRoute = router.asPath; // this shows the route you are currently in

    useEffect(() => {

        if (loading) {
            return;
        }

        if (protectedRoutes.includes(currentRoute)) {
            if ((!session && !calledPush)) {
                setCalledPush(true);
                router.push("/");
                return;
            }

            if (puncher && !puncher.onboarded && currentRoute !== "/onboarding") {
                console.log("pushing to onboarding");
                setCalledPush(true);
                router.push("/onboarding");
                return;
            } else if (puncher && puncher.onboarded && currentRoute === "/onboarding") {
                console.log("pushing to /");
                setCalledPush(true);
                router.push("/");
                return;
            }


        } else if (currentRoute === "/") {
            console.log("current route is /");

            if (session) {
                if (puncher && !puncher.onboarded) {
                    console.log("pushing to onboarding");
                    setCalledPush(true);
                    router.push("/onboarding");
                    return;
                } 
            }

        }

    }, [calledPush, currentRoute, router, puncher, session, loading]);

    return children;
};
