
import { useEffect, useCallback, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

    const preventDefault = useCallback((e: Event) => {

        e.preventDefault();
        e.stopPropagation();
    }, []);

    const enableScrollLock = useMemo(() => {
        if (typeof document === 'undefined' || !document.documentElement) return null;
        return document.documentElement;
    }, []);

    useEffect(() => {
        if (!enableScrollLock) return;

        const htmlElement = enableScrollLock;
        const scrollbarWidth = window.innerWidth - htmlElement.clientWidth;

        htmlElement.classList.add('no-scroll');
        document.body.classList.add('no-scroll');

        htmlElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

        const scrollBlocker = htmlElement;

        scrollBlocker.addEventListener('wheel', preventDefault, { passive: false });
        scrollBlocker.addEventListener('touchmove', preventDefault, { passive: false });


        return () => {
            htmlElement.classList.remove('no-scroll');
            document.body.classList.remove('no-scroll');

            htmlElement.style.removeProperty('--scrollbar-width');

            scrollBlocker.removeEventListener('wheel', preventDefault);
            scrollBlocker.removeEventListener('touchmove', preventDefault);
        };
    }, [preventDefault, enableScrollLock]);

    useEffect(() => {
        const root = document.getElementById('modal-root');
        if (root) {
            setModalRoot(root as HTMLElement);
        } else {
            setModalRoot(document.body);
        }
    }, []);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                onClose();
            }
        },
        [onClose],
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    if (!modalRoot) {
        return null;
    }

    return createPortal(
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}
        >
            <div className={css.modal}>
                <button
                    className={css.closeButton}
                    onClick={onClose}
                    aria-label="Закрити модальне вікно"
                >
                    &times;
                </button>
                {children}
            </div>
        </div>,
        modalRoot,
    );
};

export default Modal;
