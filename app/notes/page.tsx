
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import NotesClient from "../notes/Notes.client";
import { fetchNotes } from "@/lib/api";
import { NOTES_QUERY_KEY } from "@/constants/query-keys";

const createQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    });
};

export default async function NotesPage() {
    const queryClient = createQueryClient();

    await queryClient.prefetchQuery({
        queryKey: [NOTES_QUERY_KEY, {}],
        queryFn: () => fetchNotes({}),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <NotesClient />
        </HydrationBoundary>
    );
}
