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
import { HeartIcon, PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { useRecoilState } from "recoil";
import { favAtom } from "@/app/@state/favorite-atom";

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
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{query.data?.name}</span>
          <Button onClick={addFav} variant={isFav ? "default" : "outline"}>
            <HeartIcon fill={isFav ? "#fff" : "#323232"} className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription>{query.data?.breed} </CardDescription>
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
        <Button variant="outline" onClick={() => mutation.mutate()}>
          Eliminar
        </Button>
        <Button asChild className="flex gap-2">
          <Link href={`edit/${params.id}`}>
            <PencilIcon className="w-4 h-4" />
            <span>Editar</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
