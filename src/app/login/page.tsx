"use client"
import * as z from "zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup, Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { authenticateUser } from "./action";
import { toast } from "sonner"
import { useRouter } from "next/navigation";

export default function Login() {

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    })

    async function onSubmit(data: z.infer<typeof loginSchema>) {

        const result = await authenticateUser(data);

        if (result.error) {

            toast.error(result.error, { position: "top-right" });

        } else {

            toast.success("Login Berhasil!", { position: "top-right" });
            
            router.refresh();

            router.push("/owner/dashboard")

        }

    }

    return (

        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="username">Username</FieldLabel>
                                <Input id="username" type="text" placeholder="Username" {...register("username")} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <Input id="password" type="password" placeholder="Password" {...register("password")} />
                            </Field>
                        </FieldGroup>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
