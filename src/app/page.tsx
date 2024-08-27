import BodySection from "@/components/custom/BodySection";
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
import Image from "next/image";
import Link from "next/link";

const cats: Cat[] = [
  {
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
  },
  {
    id: 2,
    name: "Gato 2",
    age: 3,
    breed: "Sphynx",
    vaccinations: [
      {
        type: "rabia",
        dateAdministered: "2021-01-01",
      },
      {
        type: "triple felina",
        dateAdministered: "2021-01-01",
      },
    ],
  },
];

export default function Home() {
  return (
    <BodySection>
      <h1 className="font-bold text-2xl tracking-widest">CATS</h1>

      {/* listado de gatos */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Raza</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>

        <TableBody>
          {cats.map((cat) => (
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
    </BodySection>
  );
}
