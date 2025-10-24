import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { fetchNoteById } from "@/lib/api";
import { NOTE_QUERY_KEY } from "@/constants/query-keys";

// interface NoteDetailsPageProps {
//     params: {
//         id: string;
//     };
// }

interface NoteDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

const createQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    });
};

export default async function NoteDetailsPage(props: NoteDetailsPageProps) {

    const { params } = props;
    const { id } = await params;

    const queryClient = createQueryClient();

    await queryClient.prefetchQuery({
        queryKey: [NOTE_QUERY_KEY, id],
        queryFn: () => fetchNoteById(id),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <NoteDetailsClient id={id} />
        </HydrationBoundary>
    );
}