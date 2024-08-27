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
import { PencilIcon } from "lucide-react";

const cat: Cat = {
  id: 1,
  name: "Gato 1",
  age: 2,
  breed: "Siames",
  vaccinations: [
    {
      type: "rabia",
      dateAdministered: "2021-01-01",
    },
  ],
};

export default function CatDetailPage() {
  return (
    <BodySection>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{cat.name}</CardTitle>
          <CardDescription>{cat.breed} </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <span>Edad: {cat.age}</span>
            <span>Vacunas:</span>
            <ul className="list-disc list-inside">
              {cat.vaccinations.map((vaccine) => (
                <li key={vaccine.type}>
                  {vaccine.type} - {vaccine.dateAdministered}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Eliminar</Button>
          <Button className="flex gap-2">
            <PencilIcon className="w-4 h-4" />
            <span>Editar</span>
          </Button>
        </CardFooter>
      </Card>
    </BodySection>
  );
}
