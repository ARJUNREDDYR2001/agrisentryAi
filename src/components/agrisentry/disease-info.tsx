import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/context/locale-context";
import { Bug } from "lucide-react";

export default function DiseaseInfo() {
  const { t } = useLocale();
  
  const commonDiseases = [
    { name: t('powderyMildew'), description: t('powderyMildewDesc') },
    { name: t('lateBlight'), description: t('lateBlightDesc') },
    { name: t('bacterialLeafSpot'), description: t('bacterialLeafSpotDesc') },
    { name: t('rust'), description: t('rustDesc') },
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bug />
          {t('diseaseLibrary')}
        </CardTitle>
        <CardDescription>{t('diseaseLibraryDescription')}</CardDescription>
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
