"use client";

import { useQuery } from "@tanstack/react-query";
import { GET_USER_ACTIVITY } from "@/lib/api/queries";
import dynamic from "next/dynamic";
import { format, subDays } from "date-fns";

const ActivityCalendar = dynamic(
  () => import("react-activity-calendar").then((mod: any) => {
    const Comp = mod.ActivityCalendar || mod.default || mod;
    return (props: any) => <Comp {...props} />;
  }),
  { ssr: false, loading: () => <div className="h-[150px] animate-pulse bg-white/5 rounded-xl w-full" /> }
);

const proxyFetch = async (query: string, variables: any = {}) => {
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
};

export function ActivityHeatmap({ userId }: { userId: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userActivity", userId],
    queryFn: async () => {
      // Fetch 2 pages of activity to get a good spread (100 items)
      const p1 = await proxyFetch(GET_USER_ACTIVITY, { userId, page: 1 });
      const p2 = await proxyFetch(GET_USER_ACTIVITY, { userId, page: 2 });
      
      const act1 = p1?.Page?.activities || [];
      const act2 = p2?.Page?.activities || [];
      
      return [...act1, ...act2].filter(Boolean);
    },
    enabled: !!userId,
  });

  if (isLoading) return <div className="h-[150px] animate-pulse bg-white/5 rounded-xl w-full" />;
  if (error || !data) return <div className="text-muted-foreground text-sm">Could not load activity data.</div>;

  // Process data into heatmap format: { date: "YYYY-MM-DD", count: N, level: 0-4 }
  const counts: Record<string, number> = {};
  
  data.forEach((activity: any) => {
    if (!activity.createdAt) return;
    // AniList returns seconds, JS Date needs ms
    const dateStr = format(new Date(activity.createdAt * 1000), "yyyy-MM-dd");
    counts[dateStr] = (counts[dateStr] || 0) + 1;
  });

  // Generate the last 180 days (half a year) to ensure the calendar looks full
  const calendarData = [];
  const today = new Date();
  
  for (let i = 180; i >= 0; i--) {
    const d = subDays(today, i);
    const dateStr = format(d, "yyyy-MM-dd");
    const count = counts[dateStr] || 0;
    
    // Determine level (0-4) based on count
    let level = 0;
    if (count > 0) level = 1;
    if (count > 2) level = 2;
    if (count > 5) level = 3;
    if (count > 10) level = 4;

    calendarData.push({
      date: dateStr,
      count,
      level,
    });
  }

  const explicitTheme = {
    light: ['#18181b', '#c832ff40', '#c832ff80', '#c832ffc0', '#c832ff'],
    dark: ['#18181b', '#c832ff40', '#c832ff80', '#c832ffc0', '#c832ff'],
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide py-2">
      <div className="min-w-[600px]">
        <ActivityCalendar 
          data={calendarData} 
          theme={explicitTheme}
          colorScheme="dark"
          labels={{
            legend: {
              less: "Less",
              more: "More",
            },
            months: [
              "Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ],
            totalCount: "{{count}} activities in the last half year",
          }}
          blockSize={12}
          blockMargin={4}
          fontSize={12}
        />
      </div>
    </div>
  );
}
