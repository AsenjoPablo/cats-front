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
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MAX_FILE_SIZE = 5_000_000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

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
  image: z
    .instanceof(File)
    .refine((file) => file.size < MAX_FILE_SIZE, {
      message: "Debe pesar menos de 7MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Debe ser una imagen",
    })
    .optional(),
});

export default function CatInfoForm({ id }: { id: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      breed: "",
      age: 0,
      vaccinations: "",
      image: undefined,
    },
  });

  //en  el modo de edición tenemos un id, por lo que podemos hacer un fetch a los datos
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cat", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/cats/${id}`);
      return await response.json();
    },
    enabled: id !== undefined,
  });

  // mutaciones de creación y edición
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const vaccines: Vaccine[] = values.vaccinations
        ? values.vaccinations
            ?.split(",")
            .filter((name) => name !== "")
            .map((v) => {
              return {
                type: v.trim(),
                dateAdministered: new Date().toISOString(),
              };
            })
        : [];

      return await fetch("http://localhost:8000/cats", {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          image,
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
    mutation.mutate(values);
  }

  const [image, setImage] = React.useState<string | null>(null);
  const convert = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (!reader.result) {
        console.error("Error al convertir la imagen");
        return;
      }
      setImage(reader.result.toString());
    };

    reader.readAsDataURL(file);
  };

  const watcher = form.watch("image");
  if (watcher) convert(watcher);

  return (
    <Form {...form}>
      <h1>
        {id ? "Editar" : "Crear"} gato {id ? data?.name : ""}
      </h1>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input autoFocus placeholder="Nombre" {...field} />
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
          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Imagen</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    accept="image/jpeg"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          {image && (
            <Image
              width={32}
              height={32}
              src={image}
              alt="Gato"
              className="w-full h-36 object-cover rounded-lg"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant={"outline"} type="button">
            <Link href="/">Cancelar</Link>
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  );
}
