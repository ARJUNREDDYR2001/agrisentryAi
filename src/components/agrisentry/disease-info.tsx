import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug } from "lucide-react";

const commonDiseases = [
  { name: 'Powdery Mildew', description: 'A fungal disease that appears as white powdery spots on leaves and stems. Thrives in high humidity and moderate temperatures.' },
  { name: 'Late Blight', description: 'Caused by the oomycete Phytophthora infestans, this disease causes lesions on leaves, stems, and fruits. Common in tomatoes and potatoes.' },
  { name: 'Bacterial Leaf Spot', description: 'Appears as water-soaked spots on leaves which turn dark. Spreads quickly in wet and warm conditions.' },
  { name: 'Rust', description: 'Fungal disease causing reddish-brown pustules on leaves. It can reduce plant vigor and yield.' },
];

export default function DiseaseInfo() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bug />
          Disease Library
        </CardTitle>
        <CardDescription>Common diseases affecting crops in India.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {commonDiseases.map((disease, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{disease.name}</AccordionTrigger>
              <AccordionContent>
                {disease.description}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
