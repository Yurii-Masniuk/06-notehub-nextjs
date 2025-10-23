'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { toast } from 'react-hot-toast';

import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

import { fetchNotes, type NotesCollectionResponse } from '@/app/lib/api';
import { NOTES_QUERY_KEY } from '@/constants/query-keys';

const INITIAL_PAGE = 1;

const NotesClient = () => {
    const [page, setPage] = useState(INITIAL_PAGE);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [debouncedSearch] = useDebounce(searchQuery, 500);

    const { data, isLoading, isError, error, isFetching } = useQuery<NotesCollectionResponse>({
        queryKey: [NOTES_QUERY_KEY, page, debouncedSearch],
        queryFn: () => fetchNotes({ page, search: debouncedSearch }),
        retry: 1,
        placeholderData: (previousData) => previousData,
    });

    const totalPages = data?.totalPages || 0;
    const notes = data?.notes || [];

    const handlePageChange = useCallback((selectedItem: { selected: number }) => {
        setPage(selectedItem.selected + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
        setPage(INITIAL_PAGE);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    if (isError) {
        toast.error(`Помилка завантаження: ${error instanceof Error ? error.message : "Невідома помилка"}`);
    }

    return (
        <main className="container mx-auto p-4 max-w-7xl">
            <header className="flex flex-wrap justify-between items-center py-4 border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">

                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                    <SearchBox
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="w-full md:w-1/3 mb-4 md:mb-0 flex justify-center">
                    {totalPages > 1 && (
                        <Pagination
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            forcePage={page - 1}
                        />
                    )}
                </div>

                <div className="w-full md:w-1/3 flex justify-end">
                    <button
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                        onClick={() => setIsModalOpen(true)}
                        type="button"
                    >
                        Create Note +
                    </button>
                </div>
            </header>

            {(isLoading || isFetching) && notes.length === 0 && (
                <p className="text-center py-10 text-lg text-gray-500">Завантаження нотаток...</p>
            )}

            {!isFetching && notes.length > 0 && (
                <NoteList notes={notes} />
            )}

            {!isLoading && !isError && notes.length === 0 && (
                <p className="text-center py-10 text-xl text-gray-700">
                    Не знайдено жодної нотатки за запитом "{searchQuery}".
                </p>
            )}

            {isModalOpen && (
                <Modal onClose={handleCloseModal}>
                    <NoteForm onCancel={handleCloseModal} />
                </Modal>
            )}
        </main>
    );
};

export default NotesClient;