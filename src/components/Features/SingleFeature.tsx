import { Feature } from "@/types/feature";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, paragraph } = feature;
  return (
    <Card className="w-full h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="mb-6 flex aspect-square w-full items-center justify-center rounded-t-lg bg-primary/10 text-primary overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="mb-4 text-xl font-bold text-foreground sm:text-2xl lg:text-xl xl:text-2xl">
          {title}
        </CardTitle>
        <CardDescription className="text-base font-medium leading-relaxed text-muted-foreground">
          {paragraph}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default SingleFeature;
