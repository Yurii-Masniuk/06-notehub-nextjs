import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '@/types/note';
import { deleteNote } from '@/lib/api';
import { NOTES_QUERY_KEY } from '@/constants/query-keys';
import css from './NoteList.module.css';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface NoteListProps {
    notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ notes }) => {
    const queryClient = useQueryClient();

    const {
        mutate,
        isPending,
        variables
    } = useMutation<Note, Error, string>({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY] });
            toast.success('Нотатка успішно видалена.');
        },
        onError: (error) => {
            console.error('Помилка при видаленні нотатки:', error);
            toast.error('Помилка: не вдалося видалити нотатку.');
        },
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Ви впевнені, що хочете видалити цю нотатку?')) {
            mutate(id);
        }
    };

    if (notes.length === 0) {
        return <p className={css.noNotes}>У вас поки що немає нотаток.</p>;
    }

    return (
        <ul className={css.list}>
            {notes.map((note) => {
                const isDeleting = isPending && variables === note.id;

                return (
                    <li key={note.id} className={css.listItem}>
                        <Link href={`/notes/${note.id}`} className={css.noteLink}>
                            <h2 className={css.title}>{note.title}</h2>
                            <p className={css.content}>{note.content}</p>
                            <span className={css.tag}>{note.tag}</span>
                        </Link>

                        <div className={css.footer}>
                            <button
                                className={css.button}
                                type="button"
                                onClick={() => handleDelete(note.id)}
                                disabled={isPending}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default NoteList;
