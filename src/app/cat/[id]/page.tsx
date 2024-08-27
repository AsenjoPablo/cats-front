"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="w-[350px] shadow-lg">
      <CardHeader className="gap-4">
        <Image
          src={query.data?.picture || "/images/default-cat.jpeg"}
          alt={query.data?.name ?? ""}
          width={540}
          height={540}
          className="w-full h-24 rounded object-cover"
        />
        <CardTitle className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span>{query.data?.name}&nbsp;</span>
            <Button onClick={addFav} variant={isFav ? "default" : "outline"}>
              <HeartIcon
                fill={isFav ? "#fff" : "#323232"}
                className="h-4 w-4"
              />
            </Button>
          </div>
          <span className="opacity-40 text-sm">({query.data?.breed})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <span>Edad: {query.data?.age}</span>
          <span>Vacunas:</span>
          <ul className="list-disc list-inside">
            {query.data?.vaccinations.map((vaccine) => (
              <li
                key={vaccine.type}
                className="flex flex-col my-2 border border-slate-200 px-4 py-2 rounded"
              >
                <span className="opacity-60 text-xs">
                  {formatDate(vaccine.dateAdministered)}
                </span>
                <span>{vaccine.type}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/">Volver</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => mutation.mutate()}>
            <TrashIcon className="w-4 h-4" />
          </Button>
          <Button asChild className="flex gap-2">
            <Link href={`edit/${params.id}`}>
              <PencilIcon className="w-4 h-4" />
              <span>Editar</span>
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
