'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import { NOTE_QUERY_KEY } from '@/constants/query-keys';
import Link from 'next/link';

interface NoteDetailsClientProps {
    id: string;
}

const NoteDetailsClient = ({ id }: NoteDetailsClientProps) => {
    const { data: note, isLoading, isError } = useQuery({
        queryKey: [NOTE_QUERY_KEY, id],
        queryFn: () => fetchNoteById(id),
    });

    if (isLoading) {
        return <p>Loading note details...</p>;
    }

    if (isError || !note) {
        return (
            <div className="text-center p-8 bg-red-100 border border-red-400 rounded-lg">
                <h2 className="text-xl font-bold text-red-600 mb-4">Error loading note</h2>
                <p className="text-red-500">The note with ID "{id}" could not be loaded or does not exist.</p>
                <Link href="/notes" className="text-blue-500 mt-4 inline-block hover:underline">
                    Go back to Notes List
                </Link>
            </div>
        );
    }

    return (
        <main>
            <div className="container mx-auto p-4 max-w-4xl">
                <Link href="/notes" className="text-blue-500 hover:underline mb-4 block">
                    &larr; Back to Notes
                </Link>

                <article className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
                    <h1 className="text-3xl font-extrabold mb-4 text-gray-900">{note.title}</h1>

                    <div className="flex justify-between items-center mb-6 text-sm text-gray-500">
                        <span className="font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                            Tag: {note.tag}
                        </span>
                        <span>
                            Last Updated: {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {note.content}
                    </p>

                    <footer className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400">
                        Note ID: {note.id}
                    </footer>
                </article>
            </div>
        </main>
    );
};

export default NoteDetailsClient;