"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Vaccine } from "@/types/cat";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres"),
  breed: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres"),
  age: z.coerce.number().int().min(0, "Su edad no puede ser negativa"),
  vaccinations: z.string().optional(),
});

export default function CreateCatPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      breed: "",
      age: 0,
      vaccinations: "",
    },
  });

  // http
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const vaccines: Vaccine[] = values.vaccinations
        ? values.vaccinations?.split(",").map((v) => {
            return {
              type: v.trim(),
              dateAdministered: new Date().toISOString(),
            };
          })
        : [];
      return await fetch("http://localhost:8000/cats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          vaccinations: vaccines,
        }),
      });
    },
    onSuccess: () => {
      router.push("/");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const vaccines = values.vaccinations?.split(",").map((v) => v.trim());

    mutation.mutate(values);

    // await fetch("http://localhost:8000/cats", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     ...values,
    //     vaccinations: vaccines,
    //   }),
    // }).then((res) => {
    //   console.log(res);
    // });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-xl"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre" {...field} />
              </FormControl>
              <FormDescription>El nombre de tu nuevo gato</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edad</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Edad" {...field} />
              </FormControl>
              <FormDescription>Edad en años gatunos</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Raza</FormLabel>
              <FormControl>
                <Input placeholder="Raza" {...field} />
              </FormControl>
              <FormDescription>Su raza de nacimiento</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vaccinations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vacunas</FormLabel>
              <FormControl>
                <Input placeholder="Vacuna1, Vacuna2, ..." {...field} />
              </FormControl>
              <FormDescription>Separa las vacunas por comas</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={!form.formState.isValid} type="submit">
          Guardar
        </Button>
      </form>
    </Form>
  );
}
