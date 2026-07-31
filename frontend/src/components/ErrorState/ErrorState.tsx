import { ErrorCard, ErrorCopy, ErrorTitle, RetryButton, Warning } from './ErrorState.styles';

type ErrorStateProps = { onRetry: () => void };

const ErrorState = ({ onRetry }: ErrorStateProps) => (
  <ErrorCard>
    <Warning aria-hidden="true">!</Warning>
    <ErrorTitle>CONNECTION LOST</ErrorTitle>
    <ErrorCopy>Couldn&apos;t fetch a new word from the server. Check your connection and try again.</ErrorCopy>
    <RetryButton onClick={onRetry}>RETRY</RetryButton>
  </ErrorCard>
);

export default ErrorState;
