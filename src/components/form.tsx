import { zodResolver } from "@hookform/resolvers/zod"
import { Controller ,useForm } from "react-hook-form"
import * as z from "zod"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"
import { Input } from "@base-ui/react/input";

const loginSchema = z.object({
    username: z
        .string()
        .min(3, "Username minimal 3 karakter.")
        .max(20, "Username maksimal 20 karakter.")
        .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh huruf, angka, dan underscore."),

    password: z
        .string()
        .min(8, "Password minimal 8 karakter.")
        .max(100, "Password terlalu panjang.")
});

export default function LoginForm() {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    function onSubmit(data: z.infer<typeof loginSchema>) {
        // Do something with the form values.
        console.log(data)
    }

    return (
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* ... */}
            <FieldGroup>
                {/* Username field */}
                <Controller 
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Bug Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Login button not working on mobile"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
                />


                {/* Password field */}

                {/* button */}
            </FieldGroup>
            {/* ... */}
        </form>
    )
}