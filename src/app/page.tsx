"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cat } from "@/types/cat";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const {
    data: cats,
    isLoading,
    isError,
  } = useQuery<Cat[]>({
    queryKey: ["cats-list"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/cats");
      return response.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("http://localhost:8000/cats", {
        method: "DELETE",
      });
      return response.json();
    },
  });

  const handleDeleteAll = () => {
    // modal de confirmación
    mutation.mutate();
  };

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (isError) {
    return <p>Error al cargar los gatos</p>;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl tracking-widest">CATS</h1>
        <Button size="sm" asChild>
          <Link href={"create-cat"}>Añadir gato</Link>
        </Button>
      </div>

      {/* listado de gatos */}
      <div className="shadow-lg rounded-lg p-2 border border-slate-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Raza</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {
              // si no hay gatos
              cats?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>No hay gatos</TableCell>
                </TableRow>
              )
            }
            {cats?.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="flex items-center gap-2">
                  <Image
                    src={cat.picture || "/images/default-cat.jpeg"}
                    alt={cat.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{cat.name}</span>
                </TableCell>
                <TableCell>{cat.breed}</TableCell>
                <TableCell className="flex justify-end">
                  <Link href={`/cat/${cat.id}`}>
                    <Button size={"sm"} variant={"secondary"}>
                      Ver gato
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {cats && cats.length > 0 && (
        <>
          <hr />

          <Button
            onClick={handleDeleteAll}
            variant={"ghost"}
            className="text-red-500"
          >
            Eliminar todos los gatos
          </Button>
        </>
      )}
    </>
  );
}
