import { LoadingCaption, LoadingGrid, Skeleton, SkeletonCard } from './LoadingState.styles';

const LoadingState = () => (
  <>
    <LoadingGrid aria-hidden="true">
      <SkeletonCard><Skeleton $height="160px" /><Skeleton $width="60%" /></SkeletonCard>
      <SkeletonCard><Skeleton $width="40%" /><Skeleton $height="44px" /><Skeleton $height="120px" /></SkeletonCard>
    </LoadingGrid>
    <LoadingCaption>LOADING WORD...</LoadingCaption>
  </>
);

export default LoadingState;
