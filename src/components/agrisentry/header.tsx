import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LeafLogo from "@/components/icons/leaf-logo";
import { Globe } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <a href="/" className="flex items-center gap-2">
            <LeafLogo className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-bold">AgriSentryAI</span>
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <Select defaultValue="en">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="mr">मराठी</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
