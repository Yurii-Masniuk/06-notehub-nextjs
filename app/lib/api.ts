import axios, { type AxiosResponse } from 'axios';
import type { Note, NoteTag } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN || process.env.NOTEHUB_TOKEN;

if (!TOKEN) {
    console.error('NEXT_PUBLIC_NOTEHUB_TOKEN is not set in environment variables!');
}

const noteHub = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
    },
});

export interface FetchNotesParams {
    page?: number;
    perPage?: number;
    search?: string;
}

export interface CreateNotePayload {
    title: string;
    content: string;
    tag: NoteTag;
}

export interface NotesCollectionResponse {
    notes: Note[];
    totalPages: number;
}

export const fetchNotes = async (
    params: FetchNotesParams = {},
): Promise<NotesCollectionResponse> => {
    const finalParams: FetchNotesParams = { perPage: 12, ...params };

    const queryParams: Record<string, string> = {};

    if (finalParams.page !== undefined && finalParams.page !== null) {
        queryParams.page = finalParams.page.toString();
    }
    if (finalParams.perPage !== undefined && finalParams.perPage !== null) {
        queryParams.perPage = finalParams.perPage.toString();
    }
    if (finalParams.search) {
        queryParams.search = finalParams.search;
    }

    const urlParams = new URLSearchParams(queryParams).toString();

    const url = `/notes${urlParams ? '?' + urlParams : ''}`;

    const response: AxiosResponse<NotesCollectionResponse> = await noteHub.get(url);

    return response.data;
};

export const fetchNoteById = async (id: string | number): Promise<Note> => {
    const noteId = typeof id === 'number' ? id.toString() : id;
    const response: AxiosResponse<Note> = await noteHub.get(`/notes/${noteId}`);
    return response.data;
};

export const createNote = async (newNoteData: CreateNotePayload): Promise<Note> => {
    const response: AxiosResponse<Note> = await noteHub.post('/notes', newNoteData);

    return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
    const response: AxiosResponse<Note> = await noteHub.delete(`/notes/${id}`);

    return response.data;
};
