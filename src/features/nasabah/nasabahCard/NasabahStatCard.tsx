import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NasabahStatCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistics</CardTitle>
        <CardDescription>Nasabah statistics</CardDescription>
      </CardHeader>
      <CardContent>{/* Statistics content */}</CardContent>
    </Card>
  );
}