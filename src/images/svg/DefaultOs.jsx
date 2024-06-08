import { useSelector } from 'react-redux'
import { selectors } from '@redux'

export default function SvgComponent(props) {
  const darkTheme = useSelector(selectors.getTheme) === 'dark'
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 64 64"
      fill={darkTheme ? '#decbfe' : '#ae9ccd'}
      {...props}
    >
      <g>
        <path d="M30.18 28.51H28.2c-.74 0-1.36.61-1.36 1.36v4.26c0 .74.61 1.36 1.36 1.36h1.98c.74 0 1.36-.61 1.36-1.36v-4.26c-.01-.74-.62-1.36-1.36-1.36zm.08 5.62c0 .04-.04.08-.08.08H28.2c-.04 0-.08-.04-.08-.08v-4.26c0-.04.04-.08.08-.08h1.98c.04 0 .08.04.08.08zM34.3 29.49h.85c.57 0 1.04.47 1.04 1.03a.49.49 0 0 0 .98 0c0-1.11-.9-2.01-2.01-2.01h-.86c-1.03 0-1.86.84-1.86 1.87s.83 1.87 1.86 1.87h.99c.5 0 .9.41.9.9v.46c0 .5-.41.89-.9.89h-.85c-.56 0-1.03-.47-1.03-1.03a.49.49 0 0 0-.98 0c0 1.11.89 2.01 2 2.01h.85c1.03 0 1.87-.84 1.87-1.87v-.46c0-1.04-.84-1.87-1.87-1.87h-.98c-.49 0-.89-.41-.89-.9s.4-.89.89-.89z"></path>
        <path d="M60.23 28.22c-1.82 0-3.34 1.3-3.7 3h-8.29c-.06-1.28-.27-2.52-.61-3.71h3.89c.21 0 .41-.09.55-.24l2.11-2.11a3.52 3.52 0 0 0 5.44-2.94c0-1.93-1.58-3.51-3.52-3.51-1.93 0-3.51 1.58-3.51 3.51 0 .65.18 1.27.51 1.79l-1.9 1.91h-4.12c-.76-1.9-1.87-3.63-3.25-5.08l.53-.53c.62.44 1.39.69 2.2.69 2.14 0 3.87-1.74 3.87-3.87a3.864 3.864 0 1 0-7.73 0c0 .74.22 1.45.58 2.04l-.58.58c-1.2-1.07-2.57-1.95-4.05-2.62v-4.41l1.92-2.09c.53.34 1.14.53 1.79.53 1.84 0 3.35-1.51 3.35-3.35S44.2 4.5 42.35 4.5C40.51 4.5 39 5.99 39 7.84c0 .61.17 1.19.47 1.68l-2.19 2.39c-.14.15-.21.34-.21.53v4.11c-1.36-.45-2.79-.72-4.28-.79V7.47a3.766 3.766 0 0 0 2.99-3.69 3.775 3.775 0 1 0-7.55 0c0 1.81 1.29 3.34 3 3.7v8.28c-1.5.07-2.93.34-4.29.79v-4.11c0-.2-.08-.39-.21-.53l-2.19-2.39c.29-.49.46-1.07.46-1.68a3.346 3.346 0 0 0-6.69 0c0 1.84 1.5 3.35 3.35 3.35.65 0 1.27-.19 1.78-.53l1.92 2.09v4.41c-1.61.72-3.09 1.7-4.37 2.88l-.86-.86a3.864 3.864 0 1 0-7.15-2.03c0 2.13 1.73 3.87 3.87 3.87.81 0 1.58-.26 2.2-.69l.84.83a16.06 16.06 0 0 0-2.97 4.78h-4.71l-1.91-1.91c.33-.53.51-1.14.51-1.79 0-1.93-1.58-3.51-3.51-3.51-1.94 0-3.52 1.58-3.52 3.51s1.58 3.51 3.52 3.51c.7 0 1.37-.22 1.92-.57l2.11 2.11c.15.15.35.24.55.24h4.49c-.35 1.19-.55 2.43-.61 3.7H7.49c-.37-1.7-1.89-3-3.7-3C1.69 28.22 0 29.92 0 32s1.69 3.78 3.78 3.78c1.81 0 3.34-1.3 3.7-3h8.27c.08 1.63.4 3.2.93 4.67h-3.43c-.96 0-1.89.39-2.57 1.06l-1.46 1.46c-.54-.4-1.22-.62-1.94-.62a3.37 3.37 0 0 0-3.37 3.36c0 1.86 1.51 3.37 3.37 3.37a3.37 3.37 0 0 0 3.36-3.37c0-.55-.14-1.08-.38-1.55l1.53-1.54c.39-.39.91-.6 1.46-.6h4.07c.67 1.41 1.56 2.7 2.59 3.85l-1.39 1.39c-.54-.32-1.19-.51-1.87-.51-2.04 0-3.72 1.66-3.72 3.72 0 2.04 1.67 3.72 3.72 3.72a3.726 3.726 0 0 0 3.04-5.87l1.34-1.34a15.94 15.94 0 0 0 4.33 2.85v5.51l-1.91 2.09c-.52-.34-1.13-.53-1.79-.53a3.35 3.35 0 0 0-3.35 3.35 3.346 3.346 0 0 0 6.69 0c0-.61-.17-1.19-.46-1.68l2.19-2.39c.13-.14.21-.33.21-.53v-5.2c1.36.46 2.79.72 4.29.79v8.28c-1.71.36-3 1.88-3 3.7a3.775 3.775 0 1 0 7.55 0c0-1.81-1.28-3.33-2.99-3.69v-8.29c1.49-.07 2.92-.35 4.28-.79v5.2c0 .21.07.4.21.53l2.19 2.39c-.3.5-.47 1.07-.47 1.68 0 1.84 1.51 3.34 3.35 3.34s3.35-1.5 3.35-3.34c0-1.85-1.51-3.35-3.35-3.35-.66 0-1.28.2-1.8.53l-1.91-2.09v-5.51c1.6-.72 3.06-1.68 4.34-2.85l1.33 1.34a3.726 3.726 0 0 0 3.04 5.87 3.72 3.72 0 1 0 0-7.44c-.68 0-1.33.19-1.87.51l-1.39-1.4a16.4 16.4 0 0 0 2.59-3.84h4.08c.55 0 1.07.22 1.46.61l1.53 1.53c-.25.47-.39.99-.39 1.55 0 1.86 1.52 3.37 3.37 3.37s3.36-1.51 3.36-3.37c0-1.85-1.51-3.36-3.36-3.36-.73 0-1.4.23-1.95.62l-1.45-1.45c-.69-.69-1.6-1.07-2.57-1.07h-3.43c.53-1.48.85-3.04.93-4.67h8.29c.36 1.7 1.87 3 3.7 3 2.08 0 3.77-1.7 3.77-3.78s-1.71-3.78-3.79-3.78zm-14.8 9.71a14.747 14.747 0 0 1-7.89 7.66c-1.71.7-3.58 1.09-5.54 1.09s-3.83-.39-5.55-1.09c-3.51-1.45-6.34-4.2-7.89-7.66v-.01c-.8-1.81-1.25-3.81-1.25-5.92 0-6.13 3.78-11.39 9.13-13.59 1.71-.7 3.59-1.09 5.55-1.09H32c1.96 0 3.82.39 5.54 1.09s3.29 1.73 4.62 3c1.6 1.54 2.85 3.43 3.64 5.55.01.03.02.05.03.08 0 .01 0 .01.01.02v.01c.54 1.55.85 3.2.85 4.93 0 2.11-.44 4.12-1.26 5.93z"></path>
        <path d="M44.36 29.2h-1.59c-.26-1-.65-1.95-1.17-2.84l1.11-1.11c.18-.17.27-.41.27-.64a.826.826 0 0 0-.27-.65l-2.66-2.67c-.18-.17-.41-.27-.65-.27s-.48.1-.64.27l-1.12 1.12c-.89-.53-1.84-.92-2.84-1.18v-1.58c0-.52-.42-.92-.92-.92h-3.76a.91.91 0 0 0-.91.92v1.58c-1 .26-1.96.65-2.85 1.18l-1.11-1.12a.908.908 0 0 0-1.29 0l-2.67 2.67c-.17.17-.27.41-.27.65s.1.47.27.64l1.12 1.11c-.53.89-.92 1.85-1.18 2.84h-1.58c-.51 0-.92.42-.92.92v3.76c0 .51.42.92.92.92h1.58c.26.99.65 1.95 1.18 2.84l-1.12 1.11c-.17.18-.27.41-.27.65s.1.48.27.64l2.67 2.67c.17.17.4.27.64.27s.48-.1.65-.27l1.11-1.12c.89.53 1.85.92 2.85 1.18v1.58c0 .52.41.92.91.92h3.76c.51 0 .92-.41.92-.92v-1.58c1-.26 1.95-.65 2.84-1.18l1.12 1.12c.17.17.4.27.64.27s.48-.1.65-.27l2.66-2.67c.18-.17.27-.4.27-.64s-.09-.48-.27-.65l-1.11-1.11c.52-.89.91-1.84 1.17-2.84h1.59c.51 0 .92-.42.92-.92v-3.76a.911.911 0 0 0-.92-.92zM39.84 32c0 4.32-3.52 7.84-7.84 7.84s-7.84-3.52-7.84-7.84 3.52-7.84 7.84-7.84 7.84 3.52 7.84 7.84z"></path>
      </g>
    </svg>
  )
}
