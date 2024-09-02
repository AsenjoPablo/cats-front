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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// TODO: export const
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
      const response = await fetch(`${process.env.API_URL}/cats/${params.id}`);
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
      return await fetch(`${process.env.API_URL}/cats/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          id: params.id,
          image,
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
      image: undefined,
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

  // al inicio, seteamos la imagen
  React.useEffect(() => {
    if (cat?.image) {
      setImage(cat.image);
    }
  }, [cat?.image]);

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
        className="space-y-4 border shadow-lg p-4 rounded-lg"
      >
        <div className="grid md:grid-cols-2 gap-6">
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
