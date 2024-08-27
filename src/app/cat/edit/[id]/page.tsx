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
import { Cat, Vaccine } from "@/types/cat";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
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

export default function EditCatPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // obtener info del gato que editamos
  const {
    data: cat,
    isLoading,
    isError,
  } = useQuery<Cat>({
    queryKey: ["cat", params.id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/cats/${params.id}`);
      return response.json();
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
      return await fetch(`http://localhost:8000/cats/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          id: params.id,
          vaccinations: vaccines,
        }),
      });
    },
    onSuccess: () => {
      router.push(`/cat/${params.id}`);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: cat?.name ?? "",
      breed: cat?.breed ?? "",
      age: cat?.age ?? 0,
      vaccinations: cat?.vaccinations?.map((v) => v.type).join(", ") ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (isError) {
    return <p>Ha ocurrido un error</p>;
  }

  return (
    <Form {...form}>
      <h1>
        Editando a <span className="text-primary">{cat?.name}</span>
      </h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-xl border shadow-lg p-4 rounded-lg"
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
        <div className="flex gap-2">
          <Button asChild type="button" variant="outline">
            <Link href={`/cat/${params.id}`}>Volver</Link>
          </Button>
          <Button disabled={!form.formState.isValid} type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}
