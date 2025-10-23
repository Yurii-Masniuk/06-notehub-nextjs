import css from './loading.module.css';

export default function Loading() {
  return (
    <div className={css.container}>
      <p>Loading, please wait...</p>
    </div>
  );
}
