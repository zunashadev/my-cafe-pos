import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CardMenuSkeleton() {
  return (
    <Card className="h-fit w-full gap-0 border p-0 shadow-sm">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="space-y-2 px-4 py-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-full" />
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-1/4" />
      </CardFooter>
    </Card>
  );
}
