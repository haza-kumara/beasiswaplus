import type { ScholarshipMatch } from "@/types/matching";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold tabular-nums w-10 text-right">
        {pct}%
      </span>
    </div>
  );
}

export function MatchCard({ match }: { match: ScholarshipMatch }) {
  const deadline = match.deadline
    ? new Date(match.deadline).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const isDeadlineSoon =
    match.deadline
      ? new Date(match.deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
      : false;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-base leading-snug">{match.title}</CardTitle>
          {deadline && (
            <Badge variant={isDeadlineSoon ? "destructive" : "secondary"} className="shrink-0 text-xs">
              {isDeadlineSoon ? "⚠ " : ""}
              {deadline}
            </Badge>
          )}
        </div>
        <ScoreBar score={match.matchScore} />
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {match.reasons.length > 0 && (
          <ul className="text-sm text-muted-foreground space-y-1">
            {match.reasons.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-green-500 shrink-0">✓</span>
                {r}
              </li>
            ))}
          </ul>
        )}

        {match.missingDocuments.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Dokumen yang perlu disiapkan:
            </p>
            <div className="flex flex-wrap gap-1">
              {match.missingDocuments.map((doc) => (
                <Badge key={doc} variant="outline" className="text-xs">
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {match.applicationUrl && (
          <Button asChild size="sm" className="w-fit mt-1">
            <a href={match.applicationUrl} target="_blank" rel="noopener noreferrer">
              Daftar Sekarang →
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
