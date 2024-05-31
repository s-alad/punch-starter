import React, { useState } from "react";
import s from "./onboarding.module.scss"
import { useAuth } from "@/context/authcontext";
import { useForm } from "react-hook-form";
import { OnboardingFormData } from "@/validation/form";
import { onboardingSchema } from "@/validation/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/input/input";
import ImageInput from "@/components/image/image";
import supabase from "@/utils/supabase";
import Button from "@/components/button/button";
import { useWallets } from "@/context/walletcontext";
import { ConnectButton } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";
export default function Onboarding() {
    const { connect, puncher, askToRefresh } = useAuth()
    const { stacksconnect, wallets } = useWallets()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [part, setPart] = useState<"info" | "wallets">("info")
    const [previewImage, setPreviewImage] = useState<string>("");

    const { register, handleSubmit, control, formState: { errors } } =
        useForm<OnboardingFormData>({
            resolver: zodResolver(onboardingSchema),
            defaultValues: {}
        });
    async function onSubmit(data: OnboardingFormData) {
        setLoading(true)

        const { username, avatar } = data;
        const { data: updatedData, error } = await supabase
            .from('accounts')
            .update({
                username,
                avatar,
                /* onboarded: true */
            })
            .eq('uid', puncher?.uid);

        if (error) {
            console.error("ERROR", error)
            setError(error.message)
        }

        setPart("wallets")
        setLoading(false)
    }
    async function proceed() {
        setLoading(true)
        const { data: updatedData, error } = await supabase
            .from('accounts')
            .update({
                onboarded: true
            })
            .eq('uid', puncher?.uid);

        if (error) {
            console.error("ERROR", error)
            setError(error.message)
        }
        askToRefresh()
        setLoading(false)
    }

    return (
        <main className={s.onboarding}>
            <h1>Welcome to Punch Starter!</h1>
            <p>we need some information to get you started</p>
            {
                part === "info" && (
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className={s.identifier}>
                            <span>Your Email Address:</span>
                            <p className={s.address}>{puncher?.email}</p>
                        </div>

                        <Input<OnboardingFormData>
                            type="text"
                            inputstyle="input"
                            label="Username"
                            placeholder="Choose a snappy username!"
                            name="username"
                            register={register}
                            error={errors.username}
                        />
                        <ImageInput
                            name="avatar"
                            control={control}
                            error={errors.avatar}
                            label="Pick a profile picture!"
                            previewimg={previewImage}
                            callback={setPreviewImage}
                        />
                        <Button type="submit" text="Submit" loading={loading} />
                    </form>
                )
            }
            {
                part === "wallets" && (
                    <div className={s.wallets}>
                        <div className={s.identifier}>
                            <span>Connect Your Wallets</span>
                        </div>
                        
                        <div className={s.wallet} onClick={stacksconnect}>
                            <img src='https://cryptologos.cc/logos/stacks-stx-logo.png' />
                            <div>Stacks</div>
                        </div>

                        <div className={s.wallet}
                            style={{
                                position: "relative",
                            }}
                        >
                            <img src='https://cryptologos.cc/logos/sui-sui-logo.png' />
                            <div>sui</div>
                            <ConnectButton
                            style={{
                                position: "absolute",
                                bottom: "0",
                                left: "0",
                                width: "100%",
                                height: "100%",
                                padding: "6px",
                                borderRadius: "10px",
                                backgroundColor: "transparent",
                                color: "#000",
                                border: "1px solid #000",
                                fontWeight: "normal",
                            }}
                        />
                        </div>

                        <Button text="continue" onClick={proceed} loading={loading} />
                    </div>
                )
            }
        </main>
    )
}