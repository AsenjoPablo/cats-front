"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import BodySection from "@/components/custom/BodySection";
import { Cat } from "@/types/cat";
import { HeartIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { useRecoilState } from "recoil";
import { favAtom } from "@/app/@state/favorite-atom";
import Image from "next/image";

export default function CatDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`http://localhost:8000/cats/${params.id}`, {
        method: "DELETE",
      });
      return response.json();
    },
    onSuccess: () => {
      // lo elimina de favoritos
      setFavState(favState.filter((fav) => fav !== params.id.toString()));
      router.push(`/`);
    },
  });

  const query = useQuery<Cat>({
    queryKey: ["cat", params.id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/cats/${params.id}`);
      return response.json();
    },
  });

  // tenemos un estado de recoil que almacena los favoritos
  const [favState, setFavState] = useRecoilState(favAtom);

  const addFav = () => {
    if (favState.filter((fav) => fav === params.id.toString()).length > 0) {
      setFavState(favState.filter((fav) => fav !== params.id.toString()));
    } else {
      setFavState([...favState, params.id.toString()]);
    }
  };

  const isFav =
    favState.filter((fav) => fav === params.id.toString()).length > 0;

  if (query.isLoading) {
    return <BodySection>Cargando...</BodySection>;
  }

  if (query.isError) {
    return <BodySection>Error al cargar el gato</BodySection>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* header image */}
      <div className="relative">
        <Image
          src={query.data?.image || "/images/default-cat.jpeg"}
          alt={query.data?.name ?? ""}
          width={540}
          height={540}
          className="w-full h-24 md:h-36 rounded object-cover"
        />

        {/* overlay */}
        <div className="absolute top-0 left-0 bg-gradient-to-br from-transparent to-black/50 w-full h-full" />

        <h2 className="absolute bottom-2 right-2 text-white font-bold text-3xl tracking-widest">
          {query.data?.name}
        </h2>
      </div>

      {/* body */}
      <span>Edad: {query.data?.age}</span>
      {query.data && query.data.vaccinations.length > 0 ? (
        <>
          <span>Vacunas:</span>
          <ul className="list-disc list-inside">
            {query.data?.vaccinations.map((vaccine) => (
              <li
                key={vaccine.type}
                className="flex flex-col my-2 border border-green-600 border-dotted bg-green-200 px-4 py-2 rounded"
              >
                <span className="opacity-60 text-xs">
                  {formatDate(vaccine.dateAdministered)}
                </span>
                <span>{vaccine.type}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="bg-red-200 border-red-500 text-red-900 p-3 border border-dotted rounded-lg">
          <span>
            <strong>ATENCIÓN:</strong>&nbsp; No tiene vacunas
          </span>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          onClick={addFav}
          variant={isFav ? "default" : "outline"}
          className="flex gap-2"
        >
          <HeartIcon fill={isFav ? "#fff" : "#323232"} className="h-4 w-4" />
          <span>Favorito</span>
        </Button>
        <Button asChild className="flex gap-2">
          <Link href={`edit/${params.id}`}>
            <PencilIcon className="w-4 h-4" />
            <span>Editar</span>
          </Link>
        </Button>
      </div>
      <hr />

      <Button
        onClick={() => mutation.mutate()}
        variant={"ghost"}
        className="text-red-500"
      >
        Eliminar
      </Button>
    </div>
  );
}
